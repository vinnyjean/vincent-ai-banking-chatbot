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

const answers = [
  { keys: ["complaint", "complaints", "malalamiko"], en: "A modern complaint workflow should capture the issue once, classify product and severity, detect urgency and sentiment, assign an owner, start an SLA, function send updates, analyze root cause and confirm closure. Repeated complaints should receive higher priority and management visibility.", sw: "Mchakato wa kisasa wa malalamiko unapaswa kupokea issue mara moja, kuainisha product na severity, kutambua urgency na sentiment, kumpa owner, kuanzisha SLA, kutuma updates, kuchambua root cause na kuthibitisha closure. Malalamiko yanayojirudia yaongeze priority na visibility kwa management." },
  { keys: ["fraud", "scam", "utapeli", "udanganyifu"], en: "AI fraud detection can combine transaction amount, velocity, device, location, channel, beneficiary changes, customer history and unusual timing. High-risk alerts should go to trained investigators under approved procedures.", sw: "AI ya fraud inaweza kuchanganya kiasi cha muamala, velocity, device, location, channel, mabadiliko ya beneficiary, historia ya mteja na muda usio wa kawaida. Alerts zenye risk kubwa zipelekwe kwa investigators waliofunzwa kwa taratibu rasmi." },
  { keys: ["duplicate", "debit twice", "kukatwa mara mbili"], en: "For a duplicate debit, verify both transaction references and ledger entries, determine whether one is a hold or completed debit, initiate the approved reversal or dispute process, assign an SLA and keep the customer informed until closure.", sw: "Kwa debit iliyokatwa mara mbili, thibitisha references na ledger entries zote, tambua kama moja ni hold au debit iliyokamilika, anzisha reversal au dispute iliyoidhinishwa, weka SLA na mfuatilie mteja hadi kesi ifungwe." },
  { keys: ["balance", "salio"], en: "Use the bank's approved digital channel or branch process for balance enquiries. Vincent AI must never request or expose a customer's PIN, password, OTP or full credentials.", sw: "Tumia njia rasmi ya benki kwa kuulizia salio. Vincent AI haipaswi kuomba au kuonyesha PIN, password, OTP au credentials kamili za mteja." },
  { keys: ["password", "pin", "otp", "phishing", "cyber"], en: "Never share passwords, PINs or OTPs in chat. For suspected compromise, use the bank's official reporting and blocking channels. Internally, combine access controls, monitoring, incident response and audit trails.", sw: "Usishirikishe password, PIN au OTP kwenye chat. Kwa suspected compromise, tumia njia rasmi ya kuripoti na kuzuia huduma. Ndani ya benki tumia access controls, monitoring, incident response na audit trails." },
  { keys: ["sla", "escalation", "breach"], en: "A strong SLA model defines priority, first-response target, resolution target, ownership and escalation levels. Alert before breach, not only after breach, and track ageing by team, product and branch.", sw: "SLA nzuri inaeleza priority, first-response target, resolution target, ownership na escalation levels. Tuma alert kabla SLA haijavunjika na fuatilia ageing kwa team, product na branch." },
  { keys: ["customer experience", "cx", "customer service", "huduma kwa wateja"], en: "AI can improve customer experience through intent classification, sentiment analysis, faster answers, next-best action, intelligent routing, complaint prevention, SLA monitoring and a 360-degree customer view. Complex cases should escalate to people.", sw: "AI inaweza kuboresha customer experience kupitia intent classification, sentiment analysis, majibu ya haraka, next-best action, intelligent routing, kuzuia malalamiko, SLA monitoring na customer 360. Kesi ngumu zi-escalate kwa binadamu." },
  { keys: ["kpi", "dashboard", "power bi", "analytics", "ripoti"], en: "A banking CX dashboard should show complaint volume, open versus closed cases, SLA compliance, repeat complaints, root causes, CSAT, response time, resolution time, product/channel performance and branch trends.", sw: "Dashboard ya banking CX ionyeshe complaint volume, open dhidi ya closed, SLA compliance, repeat complaints, root causes, CSAT, response time, resolution time, product/channel performance na branch trends." },
  { keys: ["loan", "mkopo", "credit"], en: "AI can support loan segmentation, affordability analysis and early-warning indicators, but credit decisions must follow the bank's approved credit policy, controls and human accountability.", sw: "AI inaweza kusaidia loan segmentation, affordability analysis na early-warning indicators, lakini maamuzi ya mkopo yafuate credit policy, controls na accountability ya binadamu." },
  { keys: ["automation", "automate", "workflow"], en: "A practical banking AI workflow can receive a case, identify intent, classify product and severity, check required information, route to the correct team, start the SLA,function send updates, escalate overdue cases and produce management analytics.", sw: "AI workflow ya benki inaweza kupokea case, kutambua intent, kuainisha product na severity, kukagua taarifa, kupeleka team sahihi, kuanzisha SLA, kutuma updates, ku-escalate kesi zilizochelewa na kutoa management analytics." },
];

