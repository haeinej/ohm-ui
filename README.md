# ohm design system

How ohm looks, as components any ohm app can install.

Live at [design.ohmmmm.com](https://design.ohmmmm.com). It is built the way [shadcn/ui](https://ui.shadcn.com) is. Components are not a package you import; the shadcn CLI copies them into your app, so nothing is hidden and every app's copy comes from the same place.

## What is in it

| Layer | What it is |
| --- | --- |
| Foundations | Coconat and Helvetica Neue, ohm's colour with one forest green, a light green and a red, five steps of shade, frost glass, motion, icons. Light by default, with a still, solid dark mode |
| Components | shadcn's Base UI components in the Maia style (preset `b1ZOMFeKW`), plus ohm's panel, icon set, notices and screens |
| Agent interface | [assistant-ui](https://www.assistant-ui.com): a thread and composer, thread list, assistant modal and sidebar, reasoning, tool calls, attachments, sources, model selector, and agent elements such as plans, approvals and status |

Upstream components arrive unchanged; ohm's look reaches them through the foundations. So they can be updated from upstream without losing anything.

## Look at it

```sh
npm install
npm run dev        # http://localhost:5180
```

The gallery is a TanStack Start app, one page per part, in light and dark.

## Use it in an app

Follow [skills/use-ohm-ui/SKILL.md](skills/use-ohm-ui/SKILL.md). It is also the rulebook for an agent working in that app, so copy it into the app's skills.

## Change it

1. Decide the look in [DESIGN.md](DESIGN.md).
2. Change the foundations or ohm's own components, and see it in the gallery.
3. `npm run check` and `npm run registry:build`, then commit.
4. In each app, `npx shadcn add @ohm/<name> --overwrite`.

To take newer shadcn or assistant-ui components, run `npm run vendor`. When something is missing, look in [shadcn's directory](https://ui.shadcn.com/docs/directory) before writing it. [AGENTS.md](AGENTS.md) has the exact rules.

## Licence notices

ohm-ui includes source from shadcn/ui and assistant-ui (MIT), Lucide icons (ISC) and the Coconat typeface (OFL). See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Search and link previews

Every gallery page is prerendered with its own title, description and canonical URL by `src/seo.ts` and the route head functions. `scripts/seo.mjs` checks the generated HTML and writes the sitemap from its canonical URLs. `public/robots.txt` advertises it. The shared 1200 × 630 PNG is `/og-design-v1.png`; version the filename when replacing the artwork. The `/overview` alias redirects to `/`; unknown pages return 404 and noindex. `scripts/worker.mjs` redirects public HTTP requests to HTTPS before serving ASSETS.

`npm run deploy:check` validates the build and Cloudflare configuration; `npm run deploy` publishes it. Check the actual HTML and image after deployment: link-preview services cache independently, and a successful deploy does not guarantee immediate search indexing.
