import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../store/chatStore';
import { TeeTimeResultCards } from './TeeTimeResultCard';
import { colors, spacing, radius, typography, borders } from '../constants/theme';

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';
  const hasResults = !isUser && message.teeTimeResults && message.teeTimeResults.length > 0;

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}>
      {/* Text bubble */}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        <Text style={[styles.text, isUser ? styles.textUser : styles.textAssistant]}>
          {message.content}
        </Text>
      </View>

      {/* Inline tee time result cards (assistant only) */}
      {hasResults && (
        <View style={styles.resultsWrap}>
          <TeeTimeResultCards results={message.teeTimeResults!} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginVertical: spacing.xs,
    marginHorizontal: spacing.md,
  },
  rowUser: {
    alignItems: 'flex-end',
  },
  rowAssistant: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '85%',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  bubbleUser: {
    backgroundColor: colors.brandGreen,
    borderBottomRightRadius: radius.sm,
  },
  bubbleAssistant: {
    backgroundColor: colors.bgCream,
    borderWidth: borders.active,
    borderColor: colors.brandGreenLight,
    borderBottomLeftRadius: radius.sm,
  },
  text: {
    fontSize: 15,
    lineHeight: 23,
  },
  textUser: {
    fontFamily: typography.body,
    color: colors.white,
  },
  textAssistant: {
    fontFamily: typography.body,
    color: colors.textPrimary,
  },
  resultsWrap: {
    width: '100%',
    marginTop: spacing.xs,
  },
});
