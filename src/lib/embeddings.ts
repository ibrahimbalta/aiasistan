import axios from "axios";

/**
 * Metni vektör verisine (embedding) dönüştürür.
 * Varsayılan olarak HuggingFace veya OpenAI kullanılabilir.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  // Not: Canlıda OpenAI 'text-embedding-3-small' modeli önerilir.
  // Şimdilik yapısal olarak HuggingFace Inference API örneği kuruyoruz (Ücretsizdir).
  
  try {
    // OpenAI Entegrasyonu (Önerilen):
    /*
    const response = await axios.post(
      "https://api.openai.com/v1/embeddings",
      { model: "text-embedding-3-small", input: text },
      { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
    );
    return response.data.data[0].embedding;
    */

    // Şimdilik simülasyon veya hata yönetimi için boş dönüyoruz.
    // Kullanıcı API anahtarını girdiğinde yukarıdaki blok aktif edilecek.
    console.log("Embedding üretiliyor (Simülasyon):", text.substring(0, 50) + "...");
    return new Array(1536).fill(0); // 1536 boyutlu boş vektör
  } catch (error) {
    console.error("Embedding Hatası:", error);
    throw new Error("Metin vektöre dönüştürülemedi.");
  }
}
