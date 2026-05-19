import React, { useRef, useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Keyboard,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { useIrisStore } from "../iris.state";
import { useCreateIrisSession } from "../hooks/use-iris-session";
import { useLoadMessages, useSendMessage } from "../hooks/use-iris-chat";
import { useIrisSuggestions } from "../hooks/use-iris-suggestions";
import ChatBubble from "./ChatBubble";
import SuggestionChips from "./SuggestionChips";
import TypingIndicator from "./TypingIndicator";

export default function IrisChatModal() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { isOpen, close, sessionId, messages, isSending, reset } = useIrisStore();
  const [inputText, setInputText] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const { mutate: createSession, isPending: isCreating } = useCreateIrisSession();
  const { data: suggestions = [] } = useIrisSuggestions();
  const sendMessage = useSendMessage();

  useLoadMessages(sessionId);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSub = Keyboard.addListener(showEvent, (e) => setKeyboardHeight(e.endCoordinates.height));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  // Start a new session whenever the modal opens without one
  useEffect(() => {
    if (isOpen && sessionId === null && !isCreating) {
      createSession();
    }
  }, [isOpen, sessionId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length, isSending]);

  const isInputBlocked = isSending || !sessionId;

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || isInputBlocked) return;
    setInputText("");
    sendMessage.mutate(text);
  };

  const handleClose = () => {
    close();
    reset();
  };

  const handleSuggestion = (text: string) => {
    if (isInputBlocked) return;
    sendMessage.mutate(text);
  };

  const showSuggestions = messages.length === 0 && !isCreating;

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={["top"]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.headerLeft}>
            <View style={[styles.irisAvatar, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="sparkles" size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Iris</Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSubtle }]}>
                Your AI financial advisor
              </Text>
            </View>
          </View>
          <Pressable onPress={handleClose} hitSlop={8} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color={colors.textSubtle} />
          </Pressable>
        </View>

        <View style={{ flex: 1, paddingBottom: keyboardHeight }}>
          {/* Message list */}
          {isCreating ? (
            <View style={styles.centerLoader}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(m) => String(m.id)}
              renderItem={({ item }) => <ChatBubble message={item} />}
              contentContainerStyle={styles.messageList}
              ListHeaderComponent={
                showSuggestions ? (
                  <View style={styles.welcomeWrap}>
                    <Text style={[styles.welcomeTitle, { color: colors.textPrimary }]}>
                      Hi, I'm Iris 👋
                    </Text>
                    <Text style={[styles.welcomeBody, { color: colors.textSubtle }]}>
                      Ask me anything about your finances.
                    </Text>
                  </View>
                ) : null
              }
              ListFooterComponent={
                isSending ? <TypingIndicator /> : null
              }
            />
          )}

          {/* Suggestion chips — show when no messages yet */}
          {showSuggestions && suggestions.length > 0 && (
            <SuggestionChips suggestions={suggestions} onSelect={handleSuggestion} />
          )}

          {/* Input row */}
          <View
            style={[
              styles.inputRow,
              {
                borderTopColor: colors.border,
                backgroundColor: colors.surface,
                paddingBottom: keyboardHeight > 0 ? 8 : insets.bottom + 8,
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: colors.textPrimary, backgroundColor: colors.surface2 }]}
              placeholder="Ask Iris anything..."
              placeholderTextColor={colors.textSubtle}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={2000}
              returnKeyType="send"
              onSubmitEditing={handleSend}
              blurOnSubmit
            />
            <Pressable
              onPress={handleSend}
              disabled={!inputText.trim() || isInputBlocked}
              style={[
                styles.sendBtn,
                {
                  backgroundColor:
                    inputText.trim() && !isInputBlocked ? colors.primary : colors.surface2,
                },
              ]}
            >
              <Ionicons
                name="arrow-up"
                size={18}
                color={inputText.trim() && !isInputBlocked ? "#FFFFFF" : colors.textSubtle}
              />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  irisAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: 12,
  },
  closeBtn: {
    padding: 4,
  },
  centerLoader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  messageList: {
    paddingVertical: 16,
    paddingBottom: 8,
  },
  welcomeWrap: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  welcomeBody: {
    fontSize: 15,
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 120,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
