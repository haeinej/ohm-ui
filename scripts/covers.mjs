// Makes the cover images from brand/prompts.json with the OpenAI image API, one PNG per prompt id,
// into brand/generated/. The image never carries text; Cover lays the type over it.
//   npm run covers -- corridor figure
//   npm run covers -- --all
// Needs OPENAI_API_KEY, from the environment or .env.local (git-ignored).
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const envFile = join(ROOT, '.env.local');
if (!process.env.OPENAI_API_KEY && existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const match = line.match(/^\s*OPENAI_API_KEY\s*=\s*"?([^"\s]+)"?\s*$/);
    if (match) process.env.OPENAI_API_KEY = match[1];
  }
}
if (!process.env.OPENAI_API_KEY) { console.error('covers: set OPENAI_API_KEY in .env.local'); process.exit(1); }

const {model, style, prompts} = JSON.parse(readFileSync(join(ROOT, 'brand/prompts.json'), 'utf8'));
const args = process.argv.slice(2);
const chosen = args.includes('--all') ? prompts : prompts.filter(p => args.includes(p.id));
if (!chosen.length) { console.error(`covers: name prompt ids (${prompts.map(p => p.id).join(', ')}) or --all`); process.exit(1); }

const out = join(ROOT, 'brand/generated');
mkdirSync(out, {recursive: true});

async function make({id, size, prompt}, tries = 3) {
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({model, prompt: `${prompt}\n\n${style}`, size, quality: 'high', n: 1}),
    });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error?.message ?? `HTTP ${response.status}`);
    writeFileSync(join(out, `${id}.png`), Buffer.from(body.data[0].b64_json, 'base64'));
    console.log(`${id}: brand/generated/${id}.png`);
  } catch (error) {
    // A dropped connection is common on long generations: try again before giving up on this one.
    if (tries > 1) return make({id, size, prompt}, tries - 1);
    console.error(`${id}: ${error.message}`);
    process.exitCode = 1;
  }
}

await Promise.all(chosen.map(item => make(item)));
