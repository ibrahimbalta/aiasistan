"use server";

import * as cheerio from 'cheerio';

export async function scrapeUrl(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://www.google.com/',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      next: { revalidate: 3600 }
    });

    if (response.status === 403) {
      throw new Error("BOT_PROTECTION");
    }

    if (!response.ok) throw new Error("Sayfaya erişilemedi.");
    
    const html = await response.text();
    const $ = cheerio.load(html);

    // Gereksiz etiketleri temizle
    $('script, style, noscript, iframe, footer, header, nav, aside, form, button, .ads, .sidebar, .menu').remove();

    // Sayfa başlığını al
    const title = $('title').text().trim();
    
    // Ana içeriği hedefle
    let contentElement = $('main, article, .content, .main-content');
    
    if (contentElement.length === 0) {
      contentElement = $('body');
    }

    let text = contentElement.text()
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();

    if (text.length < 200) {
      text = $('body').text().replace(/\s+/g, ' ').trim();
    }

    const finalContent = `SAYFA BAŞLIĞI: ${title}\n\nİÇERİK:\n${text.substring(0, 10000)}`;

    return { 
      success: true, 
      content: finalContent,
      title: title
    };
  } catch (error: any) {
    console.error("Scrape Error:", error);
    
    let errorMessage = "Web sitesi taranırken bir hata oluştu. Sayfa yapısı çok karmaşık olabilir.";
    
    if (error.message === "BOT_PROTECTION" || error.message?.includes("403")) {
      errorMessage = "Bu web sitesi (Hepsiemlak vb.) yoğun bot koruması kullanıyor ve otomatik taramaya izin vermiyor. Lütfen 'Metin' sekmesini kullanarak içeriği manuel yapıştırın.";
    }

    return { 
      success: false, 
      error: errorMessage
    };
  }
}
