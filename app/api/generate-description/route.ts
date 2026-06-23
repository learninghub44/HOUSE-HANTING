import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  const { type, location, amenities } = await req.json();

  if (!type || !location || !amenities) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a professional Kenyan property copywriter writing rental listings for House Hunt Kisii, a premium marketplace in Kisii County, Kenya. Write concise, factual, compelling descriptions. No emojis, no bullet points, no headers — plain prose only. 3-4 sentences maximum.",
        },
        {
          role: "user",
          content: `Write a rental listing description for:
- Property type: ${type}
- Location: ${location}
- Amenities: ${amenities}

Requirements: mention the location naturally, highlight the most appealing amenities, end with a practical note about viewing or availability. Write for a Kenyan audience familiar with Kisii County.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const description = response.choices[0].message.content?.trim() ?? "";
    return NextResponse.json({ description });
  } catch (err) {
    console.error("Groq error:", err);
    return NextResponse.json({ error: "AI generation failed. Check your GROQ_API_KEY." }, { status: 500 });
  }
}
