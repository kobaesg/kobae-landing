import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { name, email } = await request.json();

        // Option 1: Save to Google Sheets (see next message)
        // Option 2: Save to Airtable
        // Option 3: Save to your database
        // Option 4: Just log for now
        
        console.log("Waitlist signup:", { name, email });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
    }
}
