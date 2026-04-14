"use client";

import { useEffect, useRef } from "react";
import { MessageSquare } from "lucide-react";
import type { Message } from "@/app/lib/storage";
import MessageBubble from "./MessageBubble";
import LoadingIndicator from "./LoadingIndicator";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
          <MessageSquare size={28} className="text-zinc-400 dark:text-zinc-500" />
        </div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          How can I help you today?
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
          Type a message below and press Enter to send. I&apos;ll respond using
          AI.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto divide-y divide-zinc-100 dark:divide-zinc-800">
        {messages.map((msg, idx) => {
          const isLastAssistant =
            msg.role === "assistant" && idx === messages.length - 1;
          return (
            <MessageBubble
              key={idx}
              message={msg}
              isStreaming={isLastAssistant && isLoading}
            />
          );
        })}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <LoadingIndicator />
        )}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
