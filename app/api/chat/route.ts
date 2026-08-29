import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are Vincent AI V4, a professional Banking, Finance and Customer Experience Intelligence Assistant.

Your main areas of expertise are:
- Banking operations
- Customer experience and Customer 360
- Customer complaints and SLA management
- Fraud detection and prevention
- Risk management
- Loans and credit operations
- KYC and AML
- Banking analytics
- AI automation
- Management insights

Provide practical, structured and professional answers.

For sensitive banking decisions, recommend appropriate human review,
approved bank policies, internal controls and escalation procedures.

Never ask customers for passwords, PINs, OTPs, full card numbers,
API keys or other authentication credentials.

Support English and Swahili.
Respond in the language used by the user.

For fraud, security and financial-risk matters, do not claim certainty
without sufficient evidence. Recommend investigation and appropriate
bank-approved controls.

Your goal is to help banking professionals improve customer experience,
operational efficiency, fraud prevention, risk management and intelligent
automation.
`;

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "OPENAI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const body = await request.json();

    const message =
      typeof body?.message === "string" ? body.message.trim() : "";

    const history = Array.isArray(body?.history) ? body.history : [];

    if (!message) {
      return Response.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const previousMessages = history
      .filter(
        (item: any) =>
          (item?.role === "user" || item?.role === "assistant") &&
          typeof item?.text === "string"
      )
      .slice(-12)
      .map((item: any) => ({
        role: item.role,
        content: item.text,
      }));

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",
      input: [
        {
          role: "developer",
          content: SYSTEM_PROMPT,
        },
        ...previousMessages,
        {
          role: "user",
          content: message,
        },
      ],
    });

    return Response.json({
      answer: response.output_text,
    });
  } catch (error) {
    console.error("Vincent AI API error:", error);

    return Response.json(
      {
        error: "Vincent AI could not process the request.",
      },
      { status: 500 }
    );
  }
}
