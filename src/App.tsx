import { useState, useRef, useEffect } from "react";
import { Send, Terminal, Activity, Zap, Cpu, BarChart3, Database, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from 'react-markdown';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

type Message = {
  id: string;
  role: "user" | "agent";
  content: string;
};

type MarketData = {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  }
};

const MOCK_CHART_DATA = [
  { val: 100 }, { val: 105 }, { val: 102 }, { val: 110 }, { val: 115 }, { val: 112 }, { val: 120 }
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "agent",
      content: "NEXUS Core online. Ready for Web3 protocol analysis and market vectoring. Awaiting input.",
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const res = await fetch('/api/market');
        const data = await res.json();
        setMarketData(data);
      } catch (err) {
        console.error("Failed to fetch market data", err);
      }
    };
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const chatHistoryForApi = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistoryForApi }),
      });

      if (!response.ok) {
        throw new Error("API Network Error");
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "agent",
          content: data.text || "NO DATA RETURNED.",
        }
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "agent",
          content: `ERROR: ${error.message}. SYSTEM FAILURE.`,
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearTerminal = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: "agent",
        content: "NEXUS Core memory wiped. Re-initialized. Awaiting input.",
      }
    ]);
  };

  const quickActions = [
    "Scan current market sentiment",
    "Analyze BTC potential",
    "Audit top DeFi protocols"
  ];

  return (
    <div className="min-h-screen bg-black text-emerald-400 font-mono flex flex-col md:flex-row p-2 md:p-6 gap-6 selection:bg-emerald-900 selection:text-emerald-200">
      
      {/* Side Panel */}
      <aside className="w-full md:w-80 flex-shrink-0 flex flex-col gap-6">
        <div className="border border-emerald-900/50 bg-black/50 p-6 rounded-sm shadow-[0_0_15px_rgba(16,185,129,0.1)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="relative">
              <Terminal className="w-8 h-8 text-emerald-400" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-widest uppercase text-white">NEXUS</h1>
              <p className="text-xs text-emerald-600 uppercase tracking-widest">Web3 Intelligence</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-emerald-600 uppercase tracking-wider">
                <span className="flex items-center gap-2"><Activity className="w-3 h-3" /> Core Temp</span>
                <span className="text-emerald-400">OPTIMAL</span>
              </div>
              <div className="h-1 bg-emerald-950 w-full overflow-hidden">
                <motion.div 
                  className="h-full bg-emerald-500 w-[34%]"
                  animate={{ width: ["34%", "45%", "34%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-emerald-600 uppercase tracking-wider">
                <span className="flex items-center gap-2"><Zap className="w-3 h-3" /> Network Load</span>
                <span className="text-emerald-400">84 Gwei</span>
              </div>
              <div className="h-1 bg-emerald-950 w-full overflow-hidden">
                <motion.div 
                  className="h-full bg-yellow-500 w-[84%]"
                  animate={{ width: ["84%", "78%", "89%", "84%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-emerald-600 uppercase tracking-wider">
                <span className="flex items-center gap-2"><Cpu className="w-3 h-3" /> Memory Bank</span>
                <span className="text-emerald-400">SYNCHED</span>
              </div>
              <div className="h-1 bg-emerald-950 w-full overflow-hidden">
                <div className="h-full bg-cyan-500 w-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="border border-emerald-900/50 bg-black/50 p-6 rounded-sm flex-grow flex flex-col justify-between">
          <div>
            <h2 className="text-xs text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Market Scanners
            </h2>
            <div className="space-y-4">
              {['bitcoin', 'ethereum', 'solana'].map((coin, i) => {
                const data = marketData?.[coin];
                const isPositive = data ? data.usd_24h_change >= 0 : true;
                return (
                  <div key={coin} className="flex flex-col text-sm border-b border-emerald-900/30 pb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-emerald-300 uppercase font-bold">{coin}</span>
                      {data ? (
                        <span className="text-white">${data.usd.toLocaleString()}</span>
                      ) : (
                        <span className="text-emerald-700 animate-pulse">SYNCING...</span>
                      )}
                    </div>
                    <div className="flex justify-between items-end h-8">
                      <div className="w-16 h-8 opacity-60">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={MOCK_CHART_DATA}>
                            <defs>
                              <linearGradient id={`color${coin}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <YAxis domain={['dataMin', 'dataMax']} hide />
                            <Area type="monotone" dataKey="val" stroke={isPositive ? "#10b981" : "#ef4444"} fillOpacity={1} fill={`url(#color${coin})`} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      {data && (
                        <span className={`text-xs ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                          {isPositive ? '+' : ''}{data.usd_24h_change.toFixed(2)}%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="text-[10px] text-emerald-800 mt-8 pt-4 border-t border-emerald-900/30 uppercase text-center tracking-widest">
            V 2.5.0 // LIVE DATA FEED
          </div>
        </div>
      </aside>

      {/* Main Chat Interface */}
      <main className="flex-grow flex flex-col border border-emerald-900/50 bg-black/50 rounded-sm overflow-hidden relative shadow-[0_0_20px_rgba(16,185,129,0.05)]">
        {/* Terminal Header */}
        <div className="bg-emerald-950/30 border-b border-emerald-900/50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs uppercase tracking-widest">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full opacity-70"></div>
              <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full opacity-70"></div>
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full opacity-70"></div>
            </div>
            <span className="text-emerald-500 opacity-80">Agent Session // [SECURE]</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={clearTerminal}
              className="text-emerald-600 hover:text-emerald-400 transition-colors flex items-center gap-2 text-xs uppercase tracking-widest"
              title="Clear Terminal"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Wipe</span>
            </button>
            <Database className="w-4 h-4 text-emerald-700" />
          </div>
        </div>

        {/* Chat Log */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <span className={`text-[10px] uppercase tracking-widest mb-1 opacity-60 ${msg.role === 'user' ? 'text-cyan-400' : 'text-emerald-500'}`}>
                  {msg.role === 'user' ? 'USER_INPUT' : 'NEXUS_RESPONSE'}
                </span>
                
                <div 
                  className={`
                    p-4 text-sm leading-relaxed border backdrop-blur-sm
                    ${msg.role === 'user' 
                      ? 'bg-cyan-950/20 border-cyan-900/50 text-cyan-50 rounded-tl-xl rounded-tr-sm rounded-bl-xl rounded-br-xl' 
                      : 'bg-emerald-950/20 border-emerald-900/50 text-emerald-50 rounded-tr-xl rounded-tl-sm rounded-br-xl rounded-bl-xl'
                    }
                  `}
                >
                   {msg.role === 'agent' ? (
                     <div className="markdown-body [&>p]:mb-4 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-4 [&>h3]:text-emerald-300 [&>h3]:font-bold [&>h3]:mb-2 [&>strong]:text-emerald-300 [&>pre]:bg-black/50 [&>pre]:p-3 [&>pre]:rounded-sm [&>pre]:border [&>pre]:border-emerald-900/50 [&>pre]:text-emerald-400 [&>pre]:mb-4">
                       <ReactMarkdown>{msg.content}</ReactMarkdown>
                     </div>
                   ) : (
                     msg.content
                   )}
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col max-w-[85%] mr-auto items-start"
              >
                <span className="text-[10px] uppercase tracking-widest mb-1 opacity-60 text-emerald-500">
                  NEXUS_PROCESSING
                </span>
                <div className="p-4 border border-emerald-900/50 bg-emerald-950/20 rounded-tr-xl rounded-tl-sm rounded-br-xl rounded-bl-xl flex gap-1 items-center h-12">
                  <motion.div className="w-1.5 h-4 bg-emerald-500" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} />
                  <motion.div className="w-1.5 h-4 bg-emerald-500" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} />
                  <motion.div className="w-1.5 h-4 bg-emerald-500" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-black/80 border-t border-emerald-900/50 flex flex-col">
          {/* Quick Actions */}
          <div className="flex gap-2 px-4 pt-3 overflow-x-auto pb-1 no-scrollbar">
            {quickActions.map((action) => (
              <button
                key={action}
                onClick={() => handleSend(action)}
                disabled={isTyping}
                className="whitespace-nowrap px-3 py-1.5 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-900 text-emerald-400 text-xs tracking-wider rounded-sm transition-colors disabled:opacity-50"
              >
                [{action.toUpperCase()}]
              </button>
            ))}
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-end gap-3 relative p-4"
          >
            <div className="absolute left-8 top-1/2 -translate-y-1/2 text-emerald-600 font-bold">
              {'>'}
            </div>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Query network or analyze asset..."
              className="flex-grow bg-emerald-950/20 border border-emerald-900/50 rounded-sm text-emerald-100 placeholder:text-emerald-900/70 py-3 pl-10 pr-4 focus:outline-none focus:border-emerald-500 focus:bg-emerald-950/40 transition-all resize-none overflow-hidden h-12 text-sm"
              rows={1}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="h-12 px-6 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-[0_0_10px_rgba(16,185,129,0.2)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

    </div>
  );
}
