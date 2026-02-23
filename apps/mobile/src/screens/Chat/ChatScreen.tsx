import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MessageBubble } from '../../components/MessageBubble';
import { useChatStore, Message } from '../../store/chatStore';
import { queryCaddy, ChatMessage } from '../../api/chat';
import { colors, spacing, radius, typography, borders } from '../../constants/theme';

const SUGGESTION_CHIPS = [
  'Any slots today under $40?',
  'Morning tee times in SLC',
  '4 players this Saturday',
  'What courses are in Weber County?',
];

export function ChatScreen() {
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const { messages, isLoading, addMessage, setLoading } = useChatStore();
  const insets = useSafeAreaInsets();

  const handleSend = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || isLoading) return;
    setInput('');

    addMessage({ role: 'user', content: msg });

    // Build conversation history for the API (exclude welcome + result metadata)
    const history: ChatMessage[] = messages
      .filter((m) => m.id !== 'welcome')
      .slice(-9) // last 9 + new = 10 turns
      .map((m: Message) => ({ role: m.role, content: m.content }));
    history.push({ role: 'user', content: msg });

    setLoading(true);
    try {
      const response = await queryCaddy(history);
      addMessage({
        role: 'assistant',
        content: response.message,
        teeTimeResults: response.teeTimeResults,
      });
    } catch (err) {
      addMessage({
        role: 'assistant',
        content: "Sorry, I couldn't connect right now. Try again in a moment.",
      });
    } finally {
      setLoading(false);
      // Scroll to bottom after response
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    // Exclude bottom from SafeAreaView — KAV handles keyboard, we handle inset manually
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <View style={[styles.statusDot, isLoading && styles.statusDotLoading]} />
          <Text style={styles.headerTitle}>CADDY BOT</Text>
        </View>
        <Text style={styles.headerSub}>AI · Utah golf assistant</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          style={styles.flex}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isLoading ? (
              <View style={styles.typingIndicator}>
                <ActivityIndicator size="small" color={colors.brandGreen} />
                <Text style={styles.typingText}>Caddy Bot is thinking...</Text>
              </View>
            ) : null
          }
        />

        {/* Suggestion chips — only before any user messages */}
        {messages.filter((m) => m.role === 'user').length === 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            {SUGGESTION_CHIPS.map((chip) => (
              <TouchableOpacity
                key={chip}
                style={styles.chip}
                onPress={() => handleSend(chip)}
                disabled={isLoading}
              >
                <Text style={styles.chipText}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Input bar — bottom inset handled manually instead of via SafeAreaView */}
        <View style={[styles.inputWrapper, { paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.sm }]}>
          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Ask about tee times..."
              placeholderTextColor={colors.textMuted}
              multiline
              returnKeyType="send"
              onSubmitEditing={() => handleSend()}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[styles.sendButton, (!input.trim() || isLoading) && styles.sendButtonDisabled]}
              onPress={() => handleSend()}
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Ionicons name="arrow-up" size={18} color={colors.white} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgCream },
  flex: { flex: 1 },
  headerBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: borders.default,
    borderBottomColor: colors.borderDefault,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.statusGreen,
  },
  statusDotLoading: {
    backgroundColor: colors.textMuted,
  },
  headerTitle: {
    fontFamily: typography.serif,
    fontSize: 16,
    letterSpacing: 1,
    color: colors.textPrimary,
    textTransform: 'uppercase',
  },
  headerSub: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.textMuted,
  },
  messageList: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  typingText: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  chipsRow: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
    alignItems: 'center', // prevent vertical stretch
  },
  chip: {
    borderWidth: borders.active,
    borderColor: colors.brandGreen,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipText: {
    fontFamily: typography.bodyBold,
    fontSize: 12,
    color: colors.brandGreen,
  },
  inputWrapper: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: borders.input,
    borderColor: colors.brandGreen,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    minHeight: 56,
  },
  input: {
    flex: 1,
    fontFamily: typography.bodyItalic,
    fontSize: 15,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
    maxHeight: 100,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.brandGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
  sendButtonDisabled: {
    backgroundColor: colors.borderDefault,
  },
});
