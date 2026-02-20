import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(request: Request) {
    try {
        const { name, email } = await request.json();

        console.log("=== Environment Variables Check ===");
        console.log("GOOGLE_SHEET_ID exists?", !!process.env.GOOGLE_SHEET_ID);
        console.log("GOOGLE_SHEET_ID value:", process.env.GOOGLE_SHEET_ID);
        console.log("CLIENT_EMAIL exists?", !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL);
        console.log("PRIVATE_KEY exists?", !!process.env.GOOGLE_SHEETS_PRIVATE_KEY);
        console.log("PRIVATE_KEY starts with?", process.env.GOOGLE_SHEETS_PRIVATE_KEY?.substring(0, 30));

        if (!process.env.GOOGLE_SHEET_ID) {
            throw new Error("GOOGLE_SHEET_ID is not set in environment variables");
        }
        if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL) {
            throw new Error("GOOGLE_SHEETS_CLIENT_EMAIL is not set");
        }
        if (!process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
            throw new Error("GOOGLE_SHEETS_PRIVATE_KEY is not set");
        }

        // Set up Google Sheets
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });

        // Add row to sheet
        const result = await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: "Sheet1!A:C",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[name, email, new Date().toISOString()]],
            },
        });

        console.log("Success! Added row");
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Detailed error:", error.message);
        return NextResponse.json(
            { error: "Failed to join waitlist", details: error.message },
            { status: 500 }
        );
    }
}