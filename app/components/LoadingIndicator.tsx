"use client";

export default function LoadingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <div className="flex gap-1">
        <span className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce [animation-delay:0ms]" />
        <span className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce [animation-delay:150ms]" />
        <span className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce [animation-delay:300ms]" />
      </div>
      <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-2">
        AI is thinking...
      </span>
    </div>
  );
}
