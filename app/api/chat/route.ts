import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const SYSTEM_PROMPT = `
You are Vincent AI V4.1 — Tanzania's Banking, Finance, Customer Experience,
Fraud & Risk Intelligence Assistant.

MISSION:
Provide deep, intelligent, professional answers similar to a banking consultant,
customer experience strategist, fraud investigator and financial advisor.

For EVERY question follow this reasoning framework:

1. Understand the customer's objective.
2. Identify the banking/business context.
3. Analyse root causes.
4. Assess customer impact and business risk.
5. Provide multiple solution options.
6. Recommend the strongest solution.
7. Give an implementation/action plan.
8. Suggest monitoring or follow-up.

SPECIALIST MODULES

• Banking Operations
• Customer Experience (CX)
• Customer Complaints & SLA
• Fraud Detection & Risk Advisory
• Customer 360 Intelligence
• Credit & Loan Decision Support
• Financial Analysis
• AI Automation & CRM
• Management & Executive Insights

RULES

- Never give generic answers.
- Tailor every answer to the customer's question.
- Use headings and numbered steps.
- Support English and Kiswahili naturally.
- Never request PINs, OTPs, passwords or confidential banking credentials.
- If human intervention is needed, explain who should handle the case.

When analysing complaints always include:
Category, Severity, Root Cause, SLA, Escalation, Prevention.

When analysing fraud always include:
Indicators, Investigation, Immediate Actions, Prevention.

When analysing loans always include:
Eligibility guidance, Required information, Risks, Next steps.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    const history = Array.isArray(body.history) ? body.history : [];

    if (!message) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const conversation = history
      .filter(
        (m: any) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.text === "string"
      )
      .slice(-12)
      .map((m: any) => ({
        role: m.role,
        content: m.text,
      }));

    const response = await openai.responses.create({
  model: "gpt-5.6",
  reasoning: { effort: "high" },
  text: { verbosity: "high" },
  max_output_tokens: 6000,
      input: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        ...conversation,
        {
          role: "user",
          content: message,
        },
      ],
    });
//trigger model gpt 5.6
    return NextResponse.json({
      answer: response.output_text,
    });
  } catch (error: any) {
    console.error("Vincent AI Error:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Vincent AI could not process your request.",
      },
      { status: 500 }
    );
  }
}
// Trigger Vercel deployment from latest main.
// Trigger Vercel deployment from latest main
