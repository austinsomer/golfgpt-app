import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { colors, spacing, radius, typography, borders } from '../constants/theme';

interface Props {
  value: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

function formatDisplayDate(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  if (d.getTime() === today.getTime()) {
    return 'Today';
  }
  if (d.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  }
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function DatePickerButton({ value, onChange, minDate, maxDate }: Props) {
  const [show, setShow] = useState(false);

  const handleChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShow(false);
    if (selected) onChange(selected);
  };

  const confirm = () => setShow(false);

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={() => setShow(true)}>
        <Text style={styles.dayLabel}>{formatDisplayDate(value)}</Text>
        <Text style={styles.fullDate}>
          {value.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      {/* Android: shows inline */}
      {Platform.OS === 'android' && show && (
        <DateTimePicker
          value={value}
          mode="date"
          display="calendar"
          onChange={handleChange}
          minimumDate={minDate}
          maximumDate={maxDate}
        />
      )}

      {/* iOS: modal with spinner */}
      {Platform.OS === 'ios' && (
        <Modal
          visible={show}
          transparent
          animationType="none"
          onRequestClose={() => setShow(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>SELECT DATE</Text>
                <TouchableOpacity onPress={confirm}>
                  <Text style={styles.doneText}>DONE</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={value}
                mode="date"
                display="spinner"
                onChange={handleChange}
                minimumDate={minDate}
                maximumDate={maxDate}
                style={styles.picker}
                textColor={colors.textPrimary}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: borders.default,
    borderColor: colors.borderDefault,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  dayLabel: {
    fontFamily: typography.bodyBold,
    fontSize: 15,
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  fullDate: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  chevron: {
    fontSize: 20,
    color: colors.borderDefault,
    fontWeight: '300',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.bgCream,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: borders.default,
    borderBottomColor: colors.borderDefault,
  },
  modalTitle: {
    fontFamily: typography.bodyBold,
    fontSize: typography.sectionLabel.fontSize,
    letterSpacing: typography.sectionLabel.letterSpacing,
    color: colors.textSecondary,
  },
  doneText: {
    fontFamily: typography.bodyBold,
    fontSize: typography.button.fontSize,
    letterSpacing: typography.button.letterSpacing,
    color: colors.brandGreen,
  },
  picker: {
    height: 180,
  },
});
