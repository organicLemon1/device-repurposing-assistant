import { NextResponse } from 'next/server';

const BACKEND = 'https://device-rag-backend.onrender.com/api';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND}/device-specs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reach backend' }, { status: 500 });
  }
}
