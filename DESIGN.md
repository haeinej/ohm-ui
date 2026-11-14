# ohm design system

The single reference for how ohm looks on the website, web app and mobile app. Tokens live in one file, `registry/ohm/foundations/tokens.css` in this repository (ohm-ui). React Native reads a generated `tokens.ts`, not built here yet. This document explains them and sets the rules.

**Origins**
- pr-agent's design kit ("Atelier" / Asset Kit: `design/src/lib/styles/tokens.css`, `web/src/theme.css`, `web/src/ui/ui.css`, `design/docs/*`).
- The live ohmmmm.com styles (`public/styles.css`).

**What changes from pr-agent**
- Fonts are now Coconat and Helvetica Neue.
- The tokens are consolidated into one source.

## 1. Type

### Families

| Role | Family | Stack | Notes |
| --- | --- | --- | --- |
| Accent | **Coconat** 400 | `'Coconat', Georgia, 'Times New Roman', serif` | Self-hosted woff2 (SIL OFL, from pr-agent). h1, h2 and the wordmark only. One weight, so never bold. |
| Everything else | **Helvetica Neue** | `'Helvetica Neue', Helvetica, Arial, sans-serif` | System font, **not self-hosted**: Helvetica Neue is commercially licensed. Present on Apple platforms; Windows and Android fall back to Helvetica/Arial. Matches the live website. |
| Code | System mono | `ui-monospace, SFMono-Regular, Menlo, monospace` | Replaces Geist Mono. |

Geist Sans and Geist Mono are retired.

### Five roles

pr-agent's hierarchy is kept unchanged: five roles, same sizes. Tracking is re-tuned for Helvetica Neue, which sets wider than Geist. The live website already uses tighter tracking (−0.018em to −0.055em).

| Role | Use | Family / weight | App (compact) | Reading context (`data-reading`: mail body, publicist chat) |
| --- | --- | --- | --- | --- |
| `h1` display | page titles, empty-state headline | Coconat 400 | clamp(32px, 6.96cqi, 48px) / 1.1667 / −0.03em | 24 / 32 / −0.02em |
| `h2` title | sheet and section titles, person name on card | Coconat 400 | 24 / 32 / −0.02em | 20 / 26 / −0.01em |
| `h3` section | group labels, sender name in a message | Helvetica Neue 600 | 14 / 20 / −0.02em | 16 / 24 / −0.02em |
| `body` | text and controls (controls 500) | Helvetica Neue 400 | 14 / 20 / −0.01em | 16 / 24 / −0.011em |
| `small` | metadata, timestamps, hints | Helvetica Neue 400 | 12 / 16 / 0 | 13 / 18 / 0 |

- Inputs are 16 / 24 so phones don't zoom on focus.

**Interface titles.** Two headings in the app chrome are not reading text and sit outside the five roles. They are Helvetica Neue 600, never Coconat, and never used inside content.

| Token | Use | Size / leading / tracking |
| --- | --- | --- |
| `--ohm-type-title-*` | panel titles: the Mail, Friends and Settings directory headings | 17 / 24 / −0.01em |
| `--ohm-type-page-title-*` | settings page headings | 20 / 28 / −0.01em |
| `--ohm-type-wordmark-*` | the "ohm" wordmark on the sign-in screen (Coconat 400) | 43.2 (38 on phones) / 1 / −0.065em |
- Tracking values marked for Helvetica Neue are a starting point; check them on screen in phase 0.

**Editorial context** (website, `data-reading="editorial"`). The website's page title (h1) is Coconat 400, clamp(40px, 6vw, 60px) / 1.05 / −0.02em. All other text is one size, 16 / 1.65 / −0.015em; section headings are weight 600 at that same size. The table below is the earlier scale, kept for the app's reading context:

| Element | Size / leading / tracking |
| --- | --- |
| headline | 40 / 1.15 / −0.055em, weight 500 |
| lede | 23 / 1.5 / −0.035em |
| section title | 17 / 1.5 / −0.025em, weight 600 |
| body | 17 / 1.75 / −0.018em |
| footer | 14 / 1.5 |

