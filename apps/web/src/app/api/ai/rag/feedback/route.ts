import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/** Section 8.1.2 — RAG Feedback Loop. POST /api/ai/rag/feedback */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${API_BASE}/v1/ai/rag/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.get('Authorization') || '',
      },
      body: JSON.stringify(body),
    });
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: 'Feedback non enregistré' }, { status: 500 });
  }
}
