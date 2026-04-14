"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  MessageSquare,
  X,
  AlertTriangle,
} from "lucide-react";
import type { Conversation } from "@/app/lib/storage";

interface ChatHistoryProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (conversation: Conversation) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatHistory({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onDelete,
  onClearAll,
  isOpen,
  onClose,
}: ChatHistoryProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearAll = () => {
    onClearAll();
    setShowConfirm(false);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:relative z-50 top-0 left-0 h-full w-72 bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-700 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
            Chat History
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={onNewChat}
              aria-label="New chat"
              className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
            >
              <Plus size={18} />
            </button>
            <button
              onClick={onClose}
              aria-label="Close sidebar"
              className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors md:hidden"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {conversations.length === 0 ? (
            <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center py-8">
              No conversations yet
            </p>
          ) : (
            <ul className="space-y-1">
              {conversations.map((conv) => (
                <li key={conv.id}>
                  <button
                    onClick={() => onSelect(conv)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-start gap-2 group transition-colors ${
                      conv.id === activeId
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <MessageSquare
                      size={14}
                      className="mt-0.5 flex-shrink-0 opacity-60"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{conv.title}</p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                        {formatDate(conv.updatedAt)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(conv.id);
                      }}
                      aria-label={`Delete conversation: ${conv.title}`}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {conversations.length > 0 && (
          <div className="p-3 border-t border-zinc-200 dark:border-zinc-700">
            {showConfirm ? (
              <div className="flex flex-col gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                  <AlertTriangle size={14} />
                  <span>Clear all history?</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleClearAll}
                    className="flex-1 text-xs px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Yes, clear all
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 text-xs px-3 py-1.5 border border-zinc-300 dark:border-zinc-600 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 size={14} />
                Clear All History
              </button>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
