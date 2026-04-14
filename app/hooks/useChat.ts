"use client";

import { useState, useCallback, useRef } from "react";
import {
  Message,
  Conversation,
  generateId,
  saveConversation,
  deriveTitle,
} from "@/app/lib/storage";

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  stopGenerating: () => void;
  clearError: () => void;
  setMessages: (messages: Message[]) => void;
  conversationId: string;
  setConversationId: (id: string) => void;
}

export function useChat(initialConversationId?: string): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState(
    initialConversationId || generateId()
  );
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopGenerating = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsLoading(false);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isLoading) return;

      setError(null);
      const userMessage: Message = { role: "user", content: trimmed };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setIsLoading(true);

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: updatedMessages }),
          signal: abortController.signal,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(
            data?.error || `Request failed with status ${res.status}`
          );
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response stream available");

        const decoder = new TextDecoder();
        let assistantContent = "";

        const assistantMessage: Message = { role: "assistant", content: "" };
        const withAssistant = [...updatedMessages, assistantMessage];
        setMessages(withAssistant);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          assistantContent += chunk;

          setMessages([
            ...updatedMessages,
            { role: "assistant", content: assistantContent },
          ]);
        }

        const finalMessages: Message[] = [
          ...updatedMessages,
          { role: "assistant", content: assistantContent },
        ];
        setMessages(finalMessages);

        const conversation: Conversation = {
          id: conversationId,
          title: deriveTitle(finalMessages),
          messages: finalMessages,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        saveConversation(conversation);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        const msg =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(msg);
        setMessages(updatedMessages);
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [messages, isLoading, conversationId]
  );

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    stopGenerating,
    clearError,
    setMessages,
    conversationId,
    setConversationId,
  };
}
