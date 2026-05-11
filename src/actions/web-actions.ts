"use server";

export async function scrapeUrl(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    // Basit bir regex ile body içindeki metni çekiyoruz
    // Profesyonel bir uygulama için 'cheerio' veya 'puppeteer' gerekebilir 
    // ama MVP için temizlenmiş metin yeterli olacaktır.
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    let text = bodyMatch ? bodyMatch[1] : html;
    
    // Script, stil ve HTML etiketlerini temizle
    text = text
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return { success: true, content: text.substring(0, 5000) }; // İlk 5000 karakteri alalım
  } catch (error: any) {
    return { success: false, error: "Link okunurken bir hata oluştu. Lütfen geçerli bir URL girdiğinizden emin olun." };
  }
}