## 2. Color

### One green: forest

ohm has one green, forest #013220 (decided November 10, 2026: the brighter greens #1d6b3f, #2f7a52, #4fb178, #5fb383 and #7fd69b are gone). Forest fills things in both schemes. On black, forest can't be seen as a line, dot or letter, so in dark mode green text, marks and the focus ring turn ink instead of a lighter green.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--ohm-forest` | #013220 | #013220 | the green: brand atmosphere, website ink, the dot |
| `--ohm-ebony` | #250e0e | #250e0e | atmosphere pair to forest |
| `--ohm-accent` | #013220 | #013220 | small fills that carry text: unread count, avatars, friend badge |
| `--ohm-accent-fill` | #013220 | #013220 | primary button fill |
| `--ohm-accent-hover` | #00261a | #00261a | hover and pressed primary (one step darker) |
| `--ohm-on-accent` | #fff | #fff | text on a forest fill (13.6:1) |
| `--ohm-leaf` | #013220 | ink #ededed | green text: names, links, "thinking", copied checks |
| `--ohm-agent` | #013220 | ink #ededed | the publicist's dot |
| `--ohm-signal` | #013220 | ink #ededed | marks with no text: loading bar, live and unread dots, typing dots |
| `--ohm-on-signal` | #fff | #000 | text on a signal fill (the notification count) |
| `--ohm-selection` | forest 14% | forest 90% | text selection, focused message |
| `--ohm-bubble-self` | #ebefed | #013220 | your own messages in chat (forest 8% on white; forest in dark) |

In dark mode a primary button is forest on black: the white label carries it, and the fill is a quiet shape (1.3:1 against the page). That is a deliberate trade for one dark green; `npm run check:tokens` checks the label, not the fill, in dark.

### Neutrals

