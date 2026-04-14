"use client";

import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "@/app/lib/storage";

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

export default function MessageBubble({
  message,
  isStreaming,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 px-4 py-4 ${
        isUser
          ? "bg-transparent"
          : "bg-zinc-50 dark:bg-zinc-800/50"
      }`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-emerald-600 text-white"
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
          {isUser ? "You" : "AI"}
        </p>
        {isUser ? (
          <p className="text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap break-words">
            {message.content}
          </p>
        ) : (
          <div className="prose prose-zinc dark:prose-invert prose-sm max-w-none break-words">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
            {isStreaming && (
              <span className="inline-block w-1.5 h-4 bg-zinc-500 dark:bg-zinc-400 animate-pulse ml-0.5 align-text-bottom" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
