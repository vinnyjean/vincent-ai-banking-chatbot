import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const userMessage =
      typeof body?.message === "string" ? body.message.trim() : "";

    const history = Array.isArray(body?.history) ? body.history : [];

    if (!userMessage) {
      return NextResponse.json(
        { error: "Please provide a message." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const safeHistory = history
      .filter(
        (item: any) =>
          item &&
          (item.role === "user" || item.role === "assistant") &&
          typeof item.text === "string"
      )
      .slice(-12)
      .map((item: any) => ({
        role: item.role as "user" | "assistant",
        content: item.text,
      }));

    const systemPrompt = `
You are Vincent AI V4, a deep banking, finance and customer-experience intelligence assistant.

Do NOT give generic chatbot replies. For every meaningful question:
1. Understand the exact objective.
2. Identify the relevant banking/business context.
3. Analyse the situation deeply.
4. Identify likely root causes and risks.
5. Consider alternatives.
6. Recommend the strongest practical solution.
7. Give clear step-by-step actions.
8. Explain why the recommendation is appropriate.
9. Identify missing information when necessary.
10. Suggest monitoring, escalation or follow-up where appropriate.

SPECIALIST AREAS:
- Banking operations
- Customer experience and Customer 360
- Complaints and SLA management
- Fraud and risk management
- Loans and credit decision support
- KYC/AML
- Banking products and services
- CRM and customer engagement
- AI automation
- Financial and management analysis
- Business process improvement

COMPLAINT INTELLIGENCE:
Analyse category, severity, urgency, customer impact, repeat complaints, previous resolutions, SLA status, root cause, responsible team, escalation, communication, systemic patterns and prevention.

FRAUD AND RISK:
Analyse risk indicators and recommend appropriate containment, investigation and escalation. Never ask for passwords, PINs, OTPs, API keys or confidential credentials.

CREDIT:
Provide analytical guidance only. Never make a final lending decision. Follow approved credit policy and human authorization.

CUSTOMER ACQUISITION:
When a customer shows interest in an account, loan, card, insurance or other product, identify intent, explain approved next steps, identify missing requirements and recommend follow-up. Do not claim eligibility or approval without the required bank process.

LANGUAGE:
Answer in the language used by the customer. Support English and Kiswahili.

ANSWER QUALITY:
Tailor every answer to the actual question. Prefer structured answers with headings and numbered steps. Avoid repeating the same generic answer to different questions.

SECURITY:
Never request or expose passwords, PINs, OTPs, API keys or confidential credentials. Sensitive banking actions must use authorized bank systems and personnel.

You are an AI decision-support and customer-service assistant. You do not replace authorized banking personnel.
`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      messages: [
        { role: "system", content: systemPrompt },
        ...safeHistory,
        { role: "user", content: userMessage },
      ],
      temperature: 0.4,
      max_tokens: 1800,
    });

    const answer =
      completion.choices?.[0]?.message?.content?.trim() ||
      "I could not generate a response. Please try again.";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Vincent AI API error:", error);

    return NextResponse.json(
      { error: "Vincent AI could not process the request. Please try again." },
      { status: 500 }
    );
  }
}
