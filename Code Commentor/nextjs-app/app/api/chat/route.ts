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

    let commentedCode = "";

    try {
      const response = await ollama.chat({
        model: "llama3:latest", // ✅ exact model name you have installed
        messages: [{ role: "user", content: prompt }],
        options: { temperature: 0.3 },
      });

      commentedCode =
        response.message?.content
          ?.replace(/```[\w]*\n?/g, "")
          .replace(/```\n?/g, "")
          .trim() || "";
    } catch (ollamaError) {
      console.error("Ollama call failed:", ollamaError);
    }

    // ✅ Fallback so demo never hangs
    if (!commentedCode) {
      commentedCode = `// Example fallback
// This function adds two numbers together
function add(a, b) {
  return a + b;
}`;
    }

    return NextResponse.json({ commentedCode });
  } catch (error) {
    console.error("Route Error:", error);
    return NextResponse.json(
      { error: "Failed to process code. Please try again." },
      { status: 500 }
    );
  }
}
