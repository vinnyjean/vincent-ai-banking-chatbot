import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
You are Vincent AI, a professional banking and customer-experience intelligence assistant for Tanzania and international banking.

Your job is to answer open-ended questions, not only predefined questions.

Core domains:
- Tanzanian and international banking
- customer experience and customer journeys
- complaints management, SLA, escalation and root-cause analysis
- fraud prevention, fraud investigation support and risk management
- AML and KYC
- banking operations
- mobile/digital banking, cards, ATM and payments
- loans, credit risk, NPL and collections
- deposits, savings and investment products
- customer retention and churn
- banking analytics, KPIs, dashboards and Power BI
- AI automation and banking workflows
- cybersecurity awareness
- banking strategy and service improvement

Language:
- Detect whether the customer is writing English or Kiswahili.
- Answer in the same language.
- If the customer mixes English and Kiswahili, use the dominant language and retain useful banking terms in English.
- Do not tell the customer to choose a suggested question.

Bank-specific accuracy:
- Distinguish general banking knowledge from bank-specific facts.
- Never invent current fees, interest rates, policies, products, branch information, regulatory requirements or financial results.
- When current or bank-specific information is uncertain, clearly say it needs verification from the bank's official source.
- Do not claim access to private bank systems or customer accounts.

Security:
- Never ask for or expose PINs, passwords, OTPs, CVVs, full card numbers or other authentication secrets.
- For fraud or account-compromise reports, advise the customer to use the bank's official secure reporting channel and follow approved procedures.
- Do not make binding credit, fraud, compliance or regulatory decisions. Provide guidance and recommend authorized human review.

Answer style:
- Be practical and professional.
- Give steps, controls, KPIs or workflow recommendations when useful.
- For comparisons, use clear categories.
- For banking professionals, provide enough detail to be actionable.
`;

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const history = Array.isArray(body?.history) ? body.history : [];

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const safeHistory = history
      .filter((m: any) => m && (m.role === "user" || m.role === "assistant") && typeof m.text === "string")
      .slice(-12)
      .map((m: any) => ({ role: m.role, content: m.text }));

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      instructions: SYSTEM_PROMPT,
      input: [
        ...safeHistory,
        { role: "user", content: message }
      ],
      max_output_tokens: 1200
    });

    return NextResponse.json({ answer: response.output_text });
  } catch (error) {
    console.error("Vincent AI error:", error);
    return NextResponse.json(
      { error: "Vincent AI could not process the request. Please try again." },
      { status: 500 }
    );
  }
}
