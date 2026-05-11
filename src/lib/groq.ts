import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  console.warn("GROQ_API_KEY is missing from environment variables");
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function getChatCompletion(messages: any[], model = "llama-3.3-70b-versatile") {
  try {
    const response = await groq.chat.completions.create({
      messages,
      model,
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    return response.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Groq API Error:", error);
    throw error;
  }
}
