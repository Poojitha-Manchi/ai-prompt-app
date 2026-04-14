"use client";

import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from "react";
import { SendHorizonal, Square } from "lucide-react";

interface PromptInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isLoading: boolean;
}

export default function PromptInput({
  onSend,
  onStop,
  isLoading,
}: PromptInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isLoading) {
      textareaRef.current?.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [input]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto flex items-end gap-2 p-4"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
          disabled={isLoading}
          aria-label="Message input"
          className="flex-1 resize-none rounded-xl border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-colors"
        />
        {isLoading ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop generating"
            className="flex-shrink-0 h-11 w-11 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors"
          >
            <Square size={16} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Send message"
            className="flex-shrink-0 h-11 w-11 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white disabled:text-zinc-500 flex items-center justify-center transition-colors"
          >
            <SendHorizonal size={16} />
          </button>
        )}
      </form>
      <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 pb-3">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
