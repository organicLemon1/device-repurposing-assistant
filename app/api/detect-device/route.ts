import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Simulate a 1-second process delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const brand = formData.get('brand')?.toString() || 'Apple';
    const model = formData.get('model')?.toString() || 'iPhone 8';

    return NextResponse.json({
      device_id: "dev_" + Math.random().toString(36).substring(2, 9),
      brand: brand,
      model: model,
      confidence: 0.82
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 });
  }
}
