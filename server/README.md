# Typing Test Backend

Express API for serving typing prompts and app health status.

## Features

- Health endpoint for uptime checks
- Random sentence prompts by difficulty
- Random paragraph prompts by difficulty
- Route-controller separation for cleaner server structure

## Tech Stack

- Node.js
- Express 5
- CORS

## Prerequisites

- Node.js 18+
- npm

## Environment Variables

Create a .env file in the server folder as needed.

- PORT
  - Default: 4000
- FRONTEND_URL
  - Default: *
  - Controls CORS origin

Example:

PORT=4000
FRONTEND_URL=http://localhost:5173

## Install

Run in the server folder:

npm install

## Available Scripts

- npm run dev
  - Starts the server with watch mode
- npm start
  - Starts the server normally
- npm test
  - Placeholder script

## API Endpoints

- GET /api/health
  - Response: { status: "ok" }

- GET /api/sentence?difficulty=easy|medium|hard
  - Response shape:
    - sentence: string
    - difficulty: easy | medium | hard

- GET /api/paragraph?difficulty=easy|medium|hard
  - Response shape:
    - paragraph: string
    - difficulty: easy | medium | hard

If difficulty is missing or invalid, the API defaults to medium.

## Project Structure

- index.js
  - App setup, middleware, and route registration
- routes/
  - sentence.js
  - paragraph.js
- controllers/
  - sentenceController.js
  - paragraphController.js

Routes are intentionally thin and delegate request handling to controllers.