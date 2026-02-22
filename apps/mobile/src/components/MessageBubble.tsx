import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../store/chatStore';
import { colors, spacing, radius, typography, borders } from '../constants/theme';

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        <Text style={[styles.text, isUser ? styles.textUser : styles.textAssistant]}>
          {message.content}
        </Text>
      </View>
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
    maxWidth: '82%',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  // User: filled green
  bubbleUser: {
    backgroundColor: colors.brandGreen,
    borderBottomRightRadius: radius.sm,
  },
  // Assistant: outlined, transparent-ish — blends with cream bg
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
});
