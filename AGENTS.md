# For coding agents

ohm-ui is the ohm design system: foundations, components and agent interface parts, distributed the way shadcn/ui is. Apps copy components in with the shadcn CLI and own the copy; this repository is where every change starts.

- **Working in this repository:** this file.
- **Using ohm-ui in an app:** [skills/use-ohm-ui/SKILL.md](skills/use-ohm-ui/SKILL.md). Copy that skill into the app.
- **How ohm looks, and why:** [DESIGN.md](DESIGN.md). It outranks this file on any visual question.

## What it is built from

| Source | What | How it arrives |
| --- | --- | --- |
| shadcn/ui, preset `b1ZOMFeKW` | Base UI components in the **Maia** style, Lucide icons, subtle menu accent | `scripts/vendor.mjs` |
| assistant-ui ([assistant-ui.com](https://www.assistant-ui.com), `@assistant-ui` in shadcn's directory) | Thread, composer, thread list, modal, sidebar, reasoning, tools, attachments, sources, model selector, context display, and agent elements: plan, approval, tool call, thinking, option list, status, todo list | `scripts/vendor.mjs` |
| ohm | Foundations (Coconat and Helvetica Neue, ohm colour, shade, frost, motion), `panel`, `icon`, `icons`, `notice`, `screen` | Written here |
| [shadcn's directory](https://ui.shadcn.com/docs/directory) | Hundreds of community registries | Consulted when something is missing (below) |

The preset's font (Inter) and colours are not used: ohm keeps its own type and colour.

## Layout

| Path | What it is | Edited by hand |
| --- | --- | --- |
| `registry/ohm/foundations/` | `tokens.css` (the only place a raw value lives), `shadcn.css` (shadcn's variables, Tailwind's radius, shadow and palette scales mapped onto ohm, depth utilities, slot-level styles), `atmosphere.css`, `motion.css`, `ohm.css` (the one import), the Coconat font, brand SVGs | Yes. Tokens follow DESIGN.md |
| `registry/ohm/ui/` | Controls. Vendored shadcn files plus ohm's `panel`, `icon`, `notice`, `screen` | Only ohm's own files |
| `registry/ohm/assistant/` | Vendored assistant-ui files, flattened, upstream names kept | No |
| `registry/ohm/lib/`, `registry/ohm/hooks/` | `cn`, the icon set, hooks | `cn.ts` and `icons.ts` only |
| `registry/ohm/vendor.json` | Where every vendored file came from, its upstream name and description, the patches applied, upstream's dependencies | No. `scripts/vendor.mjs` writes it |
| `registry.json`, `public/r/` | The registry manifest and the built registry | No. `npm run registry:build` writes both. Commit them |
| `src/` | The gallery: a TanStack Start app (shadcn's `start` template), one route per page | Yes |
| `scripts/` | `vendor.mjs`, `registry.mjs`, `check.mjs`, `foundations.mjs` | Yes |

## Contracts

1. **Theme, don't fork.** Vendored files stay as upstream wrote them, except import paths and the patches listed in `PATCHES` in `scripts/vendor.mjs`. Change the look through tokens, the scales mapped in `shadcn.css`, or slot-level rules there (`[data-slot=…]`, zero specificity). Add a patch only when a utility class on the element leaves no other way, and say why in its `why`.
2. **Imports between registry files use `@/registry/ohm/...`.** The CLI rewrites those paths on install. `npm run check` refuses relative imports and anything else under `@/`.
3. **No raw values in ohm's own components.** Colour comes from tokens or mapped keys (`bg-primary`, `text-destructive`, `bg-success`, `shadow-md`, `rounded-2xl`); `npm run check` refuses hex, `rgb()`, `oklch()` and Tailwind palette names in non-vendored files.
4. **Components take props and never fetch.** No TanStack DB, API calls or app stores in the registry. Assistant parts read only from the assistant-ui runtime the app provides.
5. **Every item is a registry item.** `scripts/registry.mjs` makes one per file (vendored multi-file items stay one, under upstream's name), with dependencies read from imports. A new ohm file needs a line in its `DESCRIPTIONS`.
6. **Every item a person uses directly has a gallery page** in `src/pages.tsx`.
7. **Change order:** DESIGN.md, then `tokens.css`, then components.
8. **Names say what something is.** No app or feature names in the registry.

## When something is missing

1. Check whether a variant, a prop or composition of existing items covers it.
2. Look in shadcn's own registry (`npx shadcn view <name>`), then assistant-ui's (`r.assistant-ui.com/registry.json`) for agent interface.
3. Search [shadcn's directory](https://ui.shadcn.com/docs/directory) (its index is `https://ui.shadcn.com/r/registries.json`) for a registry that has it. Prefer registries built on Base UI and Tailwind 4 with healthy status.
4. Vendor it: add the item to `SHADCN` or `ASSISTANT_UI` in `scripts/vendor.mjs` (or add a list for the new registry there, and its namespace to the scratch app's `registries`), run it, and check its look in the gallery in light and dark. If its colours don't come through tokens, fix that in the foundations.
5. Write it in ohm only when no registry has it.

## Commands

```sh
npm run dev               # the gallery, http://localhost:5180
npm run typecheck
npm run check             # the contracts above
npm run vendor            # re-take shadcn and assistant-ui, then npm install anything new
npm run registry:build    # registry.json and public/r
npm run build
```

npm is used here because pnpm is not installed on this machine; `pnpm dlx` and `npx` run the same CLI.

## Before committing

Typecheck, check, rebuild the registry, and look at every page you touched in light and dark. Commit source, `vendor.json`, `registry.json` and `public/r/` together.

## Not here yet

- React Native tokens.
- Gallery pages for the agent elements beyond the thread.
