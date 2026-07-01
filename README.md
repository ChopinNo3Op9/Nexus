# Nexus Web3 Analyzer

Nexus is a cyberpunk-styled Web3 trading analyzing agent. It acts as an advanced analyzer simulation to provide insights on crypto markets, analyze tokens, and give strategic trading advice based on live data and historical context.

## Demo

<div align="center">
  <img src="https://raw.githubusercontent.com/ChopinNo3Op9/Nexus/main/demo.gif" 
       alt="QuantForge Demo" 
       width="100%">
</div>

## Features

- **Cyberpunk UI**: A highly stylized, terminal-like interface with live market data visualizations.
- **AI Agent**: Analyzes Web3 markets and answers user queries using the Gemini model.
- **Live Market Feed**: Fetches real-time price and 24h change data for major cryptocurrencies (Bitcoin, Ethereum, Solana).
- **Market Data Injection**: Injects live market data into the AI's context for more accurate analytical responses.

## Prerequisites

- Node.js (v18 or higher recommended)
- A Gemini API Key

## Environment Setup

1. Copy the sample environment file to create your own configuration:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and add your Gemini API Key:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```

## Installation

Install the required dependencies using npm:

```bash
npm install
```

## Running the Application

### Development Mode

To run the application in development mode:

```bash
npm run dev
```

The application will start on `http://localhost:3000`.

### Production Build

To build the application for production:

```bash
npm run build
```

This will bundle the React frontend into static files and compile the Express backend.

### Starting in Production

After building, you can start the production server:

```bash
npm start
```

## Architecture

- **Frontend**: React, Tailwind CSS, Recharts, Lucide React, Framer Motion
- **Backend**: Express.js server providing API routes for chat (`/api/chat`) and market data (`/api/market`).
- **AI Integration**: `@google/genai` SDK used in the Express backend to securely communicate with the Gemini API.
