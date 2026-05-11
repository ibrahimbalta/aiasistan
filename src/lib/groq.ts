import Groq from "groq-sdk";

// Create client lazily to avoid build-time errors when API key is missing
let groqClient: Groq | null = null;

export const getGroqClient = () => {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.warn("GROQ_API_KEY is missing. AI features will not work.");
      return new Groq({ apiKey: "dummy_key_for_build" });
    }
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
};

// Re-implement getChatCompletion for RAG and other modules
export async function getChatCompletion(messages: any[]) {
  const client = getGroqClient();
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    temperature: 0.7,
    max_tokens: 1024,
  });

  return response.choices[0]?.message?.content || "";
}

// Also export the client for backward compatibility, but wrap it
export const groq = new Proxy({} as Groq, {
  get: (target, prop) => {
    const client = getGroqClient();
    return (client as any)[prop];
  }
});
