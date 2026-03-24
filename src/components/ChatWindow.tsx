"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Download,
  Volume2,
  VolumeX,
  Languages,
  Minimize2,
  List,
  Sparkles,
  Send,
  StopCircle,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatWindowProps {
  domainId: string;
  domainName: string;
  domainIcon: string;
  domainColor: string;
  language: string;
  suggestedPrompts: string[];
}

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "te", name: "Telugu" },
  { code: "ta", name: "Tamil" },
  { code: "de", name: "German" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
];

const TTS_LANG_MAP: Record<string, string> = {
  en: "en-IN",
  hi: "hi-IN",
  te: "te-IN",
  ta: "ta-IN",
  de: "de-DE",
  ru: "ru-RU",
  zh: "zh-CN",
  ja: "ja-JP",
};

export default function ChatWindow({
  domainId,
  domainName,
  domainIcon,
  domainColor,
  language,
  suggestedPrompts,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const [actionLoadingIdx, setActionLoadingIdx] = useState<number | null>(null);
  const [actionType, setActionType] = useState<string | null>(null);
  const [showTranslateMenu, setShowTranslateMenu] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    setMessages([]);
    setInput("");
  }, [domainId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      synthRef.current?.cancel();
    };
  }, []);

  // Close translate menu on click outside
  useEffect(() => {
    const handler = () => setShowTranslateMenu(null);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, domainId, domainName, language }),
      });
      const data = await res.json();
      if (data.error) {
        setMessages([...newMessages, { role: "assistant", content: `**Error:** ${data.error}` }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "**Error:** Could not connect to the server. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // ─── REFINE ACTIONS ────────────────────────────────────────
  const handleRefineAction = useCallback(
    async (msgIndex: number, action: "concise" | "summarize" | "points") => {
      const targetMsg = messages[msgIndex];
      if (!targetMsg || targetMsg.role !== "assistant") return;

      setActionLoadingIdx(msgIndex);
      setActionType(action);

      const prompts = {
        concise: `Make the following response more concise and shorter while keeping key information. Respond in ${language}:\n\n${targetMsg.content}`,
        summarize: `Summarize the following response in 3-4 bullet points. Respond in ${language}:\n\n${targetMsg.content}`,
        points: `Refine and restructure the following response into clear numbered points with headings. Respond in ${language}:\n\n${targetMsg.content}`,
      };

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: prompts[action] }],
            domainId,
            domainName,
            language,
          }),
        });
        const data = await res.json();
        if (data.reply) {
          setMessages((prev) => {
            const updated = [...prev];
            updated[msgIndex] = { role: "assistant", content: data.reply };
            return updated;
          });
        }
      } catch {
        // silently fail
      } finally {
        setActionLoadingIdx(null);
        setActionType(null);
      }
    },
    [messages, domainId, domainName, language]
  );

  // ─── TRANSLATE ──────────────────────────────────────────────
  const handleTranslate = useCallback(
    async (msgIndex: number, targetLang: string) => {
      const targetMsg = messages[msgIndex];
      if (!targetMsg || targetMsg.role !== "assistant") return;

      setActionLoadingIdx(msgIndex);
      setActionType("translate");
      setShowTranslateMenu(null);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: `Translate the following text to ${targetLang}. Keep markdown formatting intact. Only output the translated text, no extra commentary:\n\n${targetMsg.content}`,
              },
            ],
            domainId,
            domainName,
            language: targetLang,
          }),
        });
        const data = await res.json();
        if (data.reply) {
          setMessages((prev) => {
            const updated = [...prev];
            updated[msgIndex] = { role: "assistant", content: data.reply };
            return updated;
          });
        }
      } catch {
        // silently fail
      } finally {
        setActionLoadingIdx(null);
        setActionType(null);
      }
    },
    [messages, domainId, domainName]
  );

  // ─── DOWNLOAD ───────────────────────────────────────────────
  const handleDownload = useCallback(
    (msgIndex: number) => {
      // Find the user question before this assistant message
      let question = "";
      for (let i = msgIndex - 1; i >= 0; i--) {
        if (messages[i].role === "user") {
          question = messages[i].content;
          break;
        }
      }
      const response = messages[msgIndex].content;
      const text = `Domain: ${domainName}\nLanguage: ${language}\nDate: ${new Date().toLocaleString()}\n\n${"═".repeat(50)}\nQuestion:\n${question}\n${"═".repeat(50)}\nResponse:\n${response}\n${"═".repeat(50)}\n\nGenerated by GovPrompt — Powered by Groq LLaMA 3.3 70B`;

      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `GovPrompt_${domainName.replace(/\s+/g, "_")}_${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [messages, domainName, language]
  );

  // ─── READ ALOUD ─────────────────────────────────────────────
  const handleReadAloud = useCallback(
    (msgIndex: number) => {
      if (!synthRef.current) return;

      // If currently speaking this message, stop
      if (speakingIdx === msgIndex) {
        synthRef.current.cancel();
        setSpeakingIdx(null);
        return;
      }

      synthRef.current.cancel();

      // Build text: user question + AI response for assistant messages
      let textToRead = "";
      const msg = messages[msgIndex];

      if (msg.role === "assistant") {
        // Find the user question before this
        let question = "";
        for (let i = msgIndex - 1; i >= 0; i--) {
          if (messages[i].role === "user") {
            question = messages[i].content;
            break;
          }
        }
        if (question) {
          textToRead = `Question: ${question}. ... Answer: ${stripMarkdown(msg.content)}`;
        } else {
          textToRead = stripMarkdown(msg.content);
        }
      } else {
        textToRead = msg.content;
      }

      const utterance = new SpeechSynthesisUtterance(textToRead);

      // Detect language code from current language prop
      const langEntry = SUPPORTED_LANGUAGES.find(
        (l) => l.name.toLowerCase() === language.toLowerCase()
      );
      const langCode = langEntry?.code || "en";
      utterance.lang = TTS_LANG_MAP[langCode] || "en-IN";
      utterance.rate = 0.95;
      utterance.pitch = 1;

      utterance.onend = () => setSpeakingIdx(null);
      utterance.onerror = () => setSpeakingIdx(null);

      setSpeakingIdx(msgIndex);
      synthRef.current.speak(utterance);
    },
    [messages, speakingIdx, language]
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--bg-chat)",
        borderRadius: "12px",
        border: "1px solid var(--border)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1rem 1.25rem",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          background: "var(--bg-secondary)",
        }}
      >
        <span style={{ fontSize: "1.5rem" }}>{domainIcon}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: "1rem" }}>{domainName}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            Powered by Groq LLaMA 3.3 · {language}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem 1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        {messages.length === 0 && !loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              gap: "1.25rem",
              padding: "2rem 0",
            }}
          >
            <div style={{ fontSize: "3rem" }}>{domainIcon}</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)" }}>
              {domainName} Assistant
            </div>
            <div
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.85rem",
                textAlign: "center",
                maxWidth: "400px",
              }}
            >
              Ask me anything about {domainName.toLowerCase()}. Choose a suggestion below or type your own question.
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.5rem",
                width: "100%",
                maxWidth: "500px",
                marginTop: "0.5rem",
              }}
            >
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  style={{
                    background: "var(--accent-light)",
                    border: `1px solid ${domainColor}33`,
                    borderRadius: "8px",
                    padding: "0.65rem 0.75rem",
                    color: "var(--text-primary)",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    textAlign: "left",
                    lineHeight: 1.4,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${domainColor}30`;
                    e.currentTarget.style.borderColor = `${domainColor}66`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--accent-light)";
                    e.currentTarget.style.borderColor = `${domainColor}33`;
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i}>
            {/* Message Bubble */}
            <div
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "0.75rem 1rem",
                  borderRadius:
                    msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                  background: msg.role === "user" ? domainColor : "var(--bg-card)",
                  color: msg.role === "user" ? "#fff" : "var(--text-primary)",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  position: "relative",
                }}
              >
                {/* Loading overlay for refine actions */}
                {actionLoadingIdx === i && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.6)",
                      borderRadius: "inherit",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      zIndex: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        border: "2px solid #fff",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                    <span style={{ color: "#fff", fontSize: "0.8rem" }}>
                      {actionType === "concise"
                        ? "Making concise..."
                        : actionType === "summarize"
                        ? "Summarizing..."
                        : actionType === "points"
                        ? "Refining points..."
                        : "Translating..."}
                    </span>
                  </div>
                )}

                {msg.role === "assistant" ? (
                  <div
                    className="chat-markdown"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                  />
                ) : (
                  msg.content
                )}
              </div>
            </div>

            {/* ─── ACTION TOOLBAR (Assistant messages only) ─── */}
            {msg.role === "assistant" && !msg.content.startsWith("**Error:**") && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.35rem",
                  marginTop: "0.4rem",
                  paddingLeft: "0.25rem",
                }}
              >
                {/* Concise */}
                <ActionButton
                  icon={<Minimize2 size={13} />}
                  label="Concise"
                  color={domainColor}
                  onClick={() => handleRefineAction(i, "concise")}
                  disabled={actionLoadingIdx !== null}
                />
                {/* Summarize */}
                <ActionButton
                  icon={<Sparkles size={13} />}
                  label="Summarize"
                  color={domainColor}
                  onClick={() => handleRefineAction(i, "summarize")}
                  disabled={actionLoadingIdx !== null}
                />
                {/* Refine in Points */}
                <ActionButton
                  icon={<List size={13} />}
                  label="Points"
                  color={domainColor}
                  onClick={() => handleRefineAction(i, "points")}
                  disabled={actionLoadingIdx !== null}
                />
                {/* Download */}
                <ActionButton
                  icon={<Download size={13} />}
                  label="Download"
                  color={domainColor}
                  onClick={() => handleDownload(i)}
                  disabled={false}
                />
                {/* Read Aloud */}
                <ActionButton
                  icon={
                    speakingIdx === i ? <VolumeX size={13} /> : <Volume2 size={13} />
                  }
                  label={speakingIdx === i ? "Stop" : "Read Aloud"}
                  color={domainColor}
                  onClick={() => handleReadAloud(i)}
                  disabled={false}
                  active={speakingIdx === i}
                />
                {/* Translate */}
                <div style={{ position: "relative" }}>
                  <ActionButton
                    icon={<Languages size={13} />}
                    label="Translate"
                    color={domainColor}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTranslateMenu(showTranslateMenu === i ? null : i);
                    }}
                    disabled={actionLoadingIdx !== null}
                  />
                  {/* Translate dropdown */}
                  {showTranslateMenu === i && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        position: "absolute",
                        bottom: "calc(100% + 4px)",
                        left: 0,
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border)",
                        borderRadius: "10px",
                        padding: "0.35rem",
                        zIndex: 50,
                        minWidth: "140px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                      }}
                    >
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleTranslate(i, lang.name)}
                          style={{
                            display: "block",
                            width: "100%",
                            textAlign: "left",
                            padding: "0.45rem 0.65rem",
                            fontSize: "0.78rem",
                            color: "var(--text-primary)",
                            background: "transparent",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = `${domainColor}25`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                background: "var(--bg-card)",
                padding: "0.75rem 1.25rem",
                borderRadius: "12px 12px 12px 2px",
                display: "flex",
                gap: "0.35rem",
              }}
            >
              {[0, 1, 2].map((n) => (
                <span
                  key={n}
                  className="typing-dot"
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: domainColor,
                    display: "inline-block",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "0.75rem 1rem",
          borderTop: "1px solid var(--border)",
          background: "var(--bg-secondary)",
          display: "flex",
          gap: "0.5rem",
          alignItems: "flex-end",
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask about ${domainName.toLowerCase()}...`}
          rows={1}
          style={{
            flex: 1,
            background: "var(--bg-primary)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "0.65rem 0.85rem",
            color: "var(--text-primary)",
            fontSize: "0.9rem",
            resize: "none",
            outline: "none",
            fontFamily: "inherit",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = domainColor;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          style={{
            background: domainColor,
            border: "none",
            borderRadius: "8px",
            padding: "0.65rem 1rem",
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            opacity: loading || !input.trim() ? 0.5 : 1,
            transition: "opacity 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
          }}
        >
          <Send size={14} />
          Send
        </button>
      </div>

      {/* Keyframe for spinner */}
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

// ─── ACTION BUTTON COMPONENT ────────────────────────────────
function ActionButton({
  icon,
  label,
  color,
  onClick,
  disabled,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: (e: React.MouseEvent) => void;
  disabled: boolean;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.3rem",
        padding: "0.3rem 0.6rem",
        fontSize: "0.72rem",
        fontWeight: 500,
        color: active ? "#fff" : "var(--text-secondary)",
        background: active ? `${color}40` : "var(--bg-card)",
        border: `1px solid ${active ? `${color}60` : "var(--border)"}`,
        borderRadius: "6px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = `${color}25`;
          e.currentTarget.style.borderColor = `${color}50`;
          e.currentTarget.style.color = "#fff";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = active ? `${color}40` : "var(--bg-card)";
          e.currentTarget.style.borderColor = active ? `${color}60` : "var(--border)";
          e.currentTarget.style.color = active ? "#fff" : "var(--text-secondary)";
        }
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────
function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,3}\s/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^[-*]\s/gm, "")
    .replace(/^\d+\.\s/gm, "");
}

function renderMarkdown(text: string): string {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>'
    )
    .replace(/^&gt; (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^---$/gm, "<hr/>")
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    .replace(/^\d+\.\s(.+)$/gm, "<li>$1</li>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>");

  html = html.replace(/((?:<li>.*?<\/li><br\/>?)+)/g, (match) => {
    const cleaned = match.replace(/<br\/>/g, "");
    return `<ul>${cleaned}</ul>`;
  });

  return `<p>${html}</p>`;
}
