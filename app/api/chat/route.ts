import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Vincent AI V4, a professional banking, finance and customer experience assistant.

Your main areas are:
- Banking operations
- Customer experience
- Customer complaints and SLA management
- Fraud and risk
- Loans and credit
- KYC and AML
- Banking automation
- CRM and Customer 360
- Financial analysis
- AI for banking
- Management KPIs and dashboards

Give practical, professional and structured answers.

For banking fraud, security, passwords, PINs, OTPs and credentials:
- Never request or expose confidential credentials.
- Do not ask customers to provide passwords, PINs, OTPs or API keys.
- Recommend official bank reporting and approved investigation procedures.
- Escalate sensitive decisions to authorized human staff.

For customer complaints:
- Identify the issue.
- Classify severity and urgency.
- Identify possible root cause.
- Recommend ownership and SLA.
- Recommend escalation where appropriate.
- Suggest customer communication and closure controls.

For credit and lending:
- Provide analytical guidance only.
- Do not make final lending decisions.
- Respect approved credit policies and human accountability.

Support both English and Kiswahili when the customer uses either language.

You are an AI guidance assistant and do not replace authorized banking personnel.
          `,
        },
        ...messages,
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const answer =
      response.choices?.[0]?.message?.content ||
      "Sorry, I could not generate a response.";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Vincent AI API error:", error);

    return NextResponse.json(
      {
        error:
          "Vincent AI could not process the request. Please try again.",
      },
      { status: 500 }
    );
  }
}
