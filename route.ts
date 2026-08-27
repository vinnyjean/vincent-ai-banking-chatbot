import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `You are Vincent AI, a professional banking and customer experience assistant focused on Tanzania and East African banking operations.
Provide practical, risk-aware guidance on customer complaints, service quality, fraud risk, SLA management, customer 360, operations, and banking controls.
Never claim to have access to a customer's account, core banking system, CRM, or transaction records unless data is explicitly supplied in the conversation.
For suspected fraud or duplicate debits, recommend verification, transaction holds where appropriate, evidence preservation, escalation, and compliance with the bank's approved procedures.
Do not request passwords, PINs, OTPs, full card numbers, or other sensitive authentication secrets.
Keep answers clear, structured, and actionable.`;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-5-mini';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY is not configured in Vercel Environment Variables.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    const history = Array.isArray(body?.history) ? body.history : [];

    if (!message) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const prior = history
      .filter((item: any) => item && (item.role === 'user' || item.role === 'ai') && typeof item.text === 'string')
      .slice(-12)
      .map((item: any) => `${item.role === 'ai' ? 'Assistant' : 'User'}: ${item.text}`)
      .join('\n');

    const input = `${prior ? `Conversation history:\n${prior}\n\n` : ''}User: ${message}`;

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        instructions: SYSTEM_PROMPT,
        input,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const detail = data?.error?.message || 'OpenAI request failed.';
      return NextResponse.json({ error: detail }, { status: response.status });
    }

    const text = Array.isArray(data?.output)
      ? data.output
          .flatMap((item: any) => Array.isArray(item?.content) ? item.content : [])
          .filter((item: any) => item?.type === 'output_text' && typeof item?.text === 'string')
          .map((item: any) => item.text)
          .join('\n')
          .trim()
      : '';

    return NextResponse.json({ text: text || 'Vincent AI received your request but returned no text.' });
  } catch (error) {
    console.error('Vincent AI API error:', error);
    return NextResponse.json({ error: 'Unable to reach the AI service. Please try again.' }, { status: 500 });
  }
}
