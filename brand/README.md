# brand

Where the ohm cover look comes from and how its images are made. DESIGN.md ("Light") is the rule; this folder is the source material.

| Path | What |
| --- | --- |
| `references/` | The mood: images that set the direction. Not ours: kept on this machine only (git-ignored), never published |
| `prompts.json` | The prompts for the cover images. `style` is added to every prompt and carries the light tokens |
| `generated/` | What the image model made, one PNG per prompt id (git-ignored, large). Picked images are saved as JPEG in `public/covers/images/`, which Cover's `image` uses |

## Making images

```sh
npm run covers -- corridor figure     # one image per id, into brand/generated/
npm run covers -- --all
```

It reads `OPENAI_API_KEY` from `.env.local` (git-ignored) and uses the model in `prompts.json`. The image never carries text: titles, marks and dates are laid over it by `Cover` (`image` prop), so they stay sharp, in Coconat and Helvetica Neue, and editable.

## The references

Saved here:

- `01-backlit-glass-corridor.webp`: an office corridor of backlit frosted glass walls, pale green light.
- `02-curved-glass-atrium.png`: a curving wall of milky glass panels lit from behind, under a soft ceiling.
- `03-blurred-portrait-text-poster.webp`: a long text poster over a blurred portrait.
- `04-blur-field-event-poster.png`: small Swiss type over a soft blur of light.
- `09-split-blur-photo-poem-poster.webp`: a grainy blurred photograph above, paper below, small type crossing the seam (the `split` layout).
- `10-frosted-glass-cube-room.png`: a frosted glass cube glowing in an empty white room.
- `11-blurred-dot-sequence.png`: a sequence of blurred dots arcing across pale paper (the `trail` image).

Also shown during the design, not yet saved here (add the files when you have them):

- `05`: three exhibition posters of liquid, chrome-like light blooms in grey and white, with small type set across them.
- `06`: four gradient studies: soft orbs and horizons of violet-white light on dark brown, with grain.
- `07`: a teal, grainy, blurred figure in motion behind a column of bold type.
- A poster of blurred vertical light streaks with a small editorial type grid at its foot (the `poster` layout).
- `08`: a festival poster: an overexposed white face where only an eye and lips survive, tinted green.
