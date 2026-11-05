/*
 * Reading time from Markdown source. Code blocks and maths are counted at a
 * slower rate than prose, because they are read more slowly.
 */

const PROSE_WPM = 220;
const DENSE_WPM = 90;

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function readingTime(markdown: string): { minutes: number; words: number } {
  const dense: string[] = [];
  const prose = markdown
    .replace(/```[\s\S]*?```|~~~[\s\S]*?~~~|\$\$[\s\S]*?\$\$/g, (block) => {
      dense.push(block);
      return " ";
    })
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`~|-]/g, " ");

  const proseWords = countWords(prose);
  const denseWords = countWords(dense.join(" "));
  const minutes = Math.max(1, Math.round(proseWords / PROSE_WPM + denseWords / DENSE_WPM));
  return { minutes, words: proseWords + denseWords };
}
