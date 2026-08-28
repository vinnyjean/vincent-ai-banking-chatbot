"use client";

import { FormEvent, useMemo, useState } from "react";

type Message = { role: "user" | "assistant"; text: string };
type Lang = "en" | "sw";

type Module = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  prompts: string[];
};

const modules: Module[] = [
  { id:"cx", icon:"💬", title:"Customer Experience", subtitle:"Improve service quality and journeys", prompts:["How can AI improve customer experience?","How do I measure customer satisfaction?","How can I identify frustrated customers?","How can I improve branch customer service?","How can I reduce waiting time?","How can I build a customer journey map?"] },
  { id:"complaints", icon:"📋", title:"Complaints & SLA", subtitle:"Classify, prioritize and resolve complaints", prompts:["How can I reduce repeated customer complaints?","How do I set an SLA for complaints?","How should I handle an escalated complaint?","How can I analyze complaints by root cause?","How do I prioritize urgent complaints?","How can AI detect SLA breaches?"] },
  { id:"fraud", icon:"🛡️", title:"Fraud & Risk", subtitle:"Detect unusual activity and manage risk", prompts:["How can AI detect banking fraud?","What signals indicate suspicious transactions?","How should I investigate a fraud alert?","How can I reduce mobile banking fraud?","How can I build a fraud risk score?","What should I do after a customer reports fraud?"] },
  { id:"operations", icon:"🏦", title:"Banking Operations", subtitle:"Streamline branch and digital operations", prompts:["How should I handle a duplicate debit complaint?","How can I reduce operational errors?","How can I improve branch operations?","How can I reduce transaction turnaround time?","How can I improve account opening?","How can AI support banking operations?"] },
  { id:"automation", icon:"⚙️", title:"AI Automation", subtitle:"Design workflows for faster service", prompts:["Design an automated complaint workflow","How can AI route cases to the right team?","How can I automate SLA breach alerts?","How can I automate customer updates?","How can I connect a chatbot to CRM?","How can I automate fraud case escalation?"] },
  { id:"analytics", icon:"📊", title:"Insights & Analytics", subtitle:"Turn service data into decisions", prompts:["What banking customer service KPIs should I track?","How do I build a complaints dashboard?","How can AI identify recurring root causes?","How do I analyze customer churn?","How can I measure branch performance?","How can Power BI improve customer service reporting?"] },
];

