# AI Prompt App

A lightweight AI-powered chat application built with **Next.js**, **TypeScript**, **Tailwind CSS**, and the **OpenAI API**. Users can input prompts, receive streamed AI responses in real-time, and manage their conversation history.

## Features

- **Prompt Input** -- textarea with submit button, keyboard shortcuts (Enter to send, Shift+Enter for new line)
- **Streaming Responses** -- AI responses stream in token-by-token for a real-time feel
- **Markdown Rendering** -- AI responses render with full markdown support (code blocks, lists, tables, etc.)
- **Error Handling** -- structured error messages for invalid keys, rate limits, network failures with retry
- **Loading States** -- animated indicators while waiting for AI responses
- **Chat History** -- conversations persist in localStorage with a sidebar for browsing past chats
- **Clear History** -- delete individual conversations or clear all history with confirmation
- **Dark Mode** -- automatic dark/light theme based on system preferences
- **Responsive Design** -- works on desktop and mobile with a collapsible sidebar
- **Secure** -- API key stays server-side via Next.js API route, never exposed to the browser

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) | React framework with App Router and API routes |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first CSS framework |
| [OpenAI SDK](https://github.com/openai/openai-node) | Official Node.js client for the OpenAI API |
| [react-markdown](https://github.com/remarkjs/react-markdown) | Render markdown in AI responses |
| [Lucide React](https://lucide.dev/) | Icon library |

## Prerequisites

- **Node.js** 18.0 or higher
- **npm** 8.0 or higher
- An **OpenAI API key** ([get one here](https://platform.openai.com/api-keys))

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/ai-prompt-app.git
cd ai-prompt-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file and add your OpenAI API key:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and replace the placeholder with your actual key:

```
OPENAI_API_KEY=sk-your-actual-api-key
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key for GPT-3.5-turbo |

## Project Structure

```
ai-prompt-app/
├── app/
│   ├── api/chat/route.ts       # API route - proxies to OpenAI with streaming
│   ├── components/
│   │   ├── ChatContainer.tsx   # Main orchestrator component
│   │   ├── ChatHistory.tsx     # Sidebar with conversation history
│   │   ├── LoadingIndicator.tsx# Animated loading dots
│   │   ├── MessageBubble.tsx   # Individual chat message
│   │   ├── MessageList.tsx     # Scrollable message area
│   │   └── PromptInput.tsx     # Text input with send/stop buttons
│   ├── hooks/
│   │   └── useChat.ts          # Custom hook for chat state and streaming
│   ├── lib/
│   │   ├── openai.ts           # OpenAI client singleton
│   │   └── storage.ts          # localStorage helpers for persistence
│   ├── globals.css             # Global styles and Tailwind imports
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── .env.example                # Environment variable template
├── package.json
├── tsconfig.json
└── README.md
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Create optimized production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Deployment

The easiest way to deploy is via [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository on [vercel.com/new](https://vercel.com/new)
3. Add `OPENAI_API_KEY` in the Environment Variables settings
4. Deploy

## License

MIT
