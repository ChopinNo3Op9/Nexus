import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Simple in-memory cache for market data to avoid rate limits
let marketDataCache: any = null;
let lastFetchTime = 0;

async function getMarketData() {
  if (Date.now() - lastFetchTime < 60000 && marketDataCache) return marketDataCache;
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true');
    const data = await res.json();
    marketDataCache = data;
    lastFetchTime = Date.now();
    return data;
  } catch (e) {
    console.error("CoinGecko fetch error:", e);
    return marketDataCache || { 
      bitcoin: { usd: 65000, usd_24h_change: 2.5 }, 
      ethereum: { usd: 3500, usd_24h_change: 1.2 }, 
      solana: { usd: 150, usd_24h_change: -0.5 } 
    };
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Market API Route for Frontend
  app.get("/api/market", async (req, res) => {
    const data = await getMarketData();
    res.json(data);
  });

  // Chat API Route
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages array" });
      }

      // Fetch live market data to inject into the system prompt
      const liveMarketData = await getMarketData();
      const marketContext = `\n\n[SYSTEM DATA: Current Real-Time Market Prices (USD): ${JSON.stringify(liveMarketData)}] Use this real-time data to inform your analysis.`;

      let chatHistoryText = "";
      for (const msg of messages) {
        chatHistoryText += `${msg.role === 'user' ? 'User' : 'Agent'}: ${msg.content}\n\n`;
      }

      chatHistoryText += "Agent: ";

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: chatHistoryText,
        config: {
          systemInstruction: "You are a cutting-edge Web3 and crypto trading analyzing agent named 'Nexus'. You talk with a cyberpunk, cyber-secure, and highly analytical tone. You provide insights on crypto markets, analyze tokens, and give strategic trading advice. Use data-driven language. Keep responses concise, structured, and visually clean." + marketContext,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "An error occurred during analysis" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