const topicAnswers: { keys: string[]; en: string; sw: string }[] = [
  { keys:["balance","account balance","salio","akaunti yangu"], en:"For balance enquiries, use the bank's approved digital channel or branch process. Vincent AI should not request or expose a customer's PIN, password or full account credentials.", sw:"Kwa kuulizia salio, tumia njia rasmi ya benki kama mobile banking, internet banking au tawi. Vincent AI haipaswi kuomba au kuonyesha PIN, password au taarifa kamili za siri za akaunti." },
  { keys:["open account","account opening","fungua akaunti","kufungua akaunti"], en:"A good account-opening journey includes KYC verification, required documents, customer consent, screening, account creation and clear communication of fees and terms. Automate document checks but keep final approval under authorized staff.", sw:"Mchakato mzuri wa kufungua akaunti unahusisha KYC, uthibitishaji wa nyaraka, ridhaa ya mteja, screening, kutengeneza akaunti na kueleza ada pamoja na masharti. AI inaweza kusaidia kukagua nyaraka lakini idhini ya mwisho ibaki kwa mtumishi mwenye mamlaka." },
  { keys:["card","atm","cash withdrawal","kadi","atm imekataa","atm haijatoa"], en:"For an ATM or card issue, verify the transaction status, terminal response, account posting and any reversal. Protect the card, block it through the approved channel if compromised, and give the customer a clear case reference.", sw:"Kwa tatizo la ATM au kadi, thibitisha status ya muamala, majibu ya ATM, posting kwenye akaunti na kama reversal imefanyika. Kadi ikiwa imehatarishwa, izuie kupitia njia rasmi ya benki na mpe mteja namba ya kesi." },
  { keys:["mobile banking","mkononi","app","mobile app","sim banking"], en:"For mobile banking issues, classify the case into login, registration, transaction failure, delayed posting, device change or suspected fraud. Never collect a customer's PIN or one-time password in chat.", sw:"Kwa matatizo ya mobile banking, panga kesi kuwa login, usajili, muamala kushindikana, posting kuchelewa, kubadilisha kifaa au fraud. Usikusanye PIN au OTP ya mteja kupitia chatbot." },
  { keys:["transfer","bank transfer","tuma pesa","uhamisho","imechelewa","pending"], en:"For a delayed or failed transfer, check transaction status, reference, debit posting, destination status and settlement/reversal rules. Give the customer an expected resolution time and escalate when the SLA is breached.", sw:"Kwa transfer iliyochelewa au kushindikana, kagua status ya muamala, reference, debit, hali ya benki inayopokea na taratibu za settlement/reversal. Mpe mteja muda unaotarajiwa wa suluhisho na escalate SLA ikivunjika." },
  { keys:["loan","credit","mkopo","mikopo","repayment","marejesho"], en:"A responsible loan journey covers eligibility, affordability, credit assessment, pricing, repayment schedule, early-warning indicators and collections support. AI can assist with segmentation and early warnings, but credit decisions should follow the bank's approved policy and controls.", sw:"Mchakato mzuri wa mkopo unahusisha eligibility, uwezo wa kulipa, credit assessment, pricing, ratiba ya marejesho, early-warning indicators na collections. AI inaweza kusaidia segmentation na tahadhari za mapema, lakini maamuzi ya mkopo yafuate sera na controls za benki." },
  { keys:["deposit","savings","amana","akiba","fixed deposit","time deposit"], en:"For deposits and savings, explain product terms, interest calculation, maturity, withdrawal rules, fees and applicable taxes using the bank's approved product information.", sw:"Kwa amana na akiba, eleza masharti ya bidhaa, namna riba inavyokokotolewa, maturity, masharti ya kutoa fedha, ada na kodi kulingana na taarifa rasmi ya bidhaa ya benki." },
  { keys:["kyc","know your customer","utambulisho","kitambulisho"], en:"KYC should verify identity, customer information, beneficial ownership where applicable, risk classification and required updates. Use secure approved systems and avoid putting sensitive identity documents into a general chat.", sw:"KYC inapaswa kuthibitisha utambulisho, taarifa za mteja, beneficial ownership inapohitajika, risk classification na updates zinazotakiwa. Tumia mifumo salama iliyoidhinishwa na usiweke nyaraka nyeti kwenye chat ya kawaida." },
  { keys:["aml","money laundering","utakatishaji","pesa haramu","suspicious"], en:"AML controls should combine customer risk, transaction monitoring, unusual patterns, screening and investigation workflows. AI can prioritize alerts, but suspicious activity decisions and regulatory reporting must follow authorized compliance procedures.", sw:"AML inapaswa kuunganisha customer risk, transaction monitoring, patterns zisizo za kawaida, screening na investigation workflow. AI inaweza kupanga alerts kwa priority, lakini maamuzi ya suspicious activity na reporting yafanywe kwa taratibu rasmi za compliance." },
  { keys:["cybersecurity","cyber security","phishing","utapeli","link","password"], en:"For cyber-risk questions, advise customers not to share passwords, PINs or OTPs, not to click suspicious links, and to report suspected compromise through the bank's official channel. Internally, combine awareness, access controls, monitoring and incident response.", sw:"Kwa masuala ya cyber risk, waelekeze wateja wasishirikishe password, PIN au OTP, wasibofye links za mashaka, na waripoti tukio kupitia njia rasmi ya benki. Ndani ya benki, changanya awareness, access controls, monitoring na incident response." },
  { keys:["branch","tawi","waiting time","foleni","queue","kusubiri"], en:"To reduce branch waiting time, measure arrival-to-service time, queue length, peak periods, transaction types and staff utilization. Use appointment options, digital migration and dynamic staffing where appropriate.", sw:"Kupunguza muda wa kusubiri tawi, pima arrival-to-service time, urefu wa foleni, peak periods, aina za miamala na matumizi ya wafanyakazi. Tumia appointments, digital migration na kupanga staff kulingana na mahitaji." },
  { keys:["satisfaction","csat","nps","customer satisfaction","kuridhika"], en:"Useful CX measures include CSAT, NPS, customer effort, first-contact resolution, complaint recurrence, response time and resolution time. Combine survey data with operational and complaint data for a 360-degree view.", sw:"Vipimo muhimu vya CX ni CSAT, NPS, customer effort, first-contact resolution, kurudi kwa malalamiko, response time na resolution time. Unganisha survey data na operational pamoja na complaint data kupata customer 360." },
  { keys:["churn","retention","kuondoka kwa wateja","kupoteza wateja"], en:"A churn model can combine declining balances, reduced transactions, complaints, service failures, inactivity and competitor movement where legally and operationally appropriate. Use the score to trigger retention actions rather than automatic exclusion.", sw:"Churn model inaweza kutumia kupungua kwa salio, miamala kupungua, malalamiko, service failures na inactivity pale inapofaa. Tumia score kuanzisha retention actions, si kumtenga mteja moja kwa moja." },
  { keys:["employee","staff","training","mafunzo","mtumishi","wafanyakazi"], en:"AI can identify training needs from complaint themes, quality scores, repeat errors, handle time and policy exceptions. Use coaching dashboards and targeted learning rather than punitive scoring alone.", sw:"AI inaweza kutambua mahitaji ya mafunzo kutokana na mada za malalamiko, quality scores, makosa yanayojirudia, handle time na policy exceptions. Tumia dashboards za coaching na learning inayolengwa badala ya adhabu pekee." },
  { keys:["data privacy","privacy","faragha","data protection","taarifa binafsi"], en:"For banking AI, minimize personal data, apply role-based access, encryption, retention rules, audit trails and human review for sensitive decisions. Never place live customer credentials or secrets into a general-purpose chatbot.", sw:"Kwa AI ya benki, punguza personal data, tumia role-based access, encryption, retention rules, audit trails na human review kwenye maamuzi nyeti. Usiweke credentials au siri za mteja kwenye chatbot ya kawaida." },
  { keys:["power bi","reporting","dashboard","analytics","kpi","ripoti"], en:"A banking CX dashboard can show complaint volume, open versus closed cases, SLA compliance, repeat complaints, root causes, product and channel performance, CSAT, response time, resolution time and branch trends.", sw:"Dashboard ya banking CX inaweza kuonyesha complaint volume, open dhidi ya closed, SLA compliance, repeat complaints, root causes, product na channel performance, CSAT, response time, resolution time na mwenendo wa matawi." },
  { keys:["root cause","rca","chanzo","sababu kuu"], en:"For root-cause analysis, group cases by product, process, branch, channel, system error, staff error, policy, communication and customer segment. Use Pareto analysis and trend comparisons, then assign corrective actions with owners and deadlines.", sw:"Kwa root-cause analysis, panga kesi kwa product, process, branch, channel, system error, staff error, policy, communication na customer segment. Tumia Pareto na trend comparison, kisha mpe kila corrective action owner na deadline." },
  { keys:["sla","escalation","breach","escalate","muda wa huduma"], en:"A strong SLA model defines priority, first-response target, resolution target, ownership, escalation levels and customer communication. Alert before breach, not only after breach, and track aging by team and product.", sw:"SLA nzuri inaeleza priority, first-response target, resolution target, ownership, escalation levels na mawasiliano kwa mteja. Tuma alert kabla SLA haijavunjika, si baada tu, na fuatilia aging kwa team na product." },
  { keys:["duplicate","debit twice","charged twice","malipo mara mbili","kukatwa mara mbili"], en:"For a duplicate debit, verify both transaction references and ledger entries, determine whether one is a duplicate hold or completed debit, initiate the approved reversal or dispute process, assign an SLA and keep the customer informed until closure.", sw:"Kwa debit iliyokatwa mara mbili, thibitisha references na ledger entries zote, tambua kama moja ni hold au debit iliyokamilika, anzisha reversal au dispute iliyoidhinishwa, weka SLA na mfuatilie mteja hadi kesi ifungwe." },
  { keys:["fraud","udanganyifu","scam","utapeli","stolen","imeibiwa"], en:"AI fraud detection can combine amount, velocity, device, location, channel, beneficiary changes, customer history and unusual timing. High-risk alerts should go to trained investigators, with customer protection and evidence preservation handled under approved procedures.", sw:"AI ya fraud inaweza kuchanganya kiasi, velocity, device, location, channel, mabadiliko ya beneficiary, historia ya mteja na muda usio wa kawaida. Alerts zenye risk kubwa zipelekwe kwa investigators waliofunzwa, huku ulinzi wa mteja na kuhifadhi ushahidi vikifuata taratibu rasmi." },
  { keys:["complaint","complaints","malalamiko","complain","lalamika"], en:"A modern complaint process should capture the issue once, classify it, detect urgency and sentiment, assign ownership, start an SLA, send customer updates, analyze root cause and confirm closure. Repeated complaints should trigger higher priority and management visibility.", sw:"Mchakato wa kisasa wa malalamiko unapaswa kupokea issue mara moja, ku-classify, kutambua urgency na sentiment, kumpa owner, kuanzisha SLA, kutuma updates, kuchambua root cause na kuthibitisha closure. Malalamiko yanayojirudia yaongeze priority na visibility kwa management." },
  { keys:["automation","automate","workflow","mchakato otomatiki","automation ya benki"], en:"An AI service workflow can receive a case, identify intent, classify product and severity, check required information, assign the right team, start the SLA, send updates, escalate overdue cases and produce management analytics.", sw:"AI workflow inaweza kupokea case, kutambua intent, ku-classify product na severity, kukagua taarifa zinazohitajika, kupeleka team sahihi, kuanzisha SLA, kutuma updates, ku-escalate kesi zilizochelewa na kutoa analytics za management." },
  { keys:["customer experience","cx","experience","huduma kwa wateja","customer service","huduma"], en:"AI can improve customer experience through intent classification, sentiment analysis, faster answers, next-best action, personalized routing, complaint prevention, SLA monitoring and a 360-degree customer view. The best design combines AI speed with human escalation for complex cases.", sw:"AI inaweza kuboresha customer experience kupitia intent classification, sentiment analysis, majibu ya haraka, next-best action, routing sahihi, kuzuia malalamiko, SLA monitoring na customer 360. Mfumo bora unaunganisha kasi ya AI na human escalation kwa kesi ngumu." },
  { keys:["risk","hatari","credit risk","operational risk","risk management"], en:"A practical banking risk framework combines risk identification, scoring, controls, early-warning indicators, incident tracking, ownership, escalation and periodic review. AI can prioritize risk signals, but governance and human accountability remain essential.", sw:"Mfumo wa risk wa benki unaunganisha kutambua risk, scoring, controls, early-warning indicators, incident tracking, ownership, escalation na review ya mara kwa mara. AI inaweza kupanga risk signals kwa priority, lakini governance na accountability ya binadamu ni muhimu." },
];

