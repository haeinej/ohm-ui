# ohm design language

How ohm looks, and why. Every value lives in one file, `registry/ohm/foundations/tokens.css`; this page explains them. Change this page first, then the tokens, then anything that uses them.

ohm starts from shadcn/ui in the **Maia** style on Base UI (preset `b1ZOMFeKW`) and assistant-ui, and keeps its own type and colour. Upstream components are taken as they are; ohm's look reaches them through the foundations.

## Type

| Role | Family | Size / leading | Use |
| --- | --- | --- | --- |
| `h1` | Coconat 400 | clamp(32, 7cqi, 48) / 1.17 | Page titles |
| `h2` | Coconat 400 | 24 / 32 | Section titles |
| `h3` | Helvetica Neue 600 | 14 / 20 | Group labels |
| `body` | Helvetica Neue 400 (controls 500) | 14 / 20 | Text and controls |
| `small` | Helvetica Neue 400 | 12 / 16 | Metadata, hints |
| Inputs | Helvetica Neue | 16 / 24 | So phones don't zoom on focus |
| Code | System mono | | |

- **Coconat is rare:** `h1` and `h2` only, at weight 400. Panel, card and dialog titles are Helvetica Neue.
- `data-reading="chat"` or `"article"` on a container sets the same five roles one step larger, for long reading.

## Colour

Light by default. `data-theme="dark"` or `"system"` on `<html>`, or on any element, changes the scheme beneath it.

| Token | Light | Dark | Job |
| --- | --- | --- | --- |
| `--ohm-paper` | #fff | #000 | The page |
| `--ohm-menu` | #fafafa | #111 | Sidebar, menu wells |
| `--ohm-wash` | #f5f5f5 | #171717 | Hover, muted fill |
| `--ohm-line` | #e5e5e5 | #262626 | Hairlines, where a line is needed |
| `--ohm-muted` | #6b6b6b | #a1a1a1 | Secondary text |
| `--ohm-ink` | #242424 | #ededed | Text |
| `--ohm-forest` | #013220 | #013220 | The brand green: primary action, focus, the dot |
| `--ohm-green-light` | #7bd389 | #7bd389 | Live, done, positive |
| `--ohm-red` | #e5484d | #e5484d | Destructive, failed |
| `--ohm-ebony` | #250e0e | | The atmosphere only |

- **Two signal colours, the same in both schemes.** The light green and the red read identically on light and dark, so their meaning never shifts.
- **Forest is the primary action.** At most one filled primary action per view; never decoration.
- **No other hues.** Tailwind's palette names used by vendored components are folded onto these: red and rose are `--ohm-red`, emerald and green are `--ohm-green-light`, blue and amber are ink.

## Shape

Corners grow with the surface. Tailwind's `rounded-*` scale is mapped onto these, so shadcn components take them.

| Token | Size | Tailwind | Use |
| --- | --- | --- | --- |
| `--ohm-radius-chip` | 8 | `rounded-sm` | Chips, small marks |
| `--ohm-radius-item` | 12 | `rounded-md` | Menu items, rows |
| `--ohm-radius-row` | 14 | `rounded-lg` | List rows |
| `--ohm-radius-field` | 16 | `rounded-xl` | Fields |
| `--ohm-radius-card` | 24 | `rounded-2xl` | Cards, panels, menus |
| `--ohm-radius-sheet` | 28 | `rounded-3xl`, `rounded-4xl` | Sheets, dialogs, pill buttons |

## Depth

**Shade.** Five steps from one light source above. Each is a tight contact shadow and a soft ambient one, plus a 1px inset edge (`--ohm-edge`) so a surface reads on any background.

| Step | Utility | Tailwind | Use |
| --- | --- | --- | --- |
| 1 | `shade-1` | `shadow-xs` | Rows, chips |
| 2 | `shade-2` | `shadow-sm` | Cards |
| 3 | `shade-3` | `shadow-md`, `shadow-lg` | Floating controls |
| 4 | `shade-4` | `shadow-xl`, `shadow-2xl` | Menus, popovers, panels |
| 5 | `shade-5` | | Dialogs, windows |

**Frost.** Translucent fills over a blurred, saturated backdrop, each with a catch-light along its top edge (`--ohm-highlight`).

| Material | Utility | Blur |
| --- | --- | --- |
| Thin | `frost-thin` | 12px |
| Regular | `frost` | 24px |
| Thick | `frost-thick` | 40px |
| Tint | `frost-tint` | 24px, forest-tinted |

- Glass needs something behind it: toolbars over content, headers over a scrolling page, panels over imagery.
- **Floating surfaces** (menus, popovers, selects, hover cards, sheets) are frosted in light and **solid and still in dark** (`--ohm-popover`), because dark glass over dark content reads as murk.
- Without blur support, or with reduced transparency, glass turns solid.
- Backdrops behind dialogs and sheets dim; they never blur.

## Motion

| Token | Value | Use |
| --- | --- | --- |
| `--ohm-duration-press` | 130ms | Press |
| `--ohm-duration-state` | 180ms | Hover and state changes |
| `--ohm-duration-open` | 240ms | Opening |
| `--ohm-duration-close` | 160ms | Closing |
| `--ohm-ease-out` | cubic-bezier(.23, 1, .32, 1) | Most motion |
| `--ohm-press-scale` | .97 | How far a pressed control settles |

A press eases into a slight scale; nothing jumps. Reduced motion shortens every duration to nothing.

## Icons

Lucide, shadcn's set, at one stroke (2) with round caps and joins. Five sizes: `size-icon-xs` 14, `size-icon-sm` 16, `size-icon` 18, `size-icon-lg` 20, `size-icon-xl` 24. Each meaning has one picture, in `registry/ohm/lib/icons.ts`: reach for `icons.help`, `icons.delete`, `icons.community` before importing from Lucide.

## Rules

1. **One source.** Colour, size, radius, shadow, duration and font live in `tokens.css`. Components use tokens or the Tailwind keys mapped onto them.
2. **Theme, don't fork.** Upstream components stay as upstream wrote them; the look comes from the foundations. The few necessary changes are listed and applied by `scripts/vendor.mjs`.
3. **Separate with space, then tone, then shade.** Lines only where they group: menu separators, button groups, hairline edges on floating surfaces.
4. **States.** A page's loading state is blank or a `LoadingDot`; skeletons only inside lists. Errors and confirmations are notices. Empty places say what goes there and offer the action that fills them.
5. **Accessible.** WCAG AA contrast in both schemes, 44px touch targets on coarse pointers, a visible focus ring, reduced motion and transparency honoured.
