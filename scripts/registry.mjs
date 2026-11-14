// Writes registry.json from the files in registry/ohm, so an item's dependencies always match
// its imports. `npm run registry:build` runs this, then `shadcn build` into public/r.
//   node scripts/registry.mjs          write registry.json
//   node scripts/registry.mjs --check  exit 1 if registry.json is out of date
import {readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {basename, join} from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const NPM = ['@base-ui/react', '@assistant-ui/react-markdown', '@assistant-ui/react', 'class-variance-authority', 'lucide-react', 'remark-gfm', 'clsx', 'tailwind-merge'];

// One line each: what the item is for. A new file needs a line here.
const DESCRIPTIONS = {
  cn: 'Joins class names; later Tailwind utilities win. Knows the ohm text, radius and control-height keys.',
  button: 'The one button. Variants: default, secondary, outline, ghost, destructive, link. Sizes: xs, sm, default, lg, icon, icon-xs, icon-sm, icon-lg.',
  checkbox: 'A checkbox on Base UI.',
  dialog: 'A modal dialog with header, footer, title and description.',
  'dropdown-menu': 'A menu opened from a trigger: items, checkbox and radio items, groups, separators, shortcuts.',
  field: 'Form layout: a field with label, description and error, and sets and groups of fields.',
  'hover-card': 'A preview card opened on hover or focus.',
  input: 'A single-line text input.',
  label: 'A label for a control.',
  'native-select': 'The platform select, styled.',
  notice: 'Transient notices at the top of the screen: notify(), Notices, and busy and error helpers.',
  progress: 'A progress bar; value={null} is indeterminate.',
  screen: 'Whole-screen states: loading, status, popup screens, the brand atmosphere.',
  separator: 'A horizontal or vertical rule.',
  switch: 'An on/off switch.',
  textarea: 'A multi-line text input.',
  'markdown-text': 'An assistant message as safe Markdown: GitHub tables and lists, images become links.',
  'tool-activity': "An agent's tool calls folded into one line that opens to each step. Wording comes from ToolDescriptions.",
  thread: 'A whole conversation: messages, tool activity, composer with send and stop. Bring your own assistant-ui runtime.',
};

const item = (name, type, path) => {
  const source = readFileSync(join(ROOT, path), 'utf8');
  const imports = [...source.matchAll(/from ['"]([^'"]+)['"]/g)].map(found => found[1]);
  const dependencies = NPM.filter(dep => imports.some(i => i === dep || i.startsWith(`${dep}/`)));
  const local = [...new Set(imports.filter(i => i.startsWith('@/registry/ohm/')).map(i => basename(i)))];
  if (!DESCRIPTIONS[name]) throw new Error(`registry/ohm: ${path} needs a line in DESCRIPTIONS in scripts/registry.mjs`);
  return {
    name,
    type,
    title: name.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' '),
    description: DESCRIPTIONS[name],
    ...(dependencies.length ? {dependencies} : {}),
    registryDependencies: [...new Set(name === 'cn' ? [] : ['@ohm/cn', ...local.map(dep => `@ohm/${dep}`)])],
    files: [{path, type}],
  };
};

const files = folder => readdirSync(join(ROOT, 'registry/ohm', folder)).filter(f => f.endsWith('.tsx')).sort();
const registry = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: 'ohm',
  homepage: 'https://github.com/haeinej/ohm-ui',
  items: [
    item('cn', 'registry:lib', 'registry/ohm/lib/cn.ts'),
    ...files('ui').map(f => item(basename(f, '.tsx'), 'registry:ui', `registry/ohm/ui/${f}`)),
    ...files('assistant').map(f => item(basename(f, '.tsx'), 'registry:component', `registry/ohm/assistant/${f}`)),
  ],
};

const text = `${JSON.stringify(registry, null, 2)}\n`;
const target = join(ROOT, 'registry.json');
if (process.argv.includes('--check')) {
  let current = '';
  try { current = readFileSync(target, 'utf8'); } catch {}
  if (current !== text) { console.error('registry.json is out of date: run npm run registry:build'); process.exit(1); }
} else {
  writeFileSync(target, text);
  console.log(`registry.json: ${registry.items.length} items`);
}
