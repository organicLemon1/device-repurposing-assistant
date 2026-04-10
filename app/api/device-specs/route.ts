import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simulate a complex search/extraction delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const { device_id, device_name } = body;

    if (!device_id) {
       return NextResponse.json({ error: 'device_id is required' }, { status: 400 });
    }

    return NextResponse.json({
      device_id,
      device_name,
      components: [
        "Lithium-ion Battery (1821 mAh)",
        "Rear Camera Module (12MP)",
        "Front Camera (7MP)",
        "Retina IPS LCD Display (4.7-inch)",
        "Taptic Engine (Vibration Motor)",
        "A11 Bionic Chipset Logic Board",
        "Speaker Module"
      ],
      capabilities: [
        "Touchscreen Interface",
        "Bluetooth 5.0",
        "Wi-Fi",
        "NFC",
        "Camera & Video Recording"
      ],
      sources: ["ifixit.com", "gsmarena.com"]
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to extract specs' }, { status: 500 });
  }
}
