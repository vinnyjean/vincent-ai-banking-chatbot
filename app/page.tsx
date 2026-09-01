"use client";

import { FormEvent, useMemo, useState } from "react";

type Lang = "en" | "sw";
type Message = { role: "user" | "assistant"; text: string };

const modules = [
  ["cx", "💬", "Customer Experience", "CX, journeys, satisfaction and retention"],
  ["complaints", "📋", "Complaints & SLA", "Intake, priority, SLA and root cause"],
  ["fraud", "🛡️", "Fraud & Risk", "Fraud signals, risk and escalation"],
  ["operations", "🏦", "Banking Operations", "Branches, transactions and controls"],
  ["automation", "⚙️", "AI Automation", "CRM, workflows and case routing"],
  ["analytics", "📊", "Insights & Analytics", "KPIs, dashboards and management insight"],
] as const;

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [active, setActive] = useState("cx");
  const [input, setInput] = useState("");
  const [sidebar, setSidebar] = useState(true);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Karibu! I’m Vincent AI V4 — your intelligent banking, finance and customer experience assistant. Ask me anything."
    }
  ]);

  const module = useMemo(
    () => modules.find(m => m[0] === active) ?? modules[0],
    [active]
  );

  async function send(text = input) {
    const q = text.trim();
    if (!q || loading) return;

    const previousMessages = messages.slice(-12);

    setMessages(m => [...m, { role: "user", text: q }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, history: previousMessages })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Vincent AI could not process the request.");
      }

      setMessages(m => [
        ...m,
        { role: "assistant", text: data.answer || "I could not generate an answer." }
      ]);
    } catch (error) {
      console.error(error);
      setMessages(m => [
        ...m,
        {
          role: "assistant",
          text:
            lang === "sw"
              ? "Samahani, Vincent AI haikuweza kuwasiliana na AI engine. Tafadhali jaribu tena."
              : "Sorry, Vincent AI could not connect to the AI engine. Please try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    send();
  }

  function speak(text: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "sw" ? "sw-TZ" : "en-US";
    window.speechSynthesis.speak(u);
  }

  function voiceInput() {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SR) {
      setInput(
        lang === "sw"
          ? "Voice input haijawezeshwa kwenye browser hii."
          : "Voice input is not supported by this browser."
      );
      return;
    }

    const r = new SR();
    r.lang = lang === "sw" ? "sw-TZ" : "en-US";
    r.interimResults = false;
    r.onstart = () => setListening(true);
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    r.onresult = (e: any) =>
      setInput(e.results?.[0]?.[0]?.transcript ?? "");
    r.start();
  }

  const prompts = [
    module[2] + ": what should management improve?",
    "How can AI reduce repeated complaints?",
    "How can I detect banking fraud?",
    "Design a customer complaint workflow",
    "What KPIs should a bank CX dashboard show?",
    "How can I automate SLA escalation?"
  ];

  return (
    <main className="page">
      <div className="app-shell">
        <aside className={`sidebar ${sidebar ? "open" : "closed"}`}>
          <div className="brand">
            <div className="brand-mark">V</div>
            <div>
              <strong>VINCENT AI</strong>
              <span>V4 • Banking Intelligence</span>
            </div>
          </div>

          <button
            className="new-chat"
            onClick={() =>
              setMessages([
                {
                  role: "assistant",
                  text:
                    lang === "sw"
                      ? "Karibu! Uliza swali lolote la benki."
                      : "Welcome! Ask me any banking question."
                }
              ])
            }
          >
            ＋ New conversation
          </button>

          <div className="nav-label">VINCENT AI SOLUTIONS</div>

          <nav>
            {modules.map(m => (
              <button
                key={m[0]}
                className={active === m[0] ? "nav-item active" : "nav-item"}
             onClick={() => {
  if (m[0] === "analytics") {
    window.location.href = "/analytics";
    return;
  }

  setActive(m[0]);
  setInput("");
}}
              >
                <span>{m[1]}</span>
                <div>
                  <b>{m[2]}</b>
                  <small>{m[3]}</small>
                </div>
              </button>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <div className="secure">
              🔒
              <span>
                <b>Security-first banking AI</b>
                <small>Never enter PIN, OTP or passwords.</small>
              </span>
            </div>
          </div>
        </aside>

        <section className="workspace">
          <header className="topbar">
            <button className="menu" onClick={() => setSidebar(!sidebar)}>
              ☰
            </button>

            <div>
              <div className="eyebrow">VINCENT AI V4</div>
              <h1>
                {lang === "sw"
                  ? "Msaidizi wa Benki, Fedha na Customer Experience"
                  : "Banking, Finance & Customer Experience Assistant"}
              </h1>
              <p>
                {lang === "sw"
                  ? "Kiswahili au English • AI guidance • Human escalation for sensitive decisions"
                  : "English or Kiswahili • AI guidance • Human escalation for sensitive decisions"}
              </p>
            </div>

            <div className="top-actions">
              <button
                className="language"
                onClick={() => setLang(lang === "en" ? "sw" : "en")}
              >
                {lang === "en" ? "🇹🇿 SW" : "🇬🇧 EN"}
              </button>
              <div className="online">
                <i /> Online
              </div>
            </div>
          </header>

          <div className="module-banner">
            <div>
              <span className="module-icon">{module[1]}</span>
              <div>
                <b>{module[2]}</b>
                <small>{module[3]}</small>
              </div>
            </div>
            <span className="badge">V4 • MULTI-AGENT READY</span>
          </div>

          <div className="chat-card">
            <div className="messages">
              {messages.map((m, i) => (
                <div key={i} className={`message ${m.role}`}>
                  <div className="avatar">
                    {m.role === "assistant" ? "V" : "You"}
                  </div>
                  <div className="message-body">
                    <small>
                      {m.role === "assistant" ? "Vincent AI V4" : "You"}
                    </small>
                    <div className="bubble">{m.text}</div>
                    {m.role === "assistant" && (
                      <button className="speak" onClick={() => speak(m.text)}>
                        🔊 Listen
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="message assistant">
                  <div className="avatar">V</div>
                  <div className="message-body">
                    <small>Vincent AI V4</small>
                    <div className="bubble">
                      {lang === "sw"
                        ? "Vincent AI inafikiri..."
                        : "Vincent AI is thinking..."}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="quick-title">
              {lang === "sw" ? "Mifano ya kuanzia" : "Start with a question"}
            </div>

            <div className="quick">
              {prompts.map(q => (
                <button key={q} onClick={() => send(q)} disabled={loading}>
                  {q}
                </button>
              ))}
            </div>

            <form onSubmit={submit}>
              <button
                type="button"
                aria-label="Voice input"
                className={`voice ${listening ? "listening" : ""}`}
                onClick={voiceInput}
              >
                🎙️
              </button>

              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={
                  lang === "sw"
                    ? "Uliza swali lolote kuhusu benki..."
                    : "Ask Vincent anything about banking..."
                }
                disabled={loading}
              />

              <button
                type="submit"
                className="send"
                disabled={loading || !input.trim()}
              >
                {loading ? "Thinking..." : "Send ➤"}
              </button>
            </form>

            <div className="hint">
              Security principle: never enter live passwords, PINs, OTPs,
              API keys or confidential credentials into Vincent AI.
            </div>
          </div>

          <section className="feature-grid">
            <div>
              <span>🧠</span>
              <b>Banking intelligence</b>
              <small>Operations, products, finance and controls.</small>
            </div>
            <div>
              <span>👥</span>
              <b>Customer 360</b>
              <small>
                CX, complaints, sentiment, retention and next-best action.
              </small>
            </div>
            <div>
              <span>🛡️</span>
              <b>Fraud & risk</b>
              <small>Risk signals, investigation support and escalation.</small>
            </div>
            <div>
              <span>⚙️</span>
              <b>Automation ready</b>
              <small>CRM, SLA, routing and workflow orchestration.</small>
            </div>
          </section>

          <footer>
            VINCENT AI V4 • Banking • Finance • Customer Experience • Fraud •
            Risk • Automation • Tanzania
          </footer>
        </section>
      </div>
    </main>
  );
}
// Force fresh Vercel deployment
