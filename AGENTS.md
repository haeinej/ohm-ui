# For coding agents

ohm-ui is the ohm design system: foundations, components and assistant parts, distributed the way shadcn/ui is. Apps copy components in with the shadcn CLI and own the copy; this repository is where every change starts.

- **Working in this repository:** this file.
- **Using ohm-ui in an app** (ohm-1, agentic-twitter, ohm-content-layer or a new one): [skills/use-ohm-ui/SKILL.md](skills/use-ohm-ui/SKILL.md). Copy that skill into the app.
- **How ohm looks, and why:** [DESIGN.md](DESIGN.md). It outranks this file on any visual question.

## Layout

| Path | What it is | Edited by hand |
| --- | --- | --- |
| `registry/ohm/foundations/` | `tokens.css` (the only place a raw value lives), `shadcn.css` (shadcn's variables mapped onto tokens, base element roles, scoped preflight), `atmosphere.css`, `motion.css`, `ohm.css` (the one import), the Coconat font, brand SVGs | Yes. Tokens follow DESIGN.md |
| `registry/ohm/lib/cn.ts` | Class joining, aware of the ohm theme keys | Yes |
| `registry/ohm/ui/` | Controls: shadcn `base-nova` on Base UI, restyled through tokens | Yes |
| `registry/ohm/assistant/` | Chat parts on assistant-ui primitives | Yes |
| `registry.json` | The registry manifest | No. `scripts/registry.mjs` writes it from the files |
| `public/r/` | The built registry the shadcn CLI installs from | No. `npm run registry:build` writes it. Commit it |
| `src/` | The gallery: every item rendered from source | Yes |
| `scripts/` | `registry.mjs`, `foundations.mjs` (copies foundations into an app), `check.mjs` (the rules below) | Yes |

## Contracts

1. **Imports between registry files use `@/registry/ohm/...`.** The CLI rewrites those paths to the app's aliases on install. A relative import, or `@/` to anywhere else, breaks the installed copy. `npm run check` refuses it.
2. **No raw values in a component.** Colour, type, radius, shadow and motion come from tokens: a Tailwind theme key (`bg-primary`, `text-h2`, `rounded-card`, `h-control-md`) or `var(--ohm-*)` (`shadow-(--ohm-float-shadow)`). `npm run check` refuses hex, `rgb()`, `hsl()` and `oklch()` outside `foundations/`.
3. **Edgeless.** No borders or hairlines on surfaces, rows, fields or menus. Separate with space, then tone (`bg-muted`), then shadow. Focus and invalid states are the only edges (DESIGN.md §5.6).
4. **Components take props and never fetch.** No TanStack DB, no API calls, no app stores inside the registry. The assistant parts read only from the assistant-ui runtime the app provides.
5. **Every item is a registry item.** A new `.tsx` in `ui/` or `assistant/` needs a one-line description in `DESCRIPTIONS` in `scripts/registry.mjs`; dependencies are worked out from its imports. Add npm packages a component may import to `NPM` there.
6. **Every item is in the gallery.** Add a section to `src/App.tsx` showing its variants.
7. **Change order:** DESIGN.md, then `tokens.css`, then components. A new token needs a role in DESIGN.md first.
8. **Names say what something is.** No app or feature names (`publicist`, `fatale`, `hey`, `mail`) in the registry. Wording an app needs comes in through props or context, as `ToolDescriptions` does.

## Adding or changing a component

1. Start from shadcn's `base-nova` version when one exists (`npx shadcn add <name>` in a scratch app, or ui.shadcn.com), so the API stays shadcn's.
2. Put it in `registry/ohm/ui/` (a control) or `registry/ohm/assistant/` (a chat part). Rewrite its imports to `@/registry/ohm/...`. Replace its colours, radii and type with tokens.
3. Add its description in `scripts/registry.mjs` and a section in `src/App.tsx`.
4. Verify, in this order:

```sh
npm run typecheck
npm run check
npm run registry:build
npm run dev            # http://localhost:5180: look at the new section in light and dark
```

5. Commit the source, `registry.json` and `public/r/` together.

## Not here yet

- React Native: DESIGN.md names a generated `tokens.ts`. It is not generated in this repository yet.
- Components shadcn has that no app has needed: add them when one does, not before.
