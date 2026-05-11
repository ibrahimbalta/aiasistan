/**
 * Büyük metinleri AI'nın daha iyi anlayabilmesi için küçük parçalara (chunks) böler.
 */
export function chunkText(text: string, size = 1000, overlap = 200): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = start + size;
    chunks.push(text.substring(start, end));
    start += size - overlap;
  }

  return chunks;
}