function detectLang(q: string, selected: Lang): Lang {
  if (selected === "sw") return "sw";
  const sw = ["habari", "naomba", "tafadhali", "mteja", "benki", "akaunti", "salio", "malalamiko", "mkopo", "kadi", "tawi", "huduma", "nifanye", "nawezaje"];
  return sw.some(w => q.toLowerCase().includes(w)) ? "sw" : "en";
}

function getAnswer(q: string, selected: Lang) {
  const x = q.toLowerCase();
  const lang = detectLang(x, selected);
  const hit = answers.find(a => a.keys.some(k => x.includes(k)));
  if (hit) return lang === "sw" ? hit.sw : hit.en;
  return lang === "sw"
    ? "Mimi ni Vincent AI V4. Niulize kuhusu banking, customer experience, complaints, SLA, fraud, risk, operations, loans, KYC, AML, analytics, automation au customer 360. Nitakupa hatua, controls, KPI na workflow."
    : "I’m Vincent AI V4. Ask me about banking, customer experience, complaints, SLA, fraud, risk, operations, loans, KYC, AML, analytics, automation or Customer 360. I’ll provide practical steps, controls, KPIs and workflows.";
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [active, setActive] = useState("cx");
  const [input, setInput] = useState("");
  const [sidebar, setSidebar] = useState(true);
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Karibu! I’m Vincent AI V4 — your intelligent banking, finance and customer experience assistant. Ask me anything." }
  ]);

  const module = useMemo(() => modules.find(m => m[0] === active) ?? modules[0], [active]);

  function send(text = input) {
    const q = text.trim();
    if (!q) return;
    setMessages(m => [...m, { role: "user", text: q }, { role: "assistant", text: getAnswer(q, lang) }]);
    setInput("");
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
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setInput(lang === "sw" ? "Voice input haijawezeshwa kwenye browser hii." : "Voice input is not supported by this browser.");
      return;
    }
    const r = new SR();
    r.lang = lang === "sw" ? "sw-TZ" : "en-US";
    r.interimResults = false;
    r.onstart = () => setListening(true);
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    r.onresult = (e: any) => setInput(e.results?.[0]?.[0]?.transcript ?? "");
    r.start();
  }

  const prompts = [
    module[2] + ": what should management improve?",
    "How can AI reduce repeated complaints?",
    "How can I detect banking fraud?",
    "Design a customer complaint workflow",
    "What KPIs should a bank CX dashboard show?",
    "How can I automate SLA escalation?",
  ];

  return (
    <main className="page">
      <div className="app-shell">
        <aside className={`sidebar ${sidebar ? "open" : "closed"}`}>
          <div className="brand">
            <div className="brand-mark">V</div>
            <div><strong>VINCENT AI</strong><span>V4 • Banking Intelligence</span></div>
          </div>
          <button className="new-chat" onClick={() => setMessages([{ role: "assistant", text: lang === "sw" ? "Karibu! Uliza swali lolote la benki." : "Welcome! Ask me any banking question." }])}>＋ New conversation</button>
          <div className="nav-label">VINCENT AI SOLUTIONS</div>
          <nav>
            {modules.map(m => (
              <button key={m[0]} className={active === m[0] ? "nav-item active" : "nav-item"} onClick={() => { setActive(m[0]); setInput(""); }}>
                <span>{m[1]}</span><div><b>{m[2]}</b><small>{m[3]}</small></div>
              </button>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="secure">🔒 <span><b>Security-first banking AI</b><small>Never enter PIN, OTP or passwords.</small></span></div>
          </div>
        </aside>

        <section className="workspace">
          <header className="topbar">
            <button className="menu" onClick={() => setSidebar(!sidebar)}>☰</button>
            <div>
              <div className="eyebrow">VINCENT AI V4</div>
              <h1>{lang === "sw" ? "Msaidizi wa Benki, Fedha na Customer Experience" : "Banking, Finance & Customer Experience Assistant"}</h1>
              <p>{lang === "sw" ? "Kiswahili au English • AI guidance • Human escalation for sensitive decisions" : "English or Kiswahili • AI guidance • Human escalation for sensitive decisions"}</p>
            </div>
            <div className="top-actions">
              <button className="language" onClick={() => setLang(lang === "en" ? "sw" : "en")}>{lang === "en" ? "🇹🇿 SW" : "🇬🇧 EN"}</button>
              <div className="online"><i /> Online</div>
            </div>
          </header>

          <div className="module-banner">
            <div><span className="module-icon">{module[1]}</span><div><b>{module[2]}</b><small>{module[3]}</small></div></div>
            <span className="badge">V4 • MULTI-AGENT READY</span>
          </div>

          <div className="chat-card">
            <div className="messages">
              {messages.map((m, i) => (
                <div key={i} className={`message ${m.role}`}>
                  <div className="avatar">{m.role === "assistant" ? "V" : "You"}</div>
                  <div className="message-body">
                    <small>{m.role === "assistant" ? "Vincent AI V4" : "You"}</small>
                    <div className="bubble">{m.text}</div>
                    {m.role === "assistant" && <button className="speak" onClick={() => speak(m.text)}>🔊 Listen</button>}
                  </div>
                </div>
              ))}
            </div>
            <div className="quick-title">{lang === "sw" ? "Mifano ya kuanzia" : "Start with a question"}</div>
            <div className="quick">{prompts.map(q => <button key={q} onClick={() => send(q)}>{q}</button>)}</div>
            <form onSubmit={submit}>
              <button type="button" aria-label="Voice input" className={`voice ${listening ? "listening" : ""}`} onClick={voiceInput}>🎙️</button>
              <input value={input} onChange={e => setInput(e.target.value)} placeholder={lang === "sw" ? "Uliza swali lolote kuhusu benki..." : "Ask Vincent anything about banking..."} />
              <button className="send">Send ➤</button>
            </form>
            <div className="hint">Security principle: never enter live passwords, PINs, OTPs, API keys or confidential credentials into Vincent AI.</div>
          </div>

          <section className="feature-grid">
            <div><span>🧠</span><b>Banking intelligence</b><small>Operations, products, finance and controls.</small></div>
            <div><span>👥</span><b>Customer 360</b><small>CX, complaints, sentiment, retention and next-best action.</small></div>
            <div><span>🛡️</span><b>Fraud & risk</b><small>Risk signals, investigation support and escalation.</small></div>
            <div><span>⚙️</span><b>Automation ready</b><small>CRM, SLA, routing and workflow orchestration.</small></div>
          </section>

          <footer>VINCENT AI V4 • Banking • Finance • Customer Experience • Fraud • Risk • Automation • Tanzania</footer>
        </section>
      </div>
    </main>
  );
}
