"use client";

import { useState } from "react";
import Link from "next/link";
import { domains, languages } from "@/lib/domains";
import ChatWindow from "@/components/ChatWindow";

export default function GovPromptPage() {
  const [selectedDomain, setSelectedDomain] = useState(domains[0]);
  const [selectedLang, setSelectedLang] = useState(languages[0]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-primary)",
      }}
    >
      {/* Top Bar — minimal, no navbar */}
      <div
        style={{
          padding: "0.65rem 1.25rem",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--bg-secondary)",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontSize: "0.85rem",
              fontWeight: 500,
              padding: "0.35rem 0.7rem",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              transition: "all 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.borderColor = "var(--text-secondary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-secondary)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            <span>←</span>
            <span>Dashboard</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.25rem" }}>🏛️</span>
            <span style={{ fontWeight: 700, fontSize: "1rem" }}>GovPrompt</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          {/* Domain selector */}
          <select
            value={selectedDomain.id}
            onChange={(e) => {
              const d = domains.find((d) => d.id === e.target.value);
              if (d) setSelectedDomain(d);
            }}
            style={{
              background: "var(--bg-primary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              padding: "0.4rem 0.6rem",
              fontSize: "0.85rem",
              outline: "none",
              cursor: "pointer",
            }}
          >
            {domains.map((d) => (
              <option key={d.id} value={d.id}>
                {d.icon} {d.name}
              </option>
            ))}
          </select>

          {/* Language selector */}
          <select
            value={selectedLang.code}
            onChange={(e) => {
              const l = languages.find((l) => l.code === e.target.value);
              if (l) setSelectedLang(l);
            }}
            style={{
              background: "var(--bg-primary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              padding: "0.4rem 0.6rem",
              fontSize: "0.85rem",
              outline: "none",
              cursor: "pointer",
            }}
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.native}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, padding: "1rem", overflow: "hidden" }}>
        <ChatWindow
          key={selectedDomain.id + selectedLang.code}
          domainId={selectedDomain.id}
          domainName={selectedDomain.name}
          domainIcon={selectedDomain.icon}
          domainColor={selectedDomain.color}
          language={selectedLang.name}
          suggestedPrompts={selectedDomain.suggestedPrompts}
        />
      </div>
    </div>
  );
}
