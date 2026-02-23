import { supabase } from '../lib/supabase';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface TeeTimeResult {
  id: string;
  datetime: string;
  players_available: number | null;
  price: number | null;
  holes: number | null;
  course: {
    id: string;
    name: string;
    county: string;
    booking_url: string | null;
    holes: number | null;
    address: string | null;
  } | null;
}

export interface ChatQueryResponse {
  message: string;
  teeTimeResults?: TeeTimeResult[];
}

const FUNCTION_URL = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/chat-query`;

export async function queryCaddy(
  messages: ChatMessage[],
): Promise<ChatQueryResponse> {
  // Use Supabase's anon key for Edge Function auth
  const session = await supabase.auth.getSession();
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
      Authorization: `Bearer ${session.data.session?.access_token ?? anonKey}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Chat query failed: ${res.status} ${body}`);
  }

  return res.json() as Promise<ChatQueryResponse>;
}
