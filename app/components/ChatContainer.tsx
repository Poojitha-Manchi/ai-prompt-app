"use client";

import { useState, useEffect, useCallback } from "react";
import { Menu, X, AlertCircle, RotateCcw } from "lucide-react";
import { useChat } from "@/app/hooks/useChat";
import {
  Conversation,
  loadConversations,
  deleteConversation,
  clearAllConversations,
  generateId,
} from "@/app/lib/storage";
import ChatHistory from "./ChatHistory";
import MessageList from "./MessageList";
import PromptInput from "./PromptInput";

export default function ChatContainer() {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    stopGenerating,
    clearError,
    setMessages,
    conversationId,
    setConversationId,
  } = useChat();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const refreshConversations = useCallback(() => {
    setConversations(loadConversations());
  }, []);

  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      refreshConversations();
    }
  }, [isLoading, messages.length, refreshConversations]);

  const handleSelectConversation = (conv: Conversation) => {
    setConversationId(conv.id);
    setMessages(conv.messages);
    setSidebarOpen(false);
  };

  const handleNewChat = () => {
    setConversationId(generateId());
    setMessages([]);
    clearError();
    setSidebarOpen(false);
  };

  const handleDeleteConversation = (id: string) => {
    deleteConversation(id);
    refreshConversations();
    if (id === conversationId) {
      handleNewChat();
    }
  };

  const handleClearAll = () => {
    clearAllConversations();
    setConversations([]);
    handleNewChat();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-zinc-900">
      <ChatHistory
        conversations={conversations}
        activeId={conversationId}
        onSelect={handleSelectConversation}
        onNewChat={handleNewChat}
        onDelete={handleDeleteConversation}
        onClearAll={handleClearAll}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-3 px-4 py-3 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors md:hidden"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              AI Prompt App
            </h1>
          </div>
          <button
            onClick={handleNewChat}
            className="text-sm px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            New Chat
          </button>
        </header>

        {error && (
          <div className="mx-4 mt-3 flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-300">
            <AlertCircle size={16} className="flex-shrink-0" />
            <p className="flex-1">{error}</p>
            <button
              onClick={() => {
                clearError();
                if (messages.length > 0) {
                  const lastUserMsg = [...messages]
                    .reverse()
                    .find((m) => m.role === "user");
                  if (lastUserMsg) {
                    setMessages(messages.slice(0, -1));
                    sendMessage(lastUserMsg.content);
                  }
                }
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              aria-label="Retry"
            >
              <RotateCcw size={14} />
              Retry
            </button>
            <button
              onClick={clearError}
              className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              aria-label="Dismiss error"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <MessageList messages={messages} isLoading={isLoading} />

        <PromptInput
          onSend={sendMessage}
          onStop={stopGenerating}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
