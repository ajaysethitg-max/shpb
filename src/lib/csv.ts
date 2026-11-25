/** Minimal, robust CSV parser (RFC-4180-ish): quotes, escaped quotes, CRLF. */
export function parseCSV(input: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  const text = input.replace(/^﻿/, "");
  while (i < text.length) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += ch;
      i += 1;
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (ch === ",") {
      cur.push(field);
      field = "";
      i += 1;
      continue;
    }
    if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i += 1;
      cur.push(field);
      field = "";
      if (cur.some((c) => c.trim() !== "")) rows.push(cur);
      cur = [];
      i += 1;
      continue;
    }
    field += ch;
    i += 1;
  }
  cur.push(field);
  if (cur.some((c) => c.trim() !== "")) rows.push(cur);
  return rows;
}

export function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}
