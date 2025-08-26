import { NextResponse } from "next/server";
import ollama from "ollama";

export async function POST(req: Request) {
  try {
    const { code, language = "javascript" } = await req.json();

    if (!code || !code.trim()) {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      );
    }

    // Better prompt for Llama
    const prompt = `
Add clear, helpful comments to this ${language} code. 

RULES:
1. DO NOT change any existing code
2. ONLY add comments
3. Explain what functions do
4. Explain complex logic
5. Use proper ${language} comment syntax
6. Don't add obvious comments

CODE:
${code}

Return ONLY the code with comments added, nothing else.
    `;

    const response = await ollama.chat({
      model: "llama3:latest",
      messages: [{ role: "user", content: prompt }],
      options: {
        temperature: 0.3,
      }
    });

    let commentedCode = response.message.content;

    // Clean up the response
    commentedCode = commentedCode
      .replace(/```[\w]*\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    return NextResponse.json({ commentedCode });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process code. Please try again." },
      { status: 500 }
    );
  }
}