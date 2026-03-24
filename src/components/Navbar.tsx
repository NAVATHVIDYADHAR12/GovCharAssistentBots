"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border)",
        padding: "0.75rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          textDecoration: "none",
          color: "var(--text-primary)",
        }}
      >
        <span style={{ fontSize: "1.5rem" }}>🏛️</span>
        <span style={{ fontWeight: 700, fontSize: "1.15rem" }}>GovPrompt</span>
      </Link>
      <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
        <Link
          href="/gov-prompt"
          style={{
            color: "var(--text-secondary)",
            textDecoration: "none",
            fontSize: "0.9rem",
            transition: "color 0.2s",
          }}
        >
          Quick Chat
        </Link>
        <Link
          href="/government-bots"
          style={{
            color: "var(--accent)",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
        >
          All Bots
        </Link>
      </div>
    </nav>
  );
}
