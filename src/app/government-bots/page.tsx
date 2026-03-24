"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { domains, languages } from "@/lib/domains";
import FloatingNavbar from "@/components/layout/Navbar";
import ChatWindow from "@/components/ChatWindow";

function GovernmentBotsInner() {
  const searchParams = useSearchParams();
  const domainParam = searchParams.get("domain");

  const [selectedDomain, setSelectedDomain] = useState(
    domains.find((d) => d.id === domainParam) || domains[0]
  );
  const [selectedLang, setSelectedLang] = useState(languages[0]);

  useEffect(() => {
    if (domainParam) {
      const d = domains.find((d) => d.id === domainParam);
      if (d) setSelectedDomain(d);
    }
  }, [domainParam]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-primary)",
      }}
    >
      <FloatingNavbar />

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar — Domain List */}
        <aside
          style={{
            width: "260px",
            minWidth: "260px",
            background: "var(--bg-secondary)",
            borderRight: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {/* Back to Dashboard */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1rem",
              borderBottom: "1px solid var(--border)",
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontSize: "0.85rem",
              fontWeight: 500,
              transition: "all 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.background = "var(--bg-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-secondary)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <span style={{ fontSize: "1rem" }}>←</span>
            <span>Back to Dashboard</span>
          </Link>

          {/* Language selector */}
          <div
            style={{
              padding: "0.75rem 1rem",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <label
              style={{
                fontSize: "0.7rem",
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "block",
                marginBottom: "0.35rem",
              }}
            >
              Language
            </label>
            <select
              value={selectedLang.code}
              onChange={(e) => {
                const l = languages.find((l) => l.code === e.target.value);
                if (l) setSelectedLang(l);
              }}
              style={{
                width: "100%",
                background: "var(--bg-primary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                padding: "0.4rem 0.5rem",
                fontSize: "0.85rem",
                outline: "none",
                cursor: "pointer",
              }}
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.native} ({l.name})
                </option>
              ))}
            </select>
          </div>

          {/* Domain buttons */}
          <div
            style={{
              padding: "0.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                padding: "0.5rem 0.5rem 0.25rem",
              }}
            >
              Domains
            </div>
            {domains.map((d) => {
              const isActive = selectedDomain.id === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDomain(d)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    padding: "0.6rem 0.75rem",
                    background: isActive ? `${d.color}20` : "transparent",
                    border: isActive
                      ? `1px solid ${d.color}40`
                      : "1px solid transparent",
                    borderRadius: "8px",
                    color: isActive ? "#fff" : "var(--text-secondary)",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "0.85rem",
                    fontWeight: isActive ? 600 : 400,
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: "1.15rem" }}>{d.icon}</span>
                  <span>{d.name}</span>
                  {isActive && (
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: d.color,
                        marginLeft: "auto",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Chat Panel */}
        <main style={{ flex: 1, padding: "1rem", overflow: "hidden" }}>
          <ChatWindow
            key={selectedDomain.id + selectedLang.code}
            domainId={selectedDomain.id}
            domainName={selectedDomain.name}
            domainIcon={selectedDomain.icon}
            domainColor={selectedDomain.color}
            language={selectedLang.name}
            suggestedPrompts={selectedDomain.suggestedPrompts}
          />
        </main>
      </div>
    </div>
  );
}

export default function GovernmentBotsPage() {
  return (
    <Suspense fallback={<div style={{ background: "var(--bg-primary)", height: "100vh" }} />}>
      <GovernmentBotsInner />
    </Suspense>
  );
}
