import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simulate LLM Generation Delay (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));

    const { device_id } = body;

    if (!device_id) {
       return NextResponse.json({ error: 'device_id is required' }, { status: 400 });
    }

    return NextResponse.json({
      projects: [
        {
          title: "DIY Security Camera",
          difficulty: "Easy",
          steps: {
            "1": "Install an IP webcam app like 'Alfred Camera' or 'IP Webcam'.",
            "2": "Mount the device overlooking the desired security area.",
            "3": "Continuously connect the device to power to ensure uptime.",
            "4": "Access the camera feed via a browser or companion mobile app securely."
          }
        },
        {
          title: "Smart Home Remote Dashboard",
          difficulty: "Medium",
          steps: {
            "1": "Remove unneeded apps to declutter the device interface.",
            "2": "Install a smart home hub app (e.g., Home Assistant or Google Home).",
            "3": "Configure Android Kiosk Mode or Guided Access to lock the app on screen.",
            "4": "Mount the device to a wall using a custom 3D printed frame or adhesive stand."
          }
        },
        {
          title: "Dedicated Media Server",
          difficulty: "Hard",
          steps: {
            "1": "Root or jailbreak the device to access advanced filesystem privileges.",
            "2": "Install server software (e.g., Plex Media Server).",
            "3": "Attach external storage drives using an OTG adapter.",
            "4": "Configure continuous network sharing protocols and port forwarding."
          }
        }
      ]
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate ideas' }, { status: 500 });
  }
}
