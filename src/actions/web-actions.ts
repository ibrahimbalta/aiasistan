"use server";

import * as cheerio from 'cheerio';

export async function scrapeUrl(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      next: { revalidate: 3600 } // Önbelleğe alma
    });

    if (!response.ok) throw new Error("Sayfaya erişilemedi.");
    
    const html = await response.text();
    const $ = cheerio.load(html);

    // Gereksiz etiketleri temizle
    $('script, style, noscript, iframe, footer, header, nav, aside, form, button, .ads, .sidebar, .menu').remove();

    // Sayfa başlığını al
    const title = $('title').text().trim();
    
    // Ana içeriği hedefle (main veya article varsa onları önceliklendir)
    let contentElement = $('main, article, .content, .main-content');
    
    // Eğer özel bir içerik alanı bulunamadıysa body üzerinden devam et
    if (contentElement.length === 0) {
      contentElement = $('body');
    }

    // Metni temizle ve düzenle
    let text = contentElement.text()
      .replace(/\s+/g, ' ') // Fazla boşlukları temizle
      .replace(/\n+/g, '\n') // Fazla satır başlarını temizle
      .trim();

    // Eğer metin çok kısaysa (belki JS ile yükleniyordur), tüm body'den dene
    if (text.length < 200) {
      text = $('body').text().replace(/\s+/g, ' ').trim();
    }

    // Maksimum 10.000 karakter alalım (Yapay zekanın en verimli çalıştığı aralık)
    const finalContent = `SAYFA BAŞLIĞI: ${title}\n\nİÇERİK:\n${text.substring(0, 10000)}`;

    return { 
      success: true, 
      content: finalContent,
      title: title
    };
  } catch (error: any) {
    console.error("Scrape Error:", error);
    return { 
      success: false, 
      error: "Web sitesi taranırken bir hata oluştu. Sayfa yapısı çok karmaşık olabilir veya bot koruması bulunabilir." 
    };
  }
}
