// The library's rules, checked. `npm run check` before every commit.
//   1. Components hold no raw colours: every colour is a token (Tailwind theme key or var(--ohm-*)).
//   2. Components import each other only through @/registry/ohm/..., the paths shadcn rewrites.
//   3. registry.json matches the files.
import {execFileSync} from 'node:child_process';
import {readFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const problems = [];
for (const folder of ['ui', 'assistant', 'lib']) {
  for (const file of readdirSync(join(ROOT, 'registry/ohm', folder))) {
    const path = `registry/ohm/${folder}/${file}`;
    const text = readFileSync(join(ROOT, path), 'utf8');
    for (const [line, at] of text.split('\n').map((line, at) => [line, at + 1])) {
      if (/#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\(/i.test(line)) problems.push(`${path}:${at} raw colour; use a token`);
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
