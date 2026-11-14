// The library's rules, checked. `npm run check` before every commit.
//   1. Components hold no raw colours and no Tailwind palette colours: every colour is a token.
//   2. Components import each other only through @/registry/ohm/..., the paths shadcn rewrites.
//   3. registry.json matches the files.
import {execFileSync} from 'node:child_process';
import {readFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const problems = [];
// Vendored files are upstream's; their palette names are folded onto ohm in shadcn.css.
const vendored = new Set(Object.keys(JSON.parse(readFileSync(join(ROOT, 'registry/ohm/vendor.json'), 'utf8')).files));
for (const folder of ['ui', 'assistant', 'lib', 'hooks']) {
  for (const file of readdirSync(join(ROOT, 'registry/ohm', folder))) {
    const path = `registry/ohm/${folder}/${file}`;
    const text = readFileSync(join(ROOT, path), 'utf8');
    for (const [line, at] of text.split('\n').map((line, at) => [line, at + 1])) {
      if (/#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\(/i.test(line)) problems.push(`${path}:${at} raw colour; use a token`);
      if (!vendored.has(path) && /\b(bg|text|fill|stroke|ring|border|outline|from|to|via)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)\b/.test(line)) problems.push(`${path}:${at} Tailwind palette colour; use a token`);
      if (/^export .*\bfrom ['"]@\//.test(line)) problems.push(`${path}:${at} re-export from a registry path: the CLI does not rewrite these; import, then export`);
      if (/from ['"](\.\.?\/|@\/(?!registry\/ohm\/))/.test(line)) problems.push(`${path}:${at} import through @/registry/ohm/...`);
    }
  }
}
try {
  execFileSync('node', [join(ROOT, 'scripts/registry.mjs'), '--check'], {stdio: 'pipe'});
} catch (failure) {
  problems.push(String(failure.stderr).trim());
}
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('ohm-ui: rules hold');
