import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Section 8.2 — Rebecca Chat API Route (Next.js proxy)
 * POST /api/ai/chat
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, propertyId } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 });
    }

    const res = await fetch(`${API_BASE}/v1/ai/rebecca/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.get('Authorization') || '',
      },
      body: JSON.stringify({ message, propertyId }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Rebecca Chat] Error:', error);
    return NextResponse.json(
      {
        reply: 'Désolée, je rencontre une difficulté technique. Réessayez dans un instant.',
        error: true,
      },
      { status: 200 },
    );
  }
}
