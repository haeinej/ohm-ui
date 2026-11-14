// Brings upstream components into the registry, unchanged except for their import paths:
// shadcn/ui in the base-maia style (preset b1ZOMFeKW: Base UI, Maia, Lucide, subtle menu accent)
// and assistant-ui's chat and agent components. The ohm look is applied by the foundations
// (tokens, Tailwind scales, slot-level CSS), never by editing these files, so this can be re-run
// to update them.
//
//   node scripts/vendor.mjs              vendor everything in SHADCN and ASSISTANT_UI
//   node scripts/vendor.mjs --keep-temp  keep the scratch app for inspection
//
// It runs the real shadcn CLI in a temporary app configured like ohm-ui, so the style's install
// transforms apply, then copies the files in and records where each came from in
// registry/ohm/vendor.json, which scripts/registry.mjs reads.
import {execFileSync} from 'node:child_process';
import {cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {basename, join, relative} from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SHADCN_CLI = 'shadcn@4.23.0';

// Stock shadcn items. Pinned by name; their source is the base-maia style at the CLI version above.
export const SHADCN = [
  'accordion', 'avatar', 'badge', 'button', 'button-group', 'card', 'checkbox', 'collapsible', 'command', 'dialog',
  'dropdown-menu', 'empty', 'field', 'hover-card', 'input', 'input-group', 'item', 'kbd', 'label', 'native-select',
  'popover', 'progress', 'resizable', 'scroll-area', 'select', 'separator', 'sheet', 'sidebar', 'skeleton', 'switch',
  'tabs', 'textarea', 'toggle', 'toggle-group', 'tooltip',
];

// assistant-ui items: the runtime-bound chat parts, and the agent elements ohm uses.
export const ASSISTANT_UI = [
  'thread', 'thread-list', 'threadlist-sidebar', 'assistant-modal', 'assistant-sidebar', 'markdown-text', 'reasoning',
  'tool-group', 'tool-fallback', 'attachment', 'follow-up-suggestions', 'sources', 'model-selector', 'context-display',
  'elements-agent-plan', 'elements-approval-card', 'elements-tool-call', 'elements-thinking-indicator',
  'elements-option-list', 'elements-agent-status', 'elements-todo-list', 'elements-message-actions',
  'elements-suggestions', 'elements-error-state',
];

// Where assistant-ui ships its own (Radix) version of a stock component, ohm keeps the shadcn
// base-maia one. Files listed here are never taken from assistant-ui.
const STOCK_WINS = new Set(SHADCN.map(name => `${name}.tsx`));

const run = (command, args, cwd) => execFileSync(command, args, {cwd, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', env: {...process.env, CI: '1'}});

const temp = mkdtempSync(join(tmpdir(), 'ohm-ui-vendor-'));
console.log(`Scratch app: ${temp}`);
const write = (path, text) => { mkdirSync(join(temp, path, '..'), {recursive: true}); writeFileSync(join(temp, path), text); };
const ohmPackage = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
write('package.json', JSON.stringify({
  name: 'vendor', private: true, type: 'module',
  dependencies: {react: ohmPackage.dependencies.react, 'react-dom': ohmPackage.dependencies['react-dom']},
  devDependencies: {tailwindcss: ohmPackage.devDependencies.tailwindcss, typescript: ohmPackage.devDependencies.typescript},
}, null, 2));
write('tsconfig.json', JSON.stringify({compilerOptions: {baseUrl: '.', paths: {'@/*': ['./src/*']}, jsx: 'react-jsx'}}));
write('vite.config.ts', 'export default {}\n');
write('src/styles.css', '@import "tailwindcss";\n');
write('components.json', JSON.stringify({
  $schema: 'https://ui.shadcn.com/schema.json',
  style: 'base-maia', rsc: false, tsx: true,
  tailwind: {config: '', css: 'src/styles.css', baseColor: 'neutral', cssVariables: true, prefix: ''},
  iconLibrary: 'lucide', rtl: false,
  aliases: {components: '@/components', utils: '@/lib/utils', ui: '@/components/ui', lib: '@/lib', hooks: '@/hooks'},
  menuColor: 'default', menuAccent: 'subtle',
  registries: {'@assistant-ui': 'https://r.assistant-ui.com/{name}.json'},
}, null, 2));
run('npm', ['install', '--no-audit', '--no-fund'], temp);
console.log('Adding shadcn items…');
run('npx', ['-y', SHADCN_CLI, 'add', ...SHADCN, '--yes', '--overwrite'], temp);
// assistant-ui's own stock files would replace the base-maia ones; snapshot those first.
const stock = new Map(readdirSync(join(temp, 'src/components/ui')).map(file => [file, readFileSync(join(temp, 'src/components/ui', file), 'utf8')]));
console.log('Adding assistant-ui items…');
run('npx', ['-y', SHADCN_CLI, 'add', ...ASSISTANT_UI.map(name => `@assistant-ui/${name}`), '--yes', '--overwrite'], temp);
for (const [file, text] of stock) writeFileSync(join(temp, 'src/components/ui', file), text);

// ---- copy in, with imports pointed at the registry ----

const walk = folder => existsSync(folder) ? readdirSync(folder, {withFileTypes: true}).flatMap(entry =>
  entry.isDirectory() ? walk(join(folder, entry.name)) : [join(folder, entry.name)]) : [];

const placed = new Map(); // upstream path (from src/) -> registry path
// assistant-ui names runtime-bound files thing.aui.tsx beside a props-driven thing.tsx. The shadcn
// CLI's import rewrite stops at a dot, so ohm drops ".aui": the runtime-bound file takes the plain
// name (as upstream's item does) and a props-driven twin takes upstream's "elements-" prefix.
const sources = walk(join(temp, 'src')).map(full => relative(join(temp, 'src'), full))
  .filter(path => /\.(tsx?|css)$/.test(path) && path !== 'styles.css');
const auiNames = new Set(sources.filter(path => path.includes('.aui.')).map(path => basename(path).replace(/\.aui\.tsx?$/, '')));
const destination = path => {
  let file = basename(path);
  if (path.startsWith('components/ui/')) return `registry/ohm/ui/${file}`;
  if (path.startsWith('hooks/')) return `registry/ohm/hooks/${file}`;
  if (path.startsWith('lib/')) return null; // utils.ts: ohm's cn
  if (file.includes('.aui.')) file = file.replace('.aui.', '.');
  else if (auiNames.has(file.replace(/\.tsx?$/, ''))) file = `elements-${file}`;
  return `registry/ohm/assistant/${file}`;
};
for (const path of sources) {
  if (path.startsWith('components/ui/') && !SHADCN.includes(basename(path).replace(/\.tsx$/, '')) && STOCK_WINS.has(basename(path))) continue;
  const target = destination(path);
  if (!target) continue;
  for (const [other, already] of placed) if (already === target) throw new Error(`${path} and ${other} would both be ${target}`);
  placed.set(path, target);
}
const moduleOf = target => `@/${target.replace(/\.tsx?$/, '')}`;
const resolveFrom = (from, spec) => {
  // The CLI writes the utils import as a bare "cn" for this style; both mean ohm's cn.
  if (spec === '@/lib/utils' || spec === 'cn') return '@/registry/ohm/lib/cn';
  let path;
  if (spec.startsWith('@/')) path = spec.slice(2);
  else if (spec.startsWith('.')) path = join(from, '..', spec);
  else return spec;
  for (const candidate of [`${path}.tsx`, `${path}.ts`, `${path}/index.tsx`, `${path}/index.ts`, path]) {
    if (placed.has(candidate)) return moduleOf(placed.get(candidate));
  }
  // A stock component assistant-ui expects but ohm has under the same name.
  if (path.startsWith('components/ui/')) return `@/registry/ohm/ui/${basename(path)}`;
  throw new Error(`${from}: cannot place import ${spec}`);
};

// The few changes ohm makes to upstream source, each for a reason the foundations can't reach,
// because a utility class on the element outranks any rule a stylesheet could add.
const PATCHES = [
  // Press: a soft scale instead of a 1px drop, so a click feels smooth rather than mechanical.
  {why: 'smooth press', find: /active:([^\s"']*)translate-y-px/g, replace: 'active:$1scale-(--ohm-press-scale)'},
  // Backdrops dim without blurring: blur behind a dark dialog reads as smear.
  // assistant-ui is written against Radix; ohm's tooltip is Base UI, whose provider calls it delay.
  {why: 'Base UI tooltip', find: /<TooltipProvider delayDuration=/g, replace: '<TooltipProvider delay='},
  {why: 'still backdrop', find: /\s?supports-backdrop-filter:backdrop-blur-[a-z0-9]+/g, replace: ''},
];

const origins = {};
const patched = {};
for (const [path, target] of placed) {
  let text = readFileSync(join(temp, 'src', path), 'utf8');
  text = text.replace(/(from\s+|import\s*\(\s*|import\s+)(['"])([^'"]+)\2/g, (whole, lead, quote, spec) =>
    `${lead}${quote}${resolveFrom(path, spec)}${quote}`);
  // The CLI rewrites import paths but not re-exports: import each name under a private alias,
  // then export it under its own name, so nothing clashes with the file's other imports.
  text = text.replace(/^export (type )?\{([^}]*)\} from (['"])(@\/[^'"]+)\3;?$/gm, (whole, type = '', names, quote, spec) => {
    const pairs = names.split(',').map(part => part.trim()).filter(Boolean).map(part => {
      const [source, exported = source] = part.split(/\s+as\s+/);
      return {source, exported, alias: `__reexport_${exported}`};
    });
    return `import ${type}{ ${pairs.map(p => `${p.source} as ${p.alias}`).join(', ')} } from ${quote}${spec}${quote};\n`
      + `export ${type}{ ${pairs.map(p => `${p.alias} as ${p.exported}`).join(', ')} };`;
  });
  for (const patch of PATCHES) {
    const next = text.replace(patch.find, patch.replace);
    if (next !== text) (patched[target] ??= []).push(patch.why);
    text = next;
  }
  mkdirSync(join(ROOT, target, '..'), {recursive: true});
  writeFileSync(join(ROOT, target), text);
  origins[target] = path.startsWith('components/ui/') ? 'shadcn/base-maia' : 'assistant-ui';
}

// Upstream descriptions, so the registry and gallery say what upstream says.
const upstream = JSON.parse(execFileSync('curl', ['-fsSL', 'https://r.assistant-ui.com/registry.json'], {encoding: 'utf8'}));
const describedFiles = {};
for (const item of upstream.items) for (const file of item.files ?? []) {
  const target = placed.get(file.path.replace(/^(registry\/[^/]+\/)?/, '').replace(/^src\//, ''));
  // Upstream names only for assistant-ui's own files: some of its items also carry stock ui files.
  if (target?.startsWith('registry/ohm/assistant/') && item.type !== 'registry:page' && item.type !== 'registry:item') describedFiles[target] ??= {name: item.name, description: item.description};
}

const tempPackage = JSON.parse(readFileSync(join(temp, 'package.json'), 'utf8'));
writeFileSync(join(ROOT, 'registry/ohm/vendor.json'), `${JSON.stringify({
  note: 'Written by scripts/vendor.mjs. Do not edit; re-run the script.',
  shadcn: {cli: SHADCN_CLI, style: 'base-maia', items: SHADCN},
  assistantUi: {items: ASSISTANT_UI},
  dependencies: Object.fromEntries(Object.entries(tempPackage.dependencies).filter(([name]) => name !== 'cn')),
  patches: patched,
  files: Object.fromEntries(Object.entries(origins).sort().map(([target, origin]) => [target, {origin, ...describedFiles[target]}])),
}, null, 2)}\n`);

if (!process.argv.includes('--keep-temp')) rmSync(temp, {recursive: true, force: true});
console.log(`Vendored ${placed.size} files. Next: npm install anything new in vendor.json "dependencies", then npm run registry:build.`);
