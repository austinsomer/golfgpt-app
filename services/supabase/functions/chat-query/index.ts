/**
 * GolfGPT Chat Query — Supabase Edge Function
 * POST /functions/v1/chat-query
 *
 * Body: { messages: { role: 'user' | 'assistant', content: string }[] }
 * Returns: { message: string, teeTimeResults?: TeeTimeRow[] + course info }
 *
 * Env vars required (set in Supabase Dashboard → Project Settings → Edge Functions):
 *   OPENAI_API_KEY
 *   SUPABASE_URL          (auto-injected by Supabase)
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'function';
  content: string | null;
  name?: string;
  function_call?: { name: string; arguments: string };
}

interface SearchArgs {
  date?: string;          // YYYY-MM-DD
  players?: number;       // 1-4
  county?: string;        // salt_lake | utah | weber | davis | etc.
  max_price?: number;
  time_from?: string;     // HH:MM 24hr
  time_to?: string;       // HH:MM 24hr
}

// ─── OpenAI function definition ───────────────────────────────────────────────

const SEARCH_FUNCTION = {
  name: 'search_tee_times',
  description:
    'Search for available golf tee times in Utah. Use this whenever the user asks about availability, courses, prices, or tee times.',
  parameters: {
    type: 'object',
    properties: {
      date: {
        type: 'string',
        description:
          "Date in YYYY-MM-DD format. Use today's date if not specified. For relative terms like 'this weekend', 'tomorrow', 'Saturday' — resolve to the actual date.",
      },
      players: {
        type: 'integer',
        description: 'Number of players (1, 2, 3, or 4). Default 1.',
        enum: [1, 2, 3, 4],
      },
      county: {
        type: 'string',
        description:
          "Utah county slug. Options: salt_lake, utah, weber, davis, summit, washington, cache, box_elder, tooele, iron, kane. Use 'salt_lake' for Salt Lake City / SLC area.",
        enum: [
          'salt_lake', 'utah', 'weber', 'davis', 'summit',
          'washington', 'cache', 'box_elder', 'tooele', 'iron', 'kane',
        ],
      },
      max_price: {
        type: 'number',
        description: 'Maximum price per player in USD.',
      },
      time_from: {
        type: 'string',
        description: "Earliest tee time in HH:MM 24-hour format. For 'morning' use '06:00', 'afternoon' use '12:00'.",
      },
      time_to: {
        type: 'string',
        description: "Latest tee time in HH:MM 24-hour format. For 'morning' end use '12:00', 'afternoon' end use '17:00'.",
      },
    },
    required: [],
  },
};

// ─── Supabase query ────────────────────────────────────────────────────────────

async function runSearch(args: SearchArgs) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const date = args.date ?? todayStr;

  const dayStart = `${date}T00:00:00-07:00`;
  const dayEnd = `${date}T23:59:59-07:00`;

  let query = supabase
    .from('tee_times')
    .select('*, course:courses(id, name, county, booking_url, holes, address)')
    .gte('datetime', dayStart)
    .lte('datetime', dayEnd)
    .gt('expires_at', new Date().toISOString())
    .gte('players_available', args.players ?? 1)
    .order('datetime', { ascending: true })
    .limit(20);

  if (args.max_price !== undefined) {
    query = query.lte('price', args.max_price);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  let results = (data ?? []) as any[];

  // County filter
  if (args.county) {
    results = results.filter((r: any) => r.course?.county === args.county);
  }

  // Time of day filter
  if (args.time_from || args.time_to) {
    results = results.filter((r: any) => {
      const localTime = new Date(r.datetime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/Denver',
      });
      if (args.time_from && localTime < args.time_from) return false;
      if (args.time_to && localTime > args.time_to) return false;
      return true;
    });
  }

  return results.slice(0, 8);
}

// ─── Handler ──────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS });
  }

  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    if (!messages?.length) {
      return new Response(JSON.stringify({ error: 'messages required' }), {
        status: 400,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      timeZone: 'America/Denver',
    });

    const systemPrompt = `You are Caddy Bot, a friendly and knowledgeable Utah golf assistant for the GolfGPT app.

Today is ${dateStr} (Mountain Time). Your golf coverage area is Utah — you have access to 17 courses across Salt Lake, Utah County, and Weber County.

Your job is to help golfers find and book tee times. When a user asks anything about tee time availability, prices, courses, or scheduling — call search_tee_times. For casual conversation about golf strategy, courses, or general questions, respond naturally without searching.

After a search:
- If results found: briefly confirm what you found (1-2 sentences), then let the result cards speak for themselves. Don't list tee times in text.
- If no results: suggest broadening the search (different date, more flexible time, different county).
- Always be concise. Golfers don't want to read an essay.

County shortcuts to remember:
- "SLC", "Salt Lake", "downtown" → salt_lake
- "Provo", "Orem", "Utah County" → utah
- "Ogden", "Weber" → weber`;

    const openaiMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-10), // last 10 turns for context
    ];

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not configured');

    // ── First OpenAI call ──
    const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: openaiMessages,
        functions: [SEARCH_FUNCTION],
        function_call: 'auto',
        temperature: 0.4,
        max_tokens: 400,
      }),
    });

    if (!aiRes.ok) {
      const errBody = await aiRes.text();
      throw new Error(`OpenAI error: ${aiRes.status} ${errBody}`);
    }

    const aiData = await aiRes.json();
    const choice = aiData.choices?.[0];

    // ── No function call — plain text response ──
    if (choice?.finish_reason !== 'function_call') {
      return new Response(
        JSON.stringify({ message: choice?.message?.content ?? "I'm not sure about that one. Try asking about tee times!" }),
        { headers: { ...CORS, 'Content-Type': 'application/json' } },
      );
    }

    // ── Function call — run search ──
    const fnCall = choice.message.function_call!;
    let searchArgs: SearchArgs = {};
    try {
      searchArgs = JSON.parse(fnCall.arguments);
    } catch {
      throw new Error('Failed to parse function arguments');
    }

    const searchResults = await runSearch(searchArgs);

    // ── Second OpenAI call — generate reply knowing results ──
    const resultsContext = searchResults.length === 0
      ? 'The search returned no results.'
      : `Found ${searchResults.length} tee time(s) on ${searchArgs.date ?? 'today'}. Results will be shown as cards to the user.`;

    const secondMessages: ChatMessage[] = [
      ...openaiMessages,
      { role: 'assistant', content: null, function_call: fnCall },
      { role: 'function', name: 'search_tee_times', content: resultsContext },
    ];

    const finalRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: secondMessages,
        temperature: 0.4,
        max_tokens: 200,
      }),
    });

    const finalData = await finalRes.json();
    const finalMessage = finalData.choices?.[0]?.message?.content
      ?? (searchResults.length > 0 ? `Found ${searchResults.length} tee time(s) for you.` : 'Nothing available matching that search. Try a different date or area.');

    return new Response(
      JSON.stringify({ message: finalMessage, teeTimeResults: searchResults }),
      { headers: { ...CORS, 'Content-Type': 'application/json' } },
    );

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    console.error('[chat-query]', message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } },
    );
  }
});