There is one set, used everywhere in the app. These are the values the app actually rendered (pr-agent's `.fatale-chat-theme`).

| Token | Light | Dark |
| --- | --- | --- |
| `--ohm-paper` | #fff | #000 |
| `--ohm-menu` | #fafafa | #111 |
| `--ohm-wash` | #f5f5f5 | #171717 |
| `--ohm-line` | #e5e5e5 | #262626 |
| `--ohm-muted` | #6b6b6b | #a1a1a1 |
| `--ohm-ink` | #242424 | #ededed |
| `--ohm-danger` | #a13535 | #e3aaa0 |
| `--ohm-focus` | #013220 | ink #ededed |

### Contrast (rule 12)

`npm run check:tokens` (`scripts/check-design-tokens.mjs`) computes every text/background and icon/background pairing the design uses, in both schemes, against WCAG AA: 4.5:1 for body text, 3:1 for large text and UI. The focus ring must reach 3:1 on every surface it can sit on: paper, menu, wash, float and your chat bubble. Controls never sit directly on the atmosphere; they sit on the sheet above it. Add a pairing to the script when a design adds one.

The first run (November 2026) found these failures. The values were changed as follows:

| Token | Was | Now | Why |
| --- | --- | --- | --- |
| `--ohm-muted` (light) | #737373 | #6b6b6b | Metadata on wash was 4.35:1 and on your chat bubble 4.08:1. It is now 4.89:1 and 4.59:1, and 5.33:1 on paper. Still a neutral grey, one step darker. |
| `--ohm-accent` (dark) | #1d6b3f | #2f7a52 | Checks, the typing dot and live marks were 2.90:1 on dark menu and 2.75:1 on dark wash. Dark now uses the primary-fill green, which is ≥3.44:1 on all three dark surfaces and 5.22:1 under white text. Light is unchanged. |
| `--ohm-accent-hover` (dark) | #185a35 | #2d724b | A hovered primary button was 2.18–2.55:1 against dark surfaces, and its fill is its only boundary (edgeless). It is now 3.09–3.62:1 and still darker than the fill. White text on it is 5.80:1. Light is unchanged. |
| `--ohm-focus` | #377252 | #3f8f62 | The ring was 2.37:1 on the dark chat bubble and 2.50:1 on forest (atmosphere screens). It is now a lighter step of the same green (hue 147°→146°). That gives ≥3.4:1 on every surface in both schemes: 3.95:1 on white, 5.32:1 on black, 3.60:1 on forest. |

The green values in this table were later replaced by forest only (see One green, above); the muted grey and touch-target fixes still stand.

The same run found `--ohm-height-xs`, `-sm` and `-md` (24, 32, 40) below the 44 px touch target. The fix is in §3: on coarse pointers these three heights rise to 44.

### Surfaces and states

These sit on the neutrals for one job each.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--ohm-panel` | #fff | #0b0b0b | the directory panel (Mail, Friends, Settings lists), lifted off the page by `--ohm-panel-shadow` |
| `--ohm-raised` | #fff | #191919 | opaque lifted layer: the detached publicist window and the composer it attaches to |
| `--ohm-paper-light` | #fff | #fff | stays white in both schemes: the HTML email frame (email is designed for white), picture backdrops, text on a photo scrim |
| `--ohm-danger-wash` | #fdecea | #3b1915 | fill of an error notice pill; its text is `--ohm-danger` |
| `--ohm-mark` | #4076b6 | #8bb6ee | bookmarks and drop guides in the publicist timeline (blue, because green means something) |
| `--ohm-mark-wash` | #e8f0fb | #192d45 | selected messages |
| `--ohm-glass` | white 42% | rgb(48 48 48) 38% | frosted fill of controls floating over content: header buttons, panel title pills, the phone nav capsule, glass bars |
| `--ohm-glass-strong` | white 78% | rgb(25 25 25) 68% | the composer and labels floating over text, denser so they stay legible |
| `--ohm-scrim` | black 45% | black 45% | darkens a photo under a count (the album's "+3") |

- **Editorial paper (website only):** `--ohm-paper-editorial` #fafaf9. The website uses one ink, `--ohm-forest` #013220 (13.6:1), for headlines, body and links; quiet text ("Last updated" dates) is forest at 70% on paper, #4c6e61 (5.4:1).
- **Dark mode** is one mechanism: `color-scheme` plus `light-dark()` on `:root`, switched by `html[data-theme="light|dark"]` (default: system).
- shadcn's semantic variables (`--background`, `--primary`, `--muted`…) are mapped onto these tokens once, in `registry/ohm/foundations/shadcn.css`.

## 3. Space, size, shape

| Scale | Values |
| --- | --- |
| Space | `--ohm-space-1…8`: 4, 8, 12, 16, 24, 32; page gutters 48, 64 |
| Control height | `xs` 24 (chips), `sm` 32 (tools), `md` 40 (default button, input, composer), `lg` 48 (primary, sign-in, sheet footers); touch target ≥ 44: on a coarse pointer (`@media (pointer: coarse)`, phones and tablets) `xs`, `sm` and `md` all rise to `--ohm-touch-min` 44, so every control is a 44 px target on touch while mouse and trackpad keep the compact sizes (≥ 24, WCAG 2.5.8) |
| Radius | `pill` 999 · `row` 14 · `field` 16 (inputs, composer) · `card` 24 · `panel` 24 · `sheet` 28 |
| Elevation | none on surfaces; `--ohm-popup-shadow` for menus, popovers and dragged rows; `--ohm-float` (frosted) for floating sheets; `--ohm-float-shadow` (and `-focus` while typing) under glass controls and the composer; `--ohm-panel-shadow` under the directory panel and the turn preview; `--ohm-window-shadow` under windows and sheets (publicist window, lookup, dialogs, `PopupScreen`) |
| Icons | Lucide, stroke 2.25, round caps and joins; 18 px in controls |
| Motion | press 130 ms · state 180 ms · open 240 ms · close 160 ms · expand 300 ms; `--ohm-ease-out` cubic-bezier(.23,1,.32,1), `--ohm-ease-morph` cubic-bezier(.32,.72,0,1); press scale .97; reduced motion respected |

## 4. Brand assets (dark green)

These carry over from pr-agent, renamed to ohm:

- **Dot.** `fatale-dot.svg` → `ohm-dot.svg`: a solid forest #013220 circle. It is the publicist's mark, the favicon basis and the app icon basis.
- **Atmosphere.** The forest→ebony radial light field (`grainient.css`, 18 s drift, .08 grain). Used on the website hero, onboarding and the sign-in screen only.
- **Textures.** `ink-wash.svg` and `paper-grain.svg`, for editorial surfaces only.
- **Icons.** PWA icons are regenerated from the dot. The website favicon is a full-bleed `--ohm-forest` circle (r 15 in a 32 box, no background); its apple-touch-icon is the same circle on editorial paper.

## 5. Ground rules

1. **One source.**
   - Every color, size, radius, duration and font lives in `registry/ohm/foundations/tokens.css`. Nothing else defines a hex value or a px font size.
   - `npm run check` enforces this for the registry: no raw colour in a component.
   - Exceptions: `atmosphere.css` (a brand asset beside the tokens) and third-party logos (`ProviderIcon.tsx`: Google and Microsoft brand colors).
   - pr-agent broke this rule: 48 hard-coded hex colors and 23 ad-hoc font sizes sat outside its theme files.
2. **One palette, one dark mode.** There are no per-feature palette scopes, and no second neutral set.
3. **Five text roles.** Use `text-h1 … text-small` or the semantic element. A reading context changes the scale through `data-reading`, never through per-component overrides.
4. **Components come from shadcn** (Base UI, `base-nova`) in `registry/ohm/ui`, installed with the shadcn CLI (see AGENTS.md). Don't hand-roll a control shadcn has. Pick a variant or size; don't restyle in feature CSS.
5. **Feature CSS is layout only:** grid, flex, gap, size, position. No color, type, radius, shadow or motion values.
6. **Edgeless.**
   - No borders, hairlines or divider lines on surfaces, rows, fields or menus.
   - Separate with space first, then tone (`--ohm-wash`), then shadow for floating layers.
   - The focus ring and invalid state are the only edges.
7. **Green means something.**
   - Forest is reserved for the primary action, the publicist, and live state. It is the only green; there is no lighter one.
   - At most one primary (filled) action per view.
   - Never use green as decoration.
8. **Coconat is rare:** h1, h2 and the wordmark only, at weight 400.
9. **States.**
   - Loading and empty states are blank (or a single `LoadingDot`).
   - Every error or message is a notice pill (`notice.tsx`), not inline text.
   - Full-screen tasks use `PopupScreen`.
10. **Names describe what something is now.**
    - No leftover feature names (`spaces-panel`, `fatale-*`, `hey-*`).
    - Classes generated into email HTML use the `ohm-mail-` prefix.
11. **Same tokens on every platform.** Web imports `tokens.css`. React Native imports the generated `tokens.ts`. Native adapts behavior (touch, scroll, blur), never values.
12. **Accessible by default.**
    - Contrast meets WCAG AA in both schemes.
    - Touch targets are at least 44 px.
    - The focus ring is always visible on keyboard focus.
    - Reduced motion is honored.
13. **Change order:** update DESIGN.md, then `tokens.css`, then the components. A new token needs a role here first.

## 6. pr-agent inconsistencies this replaces

- **Two neutral palettes.** `:root` used green-tinted greys (#697168, #e4e8e3); `.fatale-chat-theme` used neutral greys (#737373, #e5e5e5).
- **Three dark-mode mechanisms.** `[data-ui-tone=dark]`, `light-dark()` in the chat theme, and `@custom-variant dark` on `data-ui-theme`. There were three different focus colors (#377252, #b9d5c2, accent).
- **Tokens copied in three places** (`design/…/tokens.css`, `web/src/theme.css`, `site/public/assets/fatale.css`), plus the green hard-coded in `index.html` and the loading bar.
- **Docs that disagree.**
  - `design-decisions.md`: body 12.8/19.2, controls 48/44.
  - `typography.md` and the CSS: body 14/20, controls 24–48.
- **Radius out of system.** shadcn's `--radius` (0.625rem) ran beside the named radii.
- **Layout classes named after deleted features:** `spaces-panel`, `spaces-scroll`, `space-chat`.
