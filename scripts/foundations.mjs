// Copies the foundations (tokens, shadcn mapping, atmosphere, motion, the Coconat font and the
// brand assets) into an app. Foundations are files, not a registry item, because the font is binary.
//   npm run foundations -- <app-folder> [subfolder, default src/ohm]
// Then, in the app's Tailwind entry CSS:  @import "./ohm/ohm.css";
// Re-run to update. Never edit the copy: change it here, then copy again.
import {cpSync, existsSync, rmSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join, resolve} from 'node:path';

const [app, folder = 'src/ohm'] = process.argv.slice(2);
if (!app || !existsSync(app)) {
  console.error('Usage: npm run foundations -- <app-folder> [subfolder, default src/ohm]');
  process.exit(1);
}
const from = fileURLToPath(new URL('../registry/ohm/foundations', import.meta.url));
const to = resolve(app, folder);
rmSync(to, {recursive: true, force: true});
cpSync(from, to, {recursive: true});
console.log(`Foundations copied to ${to}. Import ${join(folder, 'ohm.css')} from the app's Tailwind entry CSS.`);