const swahiliWords = ["habari","naomba","tafadhali","nina","nataka","nawezaje","vipi","kwa nini","mteja","benki","akaunti","salio","malalamiko","fraud","udanganyifu","mkopo","kadi","tawi","huduma","muda","foleni","kukatwa","pesa","tuma","utapeli","faragha","chanzo","hatari","riba","marejesho","namba"];

function detectLanguage(q: string, selected: Lang): Lang {
  if (selected === "sw") return "sw";
  return swahiliWords.some(w => q.includes(w)) ? "sw" : "en";
}

function answer(q: string, selectedLang: Lang) {
  const x = q.toLowerCase().trim();
  const lang = detectLanguage(x, selectedLang);
  const hit = topicAnswers.find(t => t.keys.some(k => x.includes(k)));
  if (hit) return lang === "sw" ? hit.sw : hit.en;
  if (x.includes("how") || x.includes("nawezaje") || x.includes("jinsi") || x.includes("nifanye nini") || x.includes("what should")) {
    return lang === "sw"
      ? "Ninaweza kulichambua swali hilo. Niambie eneo unalolenga—customer experience, complaint, fraud, risk, operations, loan, mobile banking, KYC, AML, analytics au automation—na nitakupa hatua, controls, KPI na workflow."
      : "I can analyze that question. Tell me the area—customer experience, complaints, fraud, risk, operations, loans, mobile banking, KYC, AML, analytics or automation—and I can provide steps, controls, KPIs and a practical workflow.";
  }
  return lang === "sw"
    ? "Mimi ni Vincent AI. Uliza kwa maneno yako kuhusu benki, customer experience, malalamiko, SLA, fraud, risk, operations, mobile banking, ATM, kadi, akaunti, mikopo, KYC, AML, cyber risk, analytics, Power BI, automation, staff training au customer retention. Si lazima uchague button."
    : "I’m Vincent AI. Ask in your own words about banking, customer experience, complaints, SLA, fraud, risk, operations, mobile banking, ATM, cards, accounts, loans, KYC, AML, cyber risk, analytics, Power BI, automation, staff training or customer retention. You do not need to choose a button.";
}

