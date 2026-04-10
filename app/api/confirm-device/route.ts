import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simulate basic network processing
    await new Promise(resolve => setTimeout(resolve, 500));

    const { device_id, model, brand } = body;

    if (!device_id) {
       return NextResponse.json({ error: 'device_id is required' }, { status: 400 });
    }

    // Conceptually forms the unified device name
    const device_name = `${brand || ''} ${model || ''}`.trim() || 'Unknown Device';

    return NextResponse.json({
      device_id,
      device_name
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 });
  }
}
