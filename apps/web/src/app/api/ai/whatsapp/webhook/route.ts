import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Section 8.2.3 — WhatsApp Webhook (Meta Cloud API verification + message handling)
 * GET  /api/ai/whatsapp/webhook  → Verify token (Meta handshake)
 * POST /api/ai/whatsapp/webhook  → Receive incoming messages
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Forward to NestJS AI module
    const res = await fetch(`${API_BASE}/v1/ai/whatsapp/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    return NextResponse.json(await res.json());
  } catch (error) {
    console.error('[WhatsApp Webhook]', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
