# ohm-ui

The ohm design system, in one place.

Until now ohm's look lived inside each app. ohm-1 had its tokens in `packages/ui` and its components in `app/src/ui`. agentic-twitter (`pr-agent`) had an older copy of both plus a Svelte design kit. ohm-content-layer's vault page carried a third copy of the tokens. Each copy could drift. ohm-ui holds the one version, and apps take it from here.

## How it works

It works like [shadcn/ui](https://ui.shadcn.com): components are not a package you import, but files the shadcn CLI copies into your app. The app owns the copy, so nothing is hidden, and the registry keeps every app's copy the same.

| Layer | What it is | How an app gets it |
| --- | --- | --- |
| Foundations | Colour, type, space, radius, motion, the Coconat font, the ohm dot | `npm run foundations -- <app>` copies them in |
| Components | Button, field, dialog, menu, notice, screens… on shadcn `base-nova` and Base UI | `npx shadcn add @ohm/<name>` |
| Assistant parts | A conversation with an agent on [assistant-ui](https://www.assistant-ui.com): thread, composer, tool activity, safe Markdown | `npx shadcn add @ohm/thread` |

React only: shadcn and assistant-ui are React libraries, and both apps are React. Data stays out of the library: TanStack DB and API calls belong to the apps.

## Look at it

```sh
npm install
npm run dev        # http://localhost:5180: every item, light and dark, and a working thread
```

## Use it in an app

Follow [skills/use-ohm-ui/SKILL.md](skills/use-ohm-ui/SKILL.md). It is also the rulebook for an agent working in that app, so copy it into the app's skills.

## Change it

1. Decide the look in [DESIGN.md](DESIGN.md) first.
2. Change `registry/ohm/`, and see it in the gallery.
3. `npm run check` and `npm run registry:build`, then commit.
4. Update each app with `npx shadcn add @ohm/<name> --overwrite`.

[AGENTS.md](AGENTS.md) has the exact rules and checks.

## Where it came from

| Part | Taken from |
| --- | --- |
| Tokens, shadcn mapping, atmosphere, motion, font, brand SVGs, DESIGN.md | ohm-1 `packages/ui` and `DESIGN.md`, which consolidated agentic-twitter's design kit |
| Components | ohm-1 `app/src/ui`, plus `progress` from agentic-twitter |
| Assistant parts | Written here, after ohm-1's publicist conversation, with the publicist and mail parts taken out |

Not migrated: agentic-twitter's Svelte design kit (its tokens already live on in `tokens.css`), and the apps' feature screens.
