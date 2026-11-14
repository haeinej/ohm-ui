// Writes registry.json from the files in registry/ohm, so an item's dependencies always match
// its imports. `npm run registry:build` runs this, then `shadcn build` into public/r.
//   node scripts/registry.mjs          write registry.json
//   node scripts/registry.mjs --check  exit 1 if registry.json is out of date
//
// One item per file, except vendored assistant-ui items that upstream ships as several files,
// which stay one item under upstream's name.
import {existsSync, readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {basename, join} from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const VENDOR = JSON.parse(readFileSync(join(ROOT, 'registry/ohm/vendor.json'), 'utf8'));

// ohm's own words for an item. Vendored assistant-ui items fall back to upstream's description
// (registry/ohm/vendor.json); everything else needs a line here.
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
  icon: 'One Lucide icon at an ohm size (xs, sm, md, lg, xl) and stroke; decorative unless given a label.',
  icons: 'The ohm icon set: Lucide icons chosen once per meaning (icons.help, icons.delete), in groups.',
  'file-tree': 'A folder tree for finding and opening things, with the side panel, view tabs and action toolbar around it. Keyboard: arrows, Home, End, Enter.',
  panel: 'A surface for a group of things, by material (solid, raised, muted, frost-thin, frost, frost-thick, tint), elevation (0–5) and size; with header, title, description, action, content, footer, group, label, item rows and separator.',
  accordion: 'Sections that open and close in place.',
  avatar: 'A person or account as a picture or initials; groups with a count.',
  badge: 'A short status or category label.',
  'button-group': 'Buttons joined into one control: segments, or a button with its menu.',
  card: "shadcn's card: header, title, description, action, content, footer.",
  collapsible: 'One region that opens and closes under a trigger.',
  empty: 'What a place shows when it has nothing yet, and the action that fills it.',
  'input-group': 'An input with icons, text, buttons or keys inside its edge.',
  item: 'A row of media, title, description and actions, for lists of things.',
  kbd: 'A key or key combination.',
  popover: 'A frosted surface anchored to a trigger, for small tasks.',
  'scroll-area': 'A scrolling region with quiet scrollbars.',
  select: 'A choice from a list, in a frosted popup.',
  sheet: 'A frosted panel that slides in from an edge.',
  sidebar: "An app's side navigation: collapsible, with groups, menus, badges and a mobile sheet.",
  skeleton: "The shape of content that is on its way. Inside lists and sidebars only; a page's loading state stays blank.",
  tabs: 'Views of one place, one at a time.',
  toggle: 'A button that stays on or off.',
  'toggle-group': 'A set of toggles where one or several are on.',
  tooltip: 'A short label on hover or focus. Needs TooltipProvider once at the root.',
  'use-mobile': 'Whether the viewport is phone-sized.',
  command: 'A searchable list of commands, in a popup or inline.',
  resizable: 'Panels the person can resize by dragging the handle between them.',
  'use-copy-to-clipboard': 'Copy text and hold a short copied state.',
  'use-attachment-src': 'A preview address for an image attachment.',
};

const FOLDERS = {lib: 'registry:lib', hooks: 'registry:hook', ui: 'registry:ui', assistant: 'registry:component'};
const files = Object.entries(FOLDERS).flatMap(([folder, type]) => {
  const dir = join(ROOT, 'registry/ohm', folder);
  return existsSync(dir) ? readdirSync(dir).filter(f => /\.tsx?$/.test(f)).sort().map(f => ({path: `registry/ohm/${folder}/${f}`, type})) : [];
});
const nameOf = path => VENDOR.files[path]?.name ?? basename(path).replace(/\.tsx?$/, '').replace(/\.aui$/, '');
const owner = new Map(files.map(file => [file.path.replace(/\.tsx?$/, ''), nameOf(file.path)]));
const packageOf = spec => spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];

const groups = new Map();
for (const file of files) {
  const name = nameOf(file.path);
  const group = groups.get(name) ?? {name, type: file.type, files: [], dependencies: new Set(), local: new Set()};
  group.files.push(file);
  const source = readFileSync(join(ROOT, file.path), 'utf8');
  for (const [, spec] of source.matchAll(/(?:from\s+|import\s*\(\s*|import\s+)['"]([^'"]+)['"]/g)) {
    if (spec.startsWith('@/registry/ohm/')) {
      const target = owner.get(spec.slice(2));
      if (!target) throw new Error(`${file.path} imports ${spec}, which is not in the registry`);
      if (target !== name) group.local.add(target);
    } else if (!spec.startsWith('.') && !['react', 'react-dom'].includes(packageOf(spec))) {
      group.dependencies.add(packageOf(spec));
    }
  }
  groups.set(name, group);
}

const items = [...groups.values()].map(group => {
  const description = DESCRIPTIONS[group.name] ?? VENDOR.files[group.files[0].path]?.description;
  if (!description) throw new Error(`registry/ohm: ${group.files[0].path} needs a line in DESCRIPTIONS in scripts/registry.mjs`);
  return {
    name: group.name,
    type: group.type,
    title: group.name.replace(/^elements-/, '').split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' '),
    description,
    ...(group.dependencies.size ? {dependencies: [...group.dependencies].sort()} : {}),
    registryDependencies: [...group.local].sort().map(dep => `@ohm/${dep}`),
    files: group.files.map(({path, type}) => ({path, type})),
  };
});

const registry = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: 'ohm',
  homepage: 'https://github.com/haeinej/ohm-ui',
  items,
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
