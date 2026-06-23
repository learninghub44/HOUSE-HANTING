export const runtime = "edge";
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  if (!query?.trim()) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a helpful property search assistant for House Hunt Kisii, a rental marketplace in Kisii County, Kenya. 
          
When a user describes what they are looking for, give a short, practical response (2-3 sentences max) that:
1. Acknowledges their requirement
2. Mentions the best matching areas in Kisii County (Kisii Town, Nyanchwa, Daraja Mbili, Suneka, Keroka, Ogembo, Nyamataro)
3. Gives one practical tip about their search

Keep the response conversational and grounded in the Kisii rental market. Typical rent ranges: bedsitters KES 5,000–10,000; 1-bed KES 8,000–15,000; 2-bed KES 12,000–25,000; family homes KES 20,000–45,000.`,
        },
        {
          role: "user",
          content: query,
        },
      ],
      temperature: 0.6,
      max_tokens: 200,
    });

    const reply = response.choices[0].message.content?.trim() ?? "";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Groq error:", err);
    return NextResponse.json({ error: "AI assistant unavailable. Check your GROQ_API_KEY." }, { status: 500 });
  }
}
