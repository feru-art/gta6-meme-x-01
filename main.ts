// gta6-meme-x-01 entry program (Node 22, standard library only).
//
// The entry itself is a meme post on X; this program only hands the grader
// the post's address. It reads POST.json from the repository root, checks
// it is a JSON object with a url field, and writes those exact bytes to
// POST.json inside the output directory, where the gate reads it.
//
// The grader runs it twice in a sandbox; both runs must produce the same
// bytes. This program does no network calls, reads no clock, and touches
// no file outside the repository and the output directory.
//
// Local equivalent of the grader's run:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const sourcePath = resolve(BOT_DIR, 'POST.json');
const targetPath = resolve(OUTPUT_DIR, 'POST.json');

const raw = readFileSync(sourcePath, 'utf8');
const parsed: unknown = JSON.parse(raw);

if (
  typeof parsed !== 'object' ||
  parsed === null ||
  Array.isArray(parsed) ||
  typeof (parsed as { url?: unknown }).url !== 'string'
) {
  console.error('POST.json must be a JSON object with a url field.');
  process.exit(1);
}

const postUrl = (parsed as { url: string }).url;
if (!/^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\//.test(postUrl)) {
  console.error('POST.json url must point at an X post.');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(targetPath, raw, 'utf8');
