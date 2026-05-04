import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/** Section 8.3.1 — Market Trends. GET /api/ai/market-trends/[city]/[type] */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ city: string; type: string }> },
) {
  try {
    const { city, type } = await params;
    const res = await fetch(`${API_BASE}/v1/ai/market-trends/${city}/${type}`);
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: 'Données de marché indisponibles' }, { status: 500 });
  }
}