export default function Home() {
  const [messages,setMessages] = useState<Message[]>([{role:"assistant",text:"Karibu! Mimi ni Vincent AI Banking Assistant. Uliza swali lolote kuhusu benki, customer experience, malalamiko, fraud, risk, operations au AI automation."}]);
  const [input,setInput] = useState("");
  const [lang,setLang] = useState<Lang>("en");
  const [active,setActive] = useState("cx");
  const [listening,setListening] = useState(false);
  const [sidebar,setSidebar] = useState(true);
  const activeModule = useMemo(()=>modules.find(m=>m.id===active) ?? modules[0],[active]);

  function send(text=input) {
    const clean=text.trim();
    if(!clean) return;
    setMessages(m=>[...m,{role:"user",text:clean},{role:"assistant",text:answer(clean,lang)}]);
    setInput("");
  }
  function submit(e:FormEvent){e.preventDefault();send();}
  function speak(text:string){
    if(!(typeof window!=="undefined" && "speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text); u.lang=lang==="sw"?"sw-TZ":"en-US"; window.speechSynthesis.speak(u);
  }
  function voiceInput(){
    const SR=(window as any).SpeechRecognition||(window as any).webkitSpeechRecognition;
    if(!SR){setInput(lang==="sw"?"Voice input haijawezeshwa kwenye browser hii.":"Voice input is not supported by this browser.");return;}
    const r=new SR(); r.lang=lang==="sw"?"sw-TZ":"en-US"; r.interimResults=false;
    r.onstart=()=>setListening(true); r.onend=()=>setListening(false); r.onerror=()=>setListening(false);
    r.onresult=(e:any)=>setInput(e.results?.[0]?.[0]?.transcript??""); r.start();
  }

  const modulePrompts = [...activeModule.prompts,"How can I automate complaint handling?","What KPIs should management see weekly?"].slice(0,8);

  return <main className="page"><div className="app-shell">
    <aside className={`sidebar ${sidebar?"open":"closed"}`}>
      <div className="brand"><div className="brand-mark">V</div><div><strong>VINCENT AI</strong><span>Banking Intelligence</span></div></div>
      <button className="new-chat" onClick={()=>setMessages([{role:"assistant",text:lang==="sw"?"Karibu! Uliza swali lolote la benki.":"Welcome! Ask me any banking question."}])}>＋ New conversation</button>
      <div className="nav-label">AI SOLUTIONS</div>
      <nav>{modules.map(m=><button key={m.id} className={active===m.id?"nav-item active":"nav-item"} onClick={()=>{setActive(m.id);setInput(m.prompts[0]);}}><span>{m.icon}</span><div><b>{m.title}</b><small>{m.subtitle}</small></div></button>)}</nav>
      <div className="sidebar-bottom"><div className="secure">🔒 <span><b>Banking-ready design</b><small>Never enter PIN, OTP or passwords.</small></span></div></div>
    </aside>

    <section className="workspace">
      <header className="topbar">
        <button className="menu" onClick={()=>setSidebar(!sidebar)}>☰</button>
        <div><div className="eyebrow">VINCENT AI 2.0</div><h1>{lang==="sw"?"Msaidizi wa Benki na Huduma kwa Wateja":"Banking & Customer Experience Assistant"}</h1><p>{lang==="sw"?"Uliza kwa Kiswahili au English—si lazima kutumia maswali yaliyopendekezwa.":"Ask in English or Swahili—your question does not need to be a suggested prompt."}</p></div>
        <div className="top-actions"><button className="language" onClick={()=>setLang(lang==="en"?"sw":"en")}>{lang==="en"?"🇹🇿 SW":"🇬🇧 EN"}</button><div className="online"><i/> Online</div></div>
      </header>

      <div className="module-banner"><div><span className="module-icon">{activeModule.icon}</span><div><b>{activeModule.title}</b><small>{activeModule.subtitle}</small></div></div><span className="badge">{lang==="sw"?"MASWALI MENGI":"MULTI-TOPIC AI"}</span></div>

      <div className="chat-card">
        <div className="messages">{messages.map((m,i)=><div key={i} className={`message ${m.role}`}><div className="avatar">{m.role==="assistant"?"V":"You"}</div><div className="message-body"><small>{m.role==="assistant"?"Vincent AI":"You"}</small><div className="bubble">{m.text}</div>{m.role==="assistant"&&<button className="speak" onClick={()=>speak(m.text)}>🔊 Listen</button>}</div></div>)}</div>
        <div className="quick-title">{lang==="sw"?"Mifano ya maswali—uliza zaidi kwa maneno yako":"Examples—ask many more questions in your own words"}</div>
        <div className="quick">{modulePrompts.map(q=><button key={q} onClick={()=>send(q)}>{q}</button>)}</div>
        <form onSubmit={submit}><button type="button" aria-label="Voice input" className={`voice ${listening?"listening":""}`} onClick={voiceInput}>🎙️</button><input value={input} onChange={e=>setInput(e.target.value)} placeholder={lang==="sw"?"Uliza swali lolote kuhusu benki...":"Ask any banking question..."}/><button className="send">Send ➤</button></form>
        <div className="hint">Vincent AI provides guidance and workflow ideas. Verify decisions against your bank&apos;s policies, systems and regulatory requirements.</div>
      </div>

      <section className="feature-grid">
        <div><span>⚡</span><b>Open questions</b><small>Ask beyond the suggested prompts.</small></div>
        <div><span>🌍</span><b>English + Swahili</b><small>Swahili questions are detected and answered.</small></div>
        <div><span>🛡️</span><b>Risk aware</b><small>Fraud, AML, KYC and operational risk guidance.</small></div>
        <div><span>📚</span><b>Banking knowledge</b><small>Accounts, cards, loans, digital banking, CX and analytics.</small></div>
      </section>
      <footer>Vincent AI • Banking • Customer Experience • Fraud • Risk • Operations • Automation • Tanzania</footer>
    </section>
  </div></main>;
}
