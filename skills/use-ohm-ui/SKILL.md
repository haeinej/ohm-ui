---
name: use-ohm-ui
description: How to build interface in an ohm app with the ohm-ui design system - installing foundations and components, which component to reach for (including assistant-ui chat and agent parts), the token and layout rules, and what to do when ohm-ui lacks something. Use whenever you add or change UI in an app that uses ohm-ui, or set ohm-ui up in a new app.
---

# Building UI with ohm-ui

ohm-ui is the ohm design system (github.com/haeinej/ohm-ui, private). Components are copied into the app with the shadcn CLI and the app owns the copy. They are shadcn's Base UI components in the Maia style, assistant-ui's chat and agent parts, and ohm's own panel, icons, notices and screens, all wearing ohm's foundations. How ohm looks, and why, is in its `DESIGN.md`.

## The rules

1. **Reach for a component before writing one:** the installed one, then the ohm registry. If ohm-ui has nothing, say so and propose adding it there; don't hand-roll a control in the app.
2. **Choose a variant, a size or a material; don't restyle.** `className` on a component is for layout: margin, width, grid placement, flex.
3. **App CSS is layout only.** Every colour, radius, shadow and duration is a token: `bg-muted`, `text-muted-foreground`, `bg-primary`, `text-destructive`, `bg-success`, `rounded-2xl`, `shadow-md`, `shade-3`, `frost`, or `var(--ohm-*)`. No hex, no Tailwind palette names (`bg-blue-500`), no pixel font sizes.
4. **Colour has meaning.** Forest is the one primary action per view. Light green (`success`) is live, done or positive. Red (`destructive`) destroys or failed. Nothing else is coloured.
5. **Coconat is for `h1` and `h2` only.** Everything else is Helvetica Neue in five roles: `text-h1`, `text-h2`, `text-h3`, `text-body`, `text-small`.
6. **Depth: space, then tone, then shade.** Lines only where they group. Frost only over content that can show through it.
7. **States:** a page's loading state is blank or a `LoadingDot`; errors and confirmations are `notify()`; empty places use `Empty`.
8. **Don't edit installed ohm files** (`components/ui`, the assistant parts, `lib/cn.ts`, `lib/icons.ts`, `src/ohm/`). They are copies. Change ohm-ui and update the app, or the change is lost and the system splits.
9. **Data stays outside components.** Components take props; fetching, TanStack DB collections and stores belong to the app's own components. Agent parts read from the app's assistant-ui runtime.

## What to reach for

| Need | Use |
| --- | --- |
| A button, icon button, split button | `Button`, `ButtonGroup` with a `DropdownMenu` |
| An icon | `Icon` with a meaning from `icons` (`icons.help`, `icons.delete`) |
| A group of settings, a nav list, a floating tool | `Panel` (`material`, `elevation`, `size`) with `PanelGroup`, `PanelLabel`, `PanelItem` |
| Finding and opening files, notes or sources | `FileTreePanel` with `FileTreeTabs`, `FileTreeToolbar` and `FileTree` |
| A thing in a list | `Item`; a standalone summary: `Card` |
| A form | `Field` with `Input`, `InputGroup`, `Textarea`, `Select`, `NativeSelect`, `Checkbox`, `Switch`, `ToggleGroup` |
| Actions on a thing | `DropdownMenu`; a search of actions: `Command` |
| A small task near its trigger | `Popover`; a label on hover: `Tooltip` (needs `TooltipProvider` at the root) |
| Confirm, or a short task over the page | `Dialog`; from an edge: `Sheet`; a whole-screen task: `PopupScreen` |
| App navigation | `Sidebar` |
| Views of one place | `Tabs`; sections that open: `Accordion`, `Collapsible` |
| Feedback | `notify()` with `<Notices/>` once at the root, `Progress`, `Empty`, `Badge` |
| A conversation with an agent | `Thread` inside the app's `AssistantRuntimeProvider`; history: `ThreadList`; floating: `AssistantModal`; beside a page: `AssistantSidebar` |
| What the agent is doing | `Reasoning`, `ToolGroup`, `ToolFallback`, `ThinkingIndicator`, `AgentStatus`, `AgentPlan`, `TodoList` |
| The agent needs a decision | `ApprovalCard`, `OptionList` |
| Model and context | `ModelSelector`, `ContextDisplay` |

The full list, with descriptions, is `public/r/registry.json` in ohm-ui.

## Setting up an app

The app needs React 19, Tailwind 4 (`@tailwindcss/vite`), `tw-animate-css`, `tw-shimmer`, and an `@/` alias to its `src/`. A new app can start from shadcn's TanStack Start template: `npx shadcn@latest init --preset b1ZOMFeKW --template start`, then replace its CSS with ohm's foundations (step 1).

1. **Foundations** (tokens, font, brand assets). From an ohm-ui checkout:

   ```sh
   npm run foundations -- ../my-app          # copies into my-app/src/ohm
   ```

   The app's Tailwind entry CSS is then only:

   ```css
   @import "./ohm/ohm.css";
   @source "./";
   ```

2. **`components.json`** with the Maia style and the ohm registry:

   ```json
   {
     "$schema": "https://ui.shadcn.com/schema.json",
     "style": "base-maia",
     "rsc": false,
     "tsx": true,
     "tailwind": {"config": "", "css": "src/styles.css", "baseColor": "neutral", "cssVariables": true, "prefix": ""},
     "iconLibrary": "lucide",
     "aliases": {"components": "@/components", "ui": "@/components/ui", "utils": "@/lib/cn", "lib": "@/lib", "hooks": "@/hooks"},
     "menuColor": "default",
     "menuAccent": "subtle",
     "registries": {
       "@ohm": {
         "url": "https://raw.githubusercontent.com/haeinej/ohm-ui/main/public/r/{name}.json",
         "headers": {"Authorization": "Bearer ${GITHUB_TOKEN}"}
       }
     }
   }
   ```

   The repository is private: run the CLI with `GITHUB_TOKEN=$(gh auth token)`. Never write the token into a file. While working on ohm-ui itself, point `@ohm` at `http://localhost:5180/r/{name}.json` with its `npm run dev` running.

3. **Components:**

   ```sh
   npx shadcn add @ohm/button @ohm/panel @ohm/thread
   ```

   Install ohm's copies, not `@assistant-ui/...` or plain `button`: they are the same components, already pointed at each other and at ohm's foundations.

## Updating an app after ohm-ui changes

```sh
npm run foundations -- ../my-app                    # in ohm-ui, if foundations changed
npx shadcn add @ohm/<name> --overwrite              # in the app, for each changed item
```

Then typecheck the app and look at the screens that use it, in light and dark.

## When ohm-ui does not have it

1. Check variants, props and composition of what exists.
2. Look in [shadcn's directory](https://ui.shadcn.com/docs/directory): a registry may have it (assistant-ui for agent interface).
3. Ask the person before adding to the shared design system for one app. Then add it in ohm-ui (its `AGENTS.md` says how, usually by vendoring) and install it from `@ohm`.
