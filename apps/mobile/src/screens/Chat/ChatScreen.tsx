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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MessageBubble } from '../../components/MessageBubble';
import { useChatStore } from '../../store/chatStore';
import { colors, spacing, radius, typography, borders } from '../../constants/theme';

const SUGGESTION_CHIPS = [
  'MORNING SLOTS IN SLC',
  '9 HOLES NEAR ME',
  'SAND HOLLOW THIS WEEKEND',
  'BEST DEALS TODAY',
];

export function ChatScreen() {
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const { messages, isLoading, addMessage } = useChatStore();

  const handleSend = (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg) return;

    addMessage({ role: 'user', content: msg });
    setInput('');

    // TODO: call AI endpoint
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content: "I found several tee times matching your request. (Caddy Bot AI integration coming soon!)",
      });
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <View style={styles.statusDot} />
          <Text style={styles.headerTitle}>CADDY BOT</Text>
        </View>
        <Text style={styles.headerSub}>Your Utah golf assistant</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          showsVerticalScrollIndicator={false}
        />

        {/* Suggestion chips */}
        {messages.length <= 1 && (
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
              >
                <Text style={styles.chipText}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Input bar — thick border is the focal point */}
        <View style={styles.inputBar}>
          <Ionicons name="mic-outline" size={20} color={colors.textMuted} style={styles.micIcon} />
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask about tee times..."
            placeholderTextColor={colors.textMuted}
            multiline
            returnKeyType="send"
            onSubmitEditing={() => handleSend()}
          />
          <TouchableOpacity
            style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
            onPress={() => handleSend()}
            disabled={!input.trim() || isLoading}
          >
            <Ionicons name="arrow-up" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgCream,
  },
  flex: {
    flex: 1,
  },
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
  chipsRow: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  // Pill chips — full rounded, outlined in brand green
  chip: {
    borderWidth: borders.active,
    borderColor: colors.brandGreen,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: 'transparent',
  },
  chipText: {
    fontFamily: typography.bodyBold,
    fontSize: typography.caption.fontSize,
    letterSpacing: typography.caption.letterSpacing,
    color: colors.brandGreen,
    textTransform: 'uppercase',
  },
  // Input bar — thick border is deliberate
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: spacing.md,
    borderWidth: borders.input,
    borderColor: colors.brandGreen,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    minHeight: 56,
  },
  micIcon: {
    paddingHorizontal: spacing.sm,
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
