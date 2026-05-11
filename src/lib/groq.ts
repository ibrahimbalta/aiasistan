import Groq from "groq-sdk";

// Create client lazily to avoid build-time errors when API key is missing
let groqClient: Groq | null = null;

export const getGroqClient = () => {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.warn("GROQ_API_KEY is missing. AI features will not work.");
      // Return a dummy client or handle it in your routes
      return new Groq({ apiKey: "dummy_key_for_build" });
    }
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
};

// Also export the client for backward compatibility, but wrap it
export const groq = new Proxy({} as Groq, {
  get: (target, prop) => {
    const client = getGroqClient();
    return (client as any)[prop];
  }
});
