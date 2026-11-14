---
name: use-ohm-ui
description: How to build interface in an ohm app with the ohm-ui design system - installing foundations and components, which component to reach for, the token and layout rules, and how to change something the library does not do. Use whenever you add or change UI in an app that uses ohm-ui, or set ohm-ui up in a new app.
---

# Building UI with ohm-ui

ohm-ui is the ohm design system. It works like shadcn/ui: components are copied into the app with the shadcn CLI and the app owns the copy. The source of truth is the `ohm-ui` repository (github.com/haeinej/ohm-ui, private). How ohm looks, and the reasons, are in its `DESIGN.md`.

## The rules

1. **Reach for a component before writing one.** Use the installed component, or install it from the registry. Hand-roll a control only when ohm-ui does not have it, and then propose adding it to ohm-ui.
2. **Choose a variant or a size; don't restyle.** `className` on a component is for layout: margin, width, grid placement, flex. Never for colour, type, radius, shadow or motion.
3. **App CSS is layout only:** grid, flex, gap, size, position. Every other value is a token: a Tailwind key (`bg-muted`, `text-muted-foreground`, `text-h2`, `rounded-card`, `h-control-md`) or `var(--ohm-*)`. No hex, `rgb()` or pixel font sizes.
4. **Edgeless.** No borders or divider lines. Separate with space, then tone (`bg-muted`), then shadow for floating layers.
5. **Green means something.** The filled primary button is for the one main action in a view. Never use green as decoration.
6. **Coconat is for `h1` and `h2` only.** Everything else is Helvetica Neue through the five text roles: `text-h1`, `text-h2`, `text-h3`, `text-body`, `text-small`.
7. **States:** loading and empty are blank or a `LoadingDot`; every error or message is a notice (`notify()`), not inline text; a full-screen task is a `PopupScreen`.
8. **Don't edit installed files in `components/ui`, `components/` (assistant parts), `lib/cn.ts` or `src/ohm/`.** They are copies. Make the change in ohm-ui, rebuild its registry, then update the app (below). An edit made only in the app is lost on the next update and splits the design system.
9. **Data stays outside components.** Components take props. Fetching, TanStack DB collections and stores belong to the app's own components, which pass data down.

## What to reach for

| Need | Use |
| --- | --- |
| Any button, icon button, text link styled as a button | `Button` (`variant`, `size`) |
| A form | `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, with `Input`, `Textarea`, `NativeSelect`, `Checkbox`, `Switch` |
| Confirm or a short task over the page | `Dialog` |
| A whole-screen task | `PopupScreen` and its parts (`screen`) |
| Actions on an item | `DropdownMenu` |
| A preview on hover | `HoverCard` |
| Feedback, errors, "saved" | `notify()` and `<Notices/>` once at the root (`notice`) |
| Progress | `Progress` (`value={null}` while unknown), `LoadingDot`, `LoadingBar` |
| Talking to an agent | `Thread` inside the app's `AssistantRuntimeProvider` |
| Showing an agent's tool calls in your words | `ToolDescriptions` around the thread |
| Agent text as Markdown | `MarkdownText` |

The registry lists every item with its description: `public/r/registry.json` in ohm-ui.

## Setting up an app

The app needs React 19, Tailwind 4 (`@tailwindcss/vite`), `tw-animate-css`, and an `@/` alias to its `src/`.

1. **Foundations** (tokens, font, brand assets). From an ohm-ui checkout:

   ```sh
   npm run foundations -- ../my-app          # copies into my-app/src/ohm
   ```

   Then make the app's Tailwind entry CSS:

   ```css
   @import "./ohm/ohm.css";
   @source "./";
   ```

2. **`components.json`** in the app, with the ohm registry:

   ```json
   {
     "$schema": "https://ui.shadcn.com/schema.json",
     "style": "base-nova",
     "rsc": false,
     "tsx": true,
     "tailwind": {"config": "", "css": "src/index.css", "baseColor": "neutral", "cssVariables": true, "prefix": ""},
     "iconLibrary": "lucide",
     "aliases": {"components": "@/components", "ui": "@/components/ui", "utils": "@/lib/cn", "lib": "@/lib", "hooks": "@/hooks"},
     "registries": {
       "@ohm": {
         "url": "https://raw.githubusercontent.com/haeinej/ohm-ui/main/public/r/{name}.json",
         "headers": {"Authorization": "Bearer ${GITHUB_TOKEN}"}
       }
     }
   }
   ```

   The repository is private, so the CLI needs `GITHUB_TOKEN` set (for example `GITHUB_TOKEN=$(gh auth token)`). Never write the token into a file. While working on ohm-ui itself, point `@ohm` at `http://localhost:5180/r/{name}.json` with ohm-ui's `npm run dev` running instead.

3. **Components:**

   ```sh
   npx shadcn add @ohm/button @ohm/field @ohm/thread
   ```

   Dependencies, both npm packages and other ohm items, come with them.

## Updating an app after ohm-ui changes

```sh
npm run foundations -- ../my-app                    # in ohm-ui, if foundations changed
npx shadcn add @ohm/<name> --overwrite              # in the app, for each changed item
```

Then run the app's typecheck and look at the screens that use it.

## Changing something ohm-ui does not do

1. Check whether a variant, size or prop already covers it.
2. If not, make the change in ohm-ui (its `AGENTS.md` says how), and ask the person before changing the shared design system for one app.
3. Update the app from the registry.
