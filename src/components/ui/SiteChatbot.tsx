'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Landmark,
  Loader2,
  ChevronRight,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const quickActions = [
  { label: 'What is GovPrompt?', icon: '🏛️' },
  { label: 'Show me all domains', icon: '🔍' },
  { label: 'How to get started?', icon: '🚀' },
  { label: 'Languages supported?', icon: '🌐' },
];

function renderSimpleMarkdown(text: string): string {
  let html = text;
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Links - convert relative links to clickable
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="chatbot-link">$1</a>');
  // Line breaks
  html = html.replace(/\n/g, '<br/>');
  return html;
}

export default function SiteChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Stop pulse after first open
  useEffect(() => {
    if (isOpen) setShowPulse(false);
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/site-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || data.error || 'Something went wrong. Please try again.',
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Network error. Please check your connection and try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* ─── FLOATING CHAT BUTTON ─── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white flex items-center justify-center shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow"
            id="site-chatbot-trigger"
          >
            {/* Pulse ring */}
            {showPulse && (
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 animate-ping opacity-30" />
            )}
            <MessageCircle size={24} className="relative z-10" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ─── CHAT WINDOW ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
            className="fixed bottom-6 right-6 z-[60] w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-6rem)] rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: 'linear-gradient(180deg, #0d0d24 0%, #0a0a1a 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow:
                '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
            id="site-chatbot-window"
          >
            {/* ─── HEADER ─── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.03] backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Landmark size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm leading-tight">
                    Gov<span className="text-cyan-400">Prompt</span> Assistant
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[11px] text-gray-400">Online • AI Powered</span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={16} />
              </motion.button>
            </div>

            {/* ─── MESSAGES AREA ─── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 chatbot-scroll">
              {/* Welcome state */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center pt-4"
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-400/20 border border-blue-500/20 flex items-center justify-center mb-4">
                    <Sparkles size={28} className="text-cyan-400" />
                  </div>
                  <h4 className="text-white font-semibold text-base mb-1">
                    Welcome to GovPrompt! 👋
                  </h4>
                  <p className="text-gray-400 text-xs mb-5 px-2 leading-relaxed">
                    I can help you navigate the platform, learn about our 9 AI domains, or answer any questions about GovPrompt.
                  </p>

                  {/* Quick actions */}
                  <div className="space-y-2">
                    {quickActions.map((action) => (
                      <motion.button
                        key={action.label}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => sendMessage(action.label)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-left hover:bg-white/[0.08] hover:border-blue-500/20 transition-all group"
                      >
                        <span className="text-lg">{action.icon}</span>
                        <span className="text-gray-300 text-sm flex-1 group-hover:text-white transition-colors">
                          {action.label}
                        </span>
                        <ChevronRight
                          size={14}
                          className="text-gray-600 group-hover:text-cyan-400 transition-colors"
                        />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Chat messages */}
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-start gap-2.5 ${
                    msg.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-violet-500 to-purple-500'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User size={14} className="text-white" />
                    ) : (
                      <Bot size={14} className="text-white" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-tr-md'
                        : 'bg-white/[0.06] border border-white/[0.08] text-gray-200 rounded-tl-md'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div
                        className="chatbot-md"
                        dangerouslySetInnerHTML={{
                          __html: renderSimpleMarkdown(msg.content),
                        }}
                      />
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-2.5"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1.5">
                    <Loader2 size={14} className="text-cyan-400 animate-spin" />
                    <span className="text-gray-400 text-xs">Thinking...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ─── INPUT AREA ─── */}
            <form
              onSubmit={handleSubmit}
              className="px-4 py-3 border-t border-white/10 bg-white/[0.02]"
            >
              <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-xl px-3 py-1 focus-within:border-blue-500/30 focus-within:bg-white/[0.07] transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about GovPrompt..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-white text-sm py-2 outline-none placeholder:text-gray-500"
                  id="site-chatbot-input"
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                >
                  <Send size={14} />
                </motion.button>
              </div>
              <p className="text-[10px] text-gray-600 text-center mt-2">
                Powered by Gov<span className="text-cyan-400/60">Prompt</span> AI • Groq LLaMA 3.3
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
