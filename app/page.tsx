 "use client";

import { FormEvent, useMemo, useState } from "react";

type Message = { role: "user" | "assistant"; text: string };
type Lang = "en" | "sw";

const modules = [
  { id:"cx", icon:"💬", title:"Customer Experience", subtitle:"Improve service quality and journeys",
    prompts:["How can AI improve customer experience?","Create a customer journey improvement plan","How can I identify frustrated customers?"] },
  { id:"complaints", icon:"📋", title:"Complaints & SLA", subtitle:"Classify, prioritize and resolve complaints",
    prompts:["How can I reduce repeated customer complaints?","How do I set an SLA for repeated complaints?","Analyze complaints by root cause"] },
  { id:"fraud", icon:"🛡️", title:"Fraud & Risk", subtitle:"Detect unusual activity and manage risk",
    prompts:["How can AI detect banking fraud?","Create a fraud risk scoring framework","What signals indicate suspicious transactions?"] },
  { id:"operations", icon:"🏦", title:"Banking Operations", subtitle:"Streamline branch and digital operations",
    prompts:["How can AI improve banking operations?","How should I handle a duplicate debit complaint?","How can I reduce operational errors?"] },
  { id:"automation", icon:"⚙️", title:"AI Automation", subtitle:"Design workflows for faster service",
    prompts:["Design an automated complaint workflow","How can AI route cases to the right team?","How can I automate SLA breach alerts?"] },
  { id:"analytics", icon:"📊", title:"Insights & Analytics", subtitle:"Turn service data into decisions",
    prompts:["What banking customer service KPIs should I track?","How do I build a complaints dashboard?","How can AI identify recurring root causes?"] },
];

function answer(q: string, lang: Lang) {
  const x = q.toLowerCase();
  if (x.includes("duplicate") || x.includes("debit twice"))
    return lang==="sw" ? "Thibitisha miamala yote miwili, kagua ledger ya core banking, anzisha dispute/reversal iliyoidhinishwa, weka SLA na mfuatilie mteja hadi suluhisho." : "Verify both transactions, check the core banking ledger, initiate the approved dispute or reversal workflow, assign an SLA, and keep the customer updated until resolution.";
  if (x.includes("fraud") || x.includes("udanganyifu"))
    return lang==="sw" ? "AI inaweza kuweka alama ya hatari kwa kiasi, kasi ya miamala, kifaa, eneo, channel na mabadiliko ya beneficiary, kisha kupeleka kesi hatarishi kwa uchunguzi." : "AI can score transactions using amount, velocity, device, location, channel and beneficiary-change signals, then route high-risk cases for investigation.";
  if (x.includes("complaint") || x.includes("malalamiko") || x.includes("repeated"))
    return lang==="sw" ? "Panga malalamiko kwa root cause, bidhaa, tawi, channel na customer segment. Weka alerts kwa thresholds, mpe owner kesi na fuatilia SLA." : "Group complaints by root cause, product, branch, channel and customer segment. Trigger alerts when thresholds are exceeded, assign an owner and monitor the SLA.";
  if (x.includes("experience") || x.includes("customer") || x.includes("huduma"))
    return lang==="sw" ? "AI inaweza kuboresha customer experience kupitia classification ya malalamiko, sentiment analysis, next-best action, SLA monitoring na customer 360." : "AI can improve customer experience through complaint classification, sentiment analysis, next-best action, SLA monitoring and a 360-degree customer view.";
  if (x.includes("automation") || x.includes("automate") || x.includes("workflow"))
    return lang==="sw" ? "Workflow inaweza kupokea complaint, ku-classify, kuweka priority, kumpa owner, kuanzisha SLA, kutuma updates na ku-escalate kesi iliyochelewa." : "An AI workflow can receive a complaint, classify it, prioritize it, assign an owner, start the SLA, send updates and escalate overdue cases.";
  if (x.includes("kpi") || x.includes("dashboard") || x.includes("analytics"))
    return lang==="sw" ? "Fuatilia complaint volume, first response time, resolution time, SLA compliance, repeat complaints, root causes, sentiment, channel performance na cost to serve." : "Track complaint volume, first response time, resolution time, SLA compliance, repeat complaints, root causes, customer sentiment, channel performance and cost to serve.";
  return lang==="sw" ? "Mimi ni Vincent AI. Naweza kusaidia kwenye shughuli za benki, customer experience, malalamiko, fraud, risk na AI automation." : "I’m Vincent AI Banking Assistant. Ask me about banking operations, customer experience, complaints, fraud, risk or AI automation.";
}

