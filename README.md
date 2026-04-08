# Typing Test Frontend - Update test

React + TypeScript + Vite client for the typing test app.

## Features

- Sentence and paragraph typing modes
- Difficulty levels: easy, medium, hard
- Live stats: WPM, accuracy, elapsed time, and progress
- Light and dark theme toggle
- Local prompt generation in the client

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4

## Prerequisites

- Node.js 18+
- npm

## Install

Run in the repository root:

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

1. In the repository root run npm run dev.
2. Open the URL shown by Vite.

## Project Structure

- src/pages/TypingTestPage.tsx
  - Main typing test page and state management
- src/lib/api.ts
  - In-memory prompt generation for sentence/paragraph modes
- src/lib/metrics.ts
  - WPM and accuracy calculations
- src/components/typing/
  - Prompt display and stat components

## Notes

- Prompt content and difficulty handling are fully local in the frontend.
