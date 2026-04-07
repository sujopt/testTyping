# Typing Test Frontend

React + TypeScript + Vite client for the typing test app.

## Features

- Sentence and paragraph typing modes
- Difficulty levels: easy, medium, hard
- Live stats: WPM, accuracy, elapsed time, and progress
- Light and dark theme toggle
- Prompt fetching from backend API

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4

## Prerequisites

- Node.js 18+
- npm

## Environment Variables

Create a .env file in the client folder if you want a custom backend URL.

- VITE_API_URL
  - Default: http://localhost:4000
  - Used by src/lib/api.ts for API requests

Example:

VITE_API_URL=http://localhost:4000

## Install

Run in the client folder:

npm install

## Available Scripts

- npm run dev
  - Starts Vite development server
- npm run build
  - Type-checks and builds production assets
- npm run preview
  - Previews the production build locally
- npm run lint
  - Runs ESLint

## Run Locally

1. Start the backend server first (see server README).
2. In the client folder run npm run dev.
3. Open the URL shown by Vite.

## Project Structure

- src/pages/TypingTestPage.tsx
  - Main typing test page and state management
- src/lib/api.ts
  - API calls for sentence/paragraph prompts
- src/lib/metrics.ts
  - WPM and accuracy calculations
- src/components/typing/
  - Prompt display and stat components

## Notes

- API calls expect the backend endpoints:
  - GET /api/sentence?difficulty=easy|medium|hard
  - GET /api/paragraph?difficulty=easy|medium|hard
