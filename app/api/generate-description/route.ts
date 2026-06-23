import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const MAX_FIELD_LENGTH = 200;

function isValidField(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= MAX_FIELD_LENGTH;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { type, location, amenities } = (body as Record<string, unknown>) ?? {};

  if (!isValidField(type) || !isValidField(location) || !isValidField(amenities)) {
    return NextResponse.json(
      { error: `Property type, location, and amenities are required (max ${MAX_FIELD_LENGTH} characters each)` },
      { status: 400 },
    );
  }

  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY is not set");
    return NextResponse.json({ error: "AI description generator is not configured" }, { status: 500 });
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
    return NextResponse.json({ error: "AI generation is temporarily unavailable. Please try again shortly." }, { status: 502 });
  }
}
