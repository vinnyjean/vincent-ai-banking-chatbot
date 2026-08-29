import "./globals.css";

export const metadata = {
  title: "Vincent AI V4 | Banking, Finance & Customer Experience",
  description: "Vincent AI V4 — intelligent banking, finance, customer experience, complaints, fraud, risk and automation assistant.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}

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
  { keys: ["complaint", "complaints", "malalamiko"], en: "A modern complaint workflow should capture the issue once, classify product and severity, detect urgency and sentiment, assign an owner, start an SLA, send updates, analyze root cause and confirm closure. Repeated complaints should receive higher priority and management visibility.", sw: "Mchakato wa kisasa wa malalamiko unapaswa kupokea issue mara moja, kuainisha product na severity, kutambua urgency na sentiment, kumpa owner, kuanzisha SLA, kutuma updates, kuchambua root cause na kuthibitisha closure. Malalamiko yanayojirudia yaongeze priority na visibility kwa management." },
  { keys: ["fraud", "scam", "utapeli", "udanganyifu"], en: "AI fraud detection can combine transaction amount, velocity, device, location, channel, beneficiary changes, customer history and unusual timing. High-risk alerts should go to trained investigators under approved procedures.", sw: "AI ya fraud inaweza kuchanganya kiasi cha muamala, velocity, device, location, channel, mabadiliko ya beneficiary, historia ya mteja na muda usio wa kawaida. Alerts zenye risk kubwa zipelekwe kwa investigators waliofunzwa kwa taratibu rasmi." },
  { keys: ["duplicate", "debit twice", "kukatwa mara mbili"], en: "For a duplicate debit, verify both transaction references and ledger entries, determine whether one is a hold or completed debit, initiate the approved reversal or dispute process, assign an SLA and keep the customer informed until closure.", sw: "Kwa debit iliyokatwa mara mbili, thibitisha references na ledger entries zote, tambua kama moja ni hold au debit iliyokamilika, anzisha reversal au dispute iliyoidhinishwa, weka SLA na mfuatilie mteja hadi kesi ifungwe." },
  { keys: ["balance", "salio"], en: "Use the bank's approved digital channel or branch process for balance enquiries. Vincent AI must never request or expose a customer's PIN, password, OTP or full credentials.", sw: "Tumia njia rasmi ya benki kwa kuulizia salio. Vincent AI haipaswi kuomba au kuonyesha PIN, password, OTP au credentials kamili za mteja." },
  { keys: ["password", "pin", "otp", "phishing", "cyber"], en: "Never share passwords, PINs or OTPs in chat. For suspected compromise, use the bank's official reporting and blocking channels. Internally, combine access controls, monitoring, incident response and audit trails.", sw: "Usishirikishe password, PIN au OTP kwenye chat. Kwa suspected compromise, tumia njia rasmi ya kuripoti na kuzuia huduma. Ndani ya benki tumia access controls, monitoring, incident response na audit trails." },
  { keys: ["sla", "escalation", "breach"], en: "A strong SLA model defines priority, first-response target, resolution target, ownership and escalation levels. Alert before breach, not only after breach, and track ageing by team, product and branch.", sw: "SLA nzuri inaeleza priority, first-response target, resolution target, ownership na escalation levels. Tuma alert kabla SLA haijavunjika na fuatilia ageing kwa team, product na branch." },
  { keys: ["customer experience", "cx", "customer service", "huduma kwa wateja"], en: "AI can improve customer experience through intent classification, sentiment analysis, faster answers, next-best action, intelligent routing, complaint prevention, SLA monitoring and a 360-degree customer view. Complex cases should escalate to people.", sw: "AI inaweza kuboresha customer experience kupitia intent classification, sentiment analysis, majibu ya haraka, next-best action, intelligent routing, kuzuia malalamiko, SLA monitoring na customer 360. Kesi ngumu zi-escalate kwa binadamu." },
  { keys: ["kpi", "dashboard", "power bi", "analytics", "ripoti"], en: "A banking CX dashboard should show complaint volume, open versus closed cases, SLA compliance, repeat complaints, root causes, CSAT, response time, resolution time, product/channel performance and branch trends.", sw: "Dashboard ya banking CX ionyeshe complaint volume, open dhidi ya closed, SLA compliance, repeat complaints, root causes, CSAT, response time, resolution time, product/channel performance na branch trends." },
  { keys: ["loan", "mkopo", "credit"], en: "AI can support loan segmentation, affordability analysis and early-warning indicators, but credit decisions must follow the bank's approved credit policy, controls and human accountability.", sw: "AI inaweza kusaidia loan segmentation, affordability analysis na early-warning indicators, lakini maamuzi ya mkopo yafuate credit policy, controls na accountability ya binadamu." },
  { keys: ["automation", "automate", "workflow"], en: "A practical banking AI workflow can receive a case, identify intent, classify product and severity, check required information, route to the correct team, start the SLA, send updates, escalate overdue cases and produce management analytics.", sw: "AI workflow ya benki inaweza kupokea case, kutambua intent, kuainisha product na severity, kukagua taarifa, kupeleka team sahihi, kuanzisha SLA, kutuma updates, ku-escalate kesi zilizochelewa na kutoa management analytics." },
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

*{box-sizing:border-box}html,body{margin:0;min-height:100%;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#eef3f9;color:#12233d}button,input{font:inherit}.page{min-height:100vh;padding:18px}.app-shell{max-width:1500px;min-height:calc(100vh - 36px);margin:auto;display:flex;border:1px solid #dce5f0;border-radius:24px;overflow:hidden;background:#fff;box-shadow:0 20px 70px rgba(25,50,90,.12)}.sidebar{width:300px;background:#07152f;color:#dce8ff;padding:22px 16px;display:flex;flex-direction:column;transition:.25s}.sidebar.closed{width:0;padding:0;overflow:hidden}.brand{display:flex;gap:12px;align-items:center;padding:4px 8px 24px}.brand-mark{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;background:linear-gradient(135deg,#16a4ff,#635bff);font-size:23px;font-weight:900;color:#fff;box-shadow:0 8px 25px rgba(70,100,255,.28)}.brand strong{display:block;letter-spacing:1.7px;font-size:14px}.brand span{display:block;color:#8ea6cb;font-size:10px;margin-top:3px}.new-chat{border:1px solid #294366;background:#142746;color:#fff;border-radius:12px;padding:12px;text-align:left;cursor:pointer;margin-bottom:22px}.nav-label{font-size:10px;font-weight:800;letter-spacing:1.6px;color:#7189ad;margin:0 10px 8px}.sidebar nav{display:grid;gap:6px}.nav-item{display:flex;gap:11px;align-items:center;text-align:left;border:1px solid transparent;background:transparent;color:#a9bddb;border-radius:12px;padding:10px;cursor:pointer}.nav-item:hover,.nav-item.active{background:#172d4e;border-color:#2b4d76;color:#fff}.nav-item>span{font-size:19px}.nav-item b,.nav-item small{display:block}.nav-item b{font-size:12px}.nav-item small{font-size:9px;color:#7892b8;margin-top:2px}.sidebar-bottom{margin-top:auto}.secure{display:flex;gap:9px;background:#101f3b;border:1px solid #263f61;border-radius:12px;padding:11px;font-size:15px}.secure b,.secure small{display:block}.secure b{font-size:10px}.secure small{font-size:9px;color:#8299ba;margin-top:3px}.workspace{flex:1;min-width:0;background:#f7faff}.topbar{display:flex;gap:15px;align-items:flex-start;padding:24px 28px;border-bottom:1px solid #e1e9f3;background:#fff}.menu{border:1px solid #dbe4ef;background:#fff;border-radius:10px;padding:9px 11px;cursor:pointer}.eyebrow{font-size:10px;letter-spacing:2px;font-weight:900;color:#1777e8}.topbar h1{font-size:24px;margin:5px 0}.topbar p{margin:0;color:#64748b;font-size:12px}.top-actions{margin-left:auto;display:flex;gap:9px;align-items:center}.language{border:1px solid #d8e1ec;background:#fff;border-radius:10px;padding:8px 11px;cursor:pointer}.online{font-size:11px;font-weight:800;color:#16844a;white-space:nowrap}.online i{display:inline-block;width:7px;height:7px;border-radius:50%;background:#24b56d;margin-right:5px}.module-banner{margin:18px 28px 0;padding:14px 16px;border:1px solid #dbe6f3;border-radius:15px;background:linear-gradient(100deg,#edf6ff,#f9fbff);display:flex;justify-content:space-between;align-items:center}.module-banner>div{display:flex;gap:12px;align-items:center}.module-icon{font-size:25px}.module-banner b,.module-banner small{display:block}.module-banner b{font-size:13px}.module-banner small{font-size:10px;color:#718096;margin-top:3px}.badge{font-size:9px;font-weight:900;letter-spacing:1px;color:#1769cf;background:#dceeff;border-radius:999px;padding:6px 9px}.chat-card{margin:14px 28px 0;border:1px solid #dce6f1;border-radius:18px;background:#fff;box-shadow:0 8px 30px rgba(38,66,105,.06);overflow:hidden}.messages{min-height:390px;max-height:50vh;overflow:auto;padding:20px 22px}.message{display:flex;gap:10px;margin:14px 0;max-width:82%}.message.user{margin-left:auto;flex-direction:row-reverse}.avatar{width:31px;height:31px;flex:0 0 31px;border-radius:10px;background:#e8f2ff;color:#1568c5;display:grid;place-items:center;font-size:10px;font-weight:900}.user .avatar{background:#162b4c;color:#fff}.message-body small{display:block;color:#738196;font-size:9px;margin:1px 0 5px}.user .message-body{text-align:right}.bubble{display:inline-block;background:#eef5ff;border-radius:14px;padding:11px 14px;line-height:1.5;font-size:12px;color:#24354c}.user .bubble{background:#176fe8;color:#fff;text-align:left}.speak{display:block;border:0;background:transparent;color:#5b77a0;font-size:9px;padding:5px 0;cursor:pointer}.quick-title{font-size:10px;font-weight:800;color:#687a92;padding:0 22px 8px}.quick{display:flex;gap:7px;flex-wrap:wrap;padding:0 22px 16px}.quick button{border:1px solid #d9e3ee;background:#fbfdff;color:#38506e;border-radius:999px;padding:7px 10px;font-size:10px;cursor:pointer}.quick button:hover{border-color:#87b8ef;color:#1469ca}form{display:flex;gap:8px;padding:15px 16px;border-top:1px solid #e7edf4;background:#fbfdff}.voice,.send{border:0;border-radius:11px;cursor:pointer}.voice{width:43px;background:#e8f1fb}.voice.listening{background:#ffe8e8}.send{background:#176fe8;color:#fff;padding:0 20px;font-weight:800}form input{flex:1;border:1px solid #d4dfeb;border-radius:11px;padding:11px 13px;outline:none;background:#fff}form input:focus{border-color:#65a8ee;box-shadow:0 0 0 3px #e6f2ff}.hint{font-size:9px;color:#8390a0;text-align:center;padding:0 16px 13px}.feature-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:14px 28px}.feature-grid>div{border:1px solid #dce6f1;background:#fff;border-radius:14px;padding:13px}.feature-grid span{font-size:18px;display:block;margin-bottom:6px}.feature-grid b,.feature-grid small{display:block}.feature-grid b{font-size:11px}.feature-grid small{font-size:9px;color:#7a899b;margin-top:3px;line-height:1.4}footer{text-align:center;color:#8390a0;font-size:9px;padding:4px 20px 18px}@media(max-width:900px){.sidebar{width:255px}.feature-grid{grid-template-columns:repeat(2,1fr)}.topbar h1{font-size:21px}}@media(max-width:680px){.page{padding:0}.app-shell{min-height:100vh;border-radius:0}.sidebar{position:absolute;z-index:5;height:100%;box-shadow:10px 0 30px rgba(0,0,0,.2)}.topbar{padding:17px}.top-actions{gap:5px}.online{display:none}.module-banner,.chat-card{margin-left:12px;margin-right:12px}.feature-grid{margin-left:12px;margin-right:12px;grid-template-columns:1fr 1fr}.messages{min-height:45vh}.message{max-width:92%}.quick{overflow-x:auto;flex-wrap:nowrap}.quick button{white-space:nowrap}.send{padding:0 14px}}