export default function Home() {
  const [messages,setMessages] = useState<Message[]>([{role:"assistant",text:"Karibu! Mimi ni Vincent AI Banking Assistant. Ninawezaje kukusaidia leo?"}]);
  const [input,setInput] = useState("");
  const [lang,setLang] = useState<Lang>("en");
  const [active,setActive] = useState("cx");
  const [listening,setListening] = useState(false);
  const [sidebar,setSidebar] = useState(true);
  const activeModule = useMemo(()=>modules.find(m=>m.id===active) ?? modules[0],[active]);

  function send(text=input) {
    const clean=text.trim(); if(!clean) return;
    setMessages(m=>[...m,{role:"user",text:clean},{role:"assistant",text:answer(clean,lang)}]); setInput("");
  }
  function submit(e:FormEvent){e.preventDefault();send();}
  function speak(text:string){
    if(!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text); u.lang=lang==="sw"?"sw-TZ":"en-US"; window.speechSynthesis.speak(u);
  }
  function voiceInput(){
    const SR=(window as any).SpeechRecognition||(window as any).webkitSpeechRecognition;
    if(!SR){setInput(lang==="sw"?"Voice input haijawezeshwa kwenye browser hii.":"Voice input is not supported by this browser.");return;}
    const r=new SR(); r.lang=lang==="sw"?"sw-TZ":"en-US"; r.interimResults=false;
    r.onstart=()=>setListening(true); r.onend=()=>setListening(false);
    r.onresult=(e:any)=>setInput(e.results?.[0]?.[0]?.transcript??""); r.start();
  }

  return <main className="page"><div className="app-shell">
    <aside className={`sidebar ${sidebar?"open":"closed"}`}>
      <div className="brand"><div className="brand-mark">V</div><div><strong>VINCENT AI</strong><span>Banking Intelligence</span></div></div>
      <button className="new-chat" onClick={()=>setMessages([{role:"assistant",text:lang==="sw"?"Karibu! Mimi ni Vincent AI Banking Assistant. Ninawezaje kukusaidia leo?":"Hello! I’m Vincent AI Banking Assistant. How can I help you today?"}])}>＋ New conversation</button>
      <div className="nav-label">AI SOLUTIONS</div>
      <nav>{modules.map(m=><button key={m.id} className={active===m.id?"nav-item active":"nav-item"} onClick={()=>{setActive(m.id);setInput(m.prompts[0]);}}><span>{m.icon}</span><div><b>{m.title}</b><small>{m.subtitle}</small></div></button>)}</nav>
      <div className="sidebar-bottom"><div className="secure">🔒 <span><b>Banking-ready design</b><small>Do not enter confidential customer data.</small></span></div></div>
    </aside>

    <section className="workspace">
      <header className="topbar">
        <button className="menu" onClick={()=>setSidebar(!sidebar)}>☰</button>
        <div><div className="eyebrow">VINCENT AI 2.0</div><h1>{lang==="sw"?"Msaidizi wa Benki na Huduma kwa Wateja":"Banking & Customer Experience Assistant"}</h1><p>{lang==="sw"?"AI kwa shughuli za benki, malalamiko, fraud, risk na customer experience.":"AI support for banking operations, complaints, fraud, risk and customer experience."}</p></div>
        <div className="top-actions"><button className="language" onClick={()=>setLang(lang==="en"?"sw":"en")}>{lang==="en"?"🇹🇿 SW":"🇬🇧 EN"}</button><div className="online"><i/> Online</div></div>
      </header>

      <div className="module-banner"><div><span className="module-icon">{activeModule.icon}</span><div><b>{activeModule.title}</b><small>{activeModule.subtitle}</small></div></div><span className="badge">AI ASSISTANT</span></div>

      <div className="chat-card">
        <div className="messages">{messages.map((m,i)=><div key={i} className={`message ${m.role}`}><div className="avatar">{m.role==="assistant"?"V":"You"}</div><div className="message-body"><small>{m.role==="assistant"?"Vincent AI":"You"}</small><div className="bubble">{m.text}</div>{m.role==="assistant"&&<button className="speak" onClick={()=>speak(m.text)}>🔊 Listen</button>}</div></div>)}</div>
        <div className="quick-title">Suggested actions</div>
        <div className="quick">{[...activeModule.prompts,"How can I automate complaint handling?"].slice(0,5).map(q=><button key={q} onClick={()=>send(q)}>{q}</button>)}</div>
        <form onSubmit={submit}><button type="button" className={`voice ${listening?"listening":""}`} onClick={voiceInput}>🎙️</button><input value={input} onChange={e=>setInput(e.target.value)} placeholder={lang==="sw"?"Uliza Vincent AI kuhusu benki...":"Ask Vincent AI about banking..."}/><button className="send">Send ➤</button></form>
        <div className="hint">Vincent AI provides guidance and workflow ideas. Verify decisions against your bank&apos;s policies, systems and regulatory requirements.</div>
      </div>

      <section className="feature-grid">
        <div><span>⚡</span><b>Fast triage</b><small>Classify and prioritize customer cases.</small></div>
        <div><span>🎯</span><b>Root-cause focus</b><small>Find recurring service problems.</small></div>
        <div><span>🛡️</span><b>Risk aware</b><small>Flag patterns for human investigation.</small></div>
        <div><span>🌍</span><b>English + Swahili</b><small>Designed for Tanzania customer service.</small></div>
      </section>
      <footer>Vincent AI • Banking • Customer Experience • Fraud • Risk • Automation • Tanzania</footer>
    </section>
  </div></main>;
}
