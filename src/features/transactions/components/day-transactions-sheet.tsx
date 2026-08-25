import React, { useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import DraggableSheet from "@/core/common/components/DraggableSheet";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { startOfDay, endOfDay } from "date-fns";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
} from "@/core/common/constants/theme";
import { formatDate } from "@/core/common/utils/date";
import { useTransactions } from "../hooks/use-transactions";
import { Transaction } from "../transactions.interface";
import TransactionRow from "@/core/common/components/TransactionRow";
import GlassCard from "@/core/common/components/GlassCard";
import EmptyState from "@/core/common/components/EmptyState";
import SkeletonBox from "@/core/common/components/SkeletonBox";
import TransactionDetailSheet from "./transaction-detail-sheet";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface Props {
  date: Date | null;
  onClose: () => void;
}

export default function DayTransactionsSheet({ date, onClose }: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<Transaction | null>(null);

  const params = useMemo(() => {
    if (!date) return undefined;
    return {
      date_from: startOfDay(date).toISOString(),
      date_to: endOfDay(date).toISOString(),
      limit: 100,
    };
  }, [date]);

  const { transactions, isLoading } = useTransactions(params);
  const items = transactions?.data ?? [];

  const visible = date !== null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <DraggableSheet
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              paddingBottom: insets.bottom + SPACING.lg,
            },
          ]}
          onClose={onClose}
          handleColor={colors.borderStrong}
        >
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                { color: colors.textPrimary, fontFamily: FONTS.bold },
              ]}
            >
              {date ? formatDate(date) : ""}
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              style={[styles.closeBtn, { backgroundColor: colors.surface2 }]}
            >
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
          >
            {isLoading ? (
              <View style={{ gap: SPACING.sm }}>
                {[0, 1, 2].map((i) => (
                  <SkeletonBox
                    key={i}
                    width="100%"
                    height={56}
                    radius={RADIUS.lg}
                  />
                ))}
              </View>
            ) : items.length === 0 ? (
              <EmptyState
                icon="receipt-outline"
                message="No transactions on this day"
              />
            ) : (
              <GlassCard>
                <View style={{ paddingHorizontal: SPACING.base }}>
                  {items.map((tx, i) => (
                    <View
                      key={tx.id}
                      style={
                        i < items.length - 1
                          ? [
                              styles.separator,
                              { borderBottomColor: colors.border },
                            ]
                          : undefined
                      }
                    >
                      <TransactionRow
                        transaction={tx}
                        onPress={() => setSelected(tx)}
                      />
                    </View>
                  ))}
                </View>
              </GlassCard>
            )}
          </ScrollView>
        </DraggableSheet>
      </View>

      {selected && (
        <TransactionDetailSheet
          visible={!!selected}
          onClose={() => setSelected(null)}
          transaction={selected}
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    maxHeight: SCREEN_HEIGHT * 0.75,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  title: { fontSize: FONT_SIZE.h2, letterSpacing: -0.4 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.base,
  },
  separator: { borderBottomWidth: 1 },
});
