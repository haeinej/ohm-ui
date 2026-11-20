import * as React from "react"
import { cn } from "@/registry/ohm/lib/cn"

/**
 * The ohm cover: an overexposed photograph taken through frosted glass, fading toward soft drawn
 * light. The signature thumbnail for posts, share cards and posters; never interface. Its look
 * lives in the foundations (light.css); everything scales with the cover's width.
 *
 *   <Cover image="/covers/images/veil.jpg" title="Where is your home address on the internet?"
 *     subtitle="Why we need personal data servers…" date="20 · 11 · 26" number="001" />
 *
 * It says five things and no more: mark (default "ohm"), number, title, subtitle, date.
 * layout: title (one large Coconat title), poster (everything on one line at the foot), split (the
 *   picture above, paper below).
 * image: a photograph made from brand/prompts.json (no text in it). fade (0–1, default .4) washes
 *   it toward the drawn light; focus moves the crop, as object-position.
 * seed: places the soft light (over a photograph, or alone without one); the same seed always draws
 *   the same light. figure: without a photograph, show a person (true), never (false), or leave it to
 *   the seed (about one in three).
 * tone: day (near-white, forest type) or dusk. ratio: wide (1200 × 630), square, portrait (4:5), story (9:16).
 */
type CoverProps = Omit<React.ComponentProps<"div">, "title"> & {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  date?: React.ReactNode
  number?: React.ReactNode
  mark?: React.ReactNode
  seed?: number
  figure?: boolean
  tone?: "day" | "dusk"
  ratio?: "wide" | "square" | "portrait" | "story"
  image?: string
  focus?: string
  fade?: number
  layout?: "title" | "poster" | "split"
}

/** A small, stable random sequence from a seed (mulberry32). */
function random(seed: number) {
  let state = (seed * 2654435761) >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Form = { kind: "light" | "shade"; x: number; y: number; w: number; r: number; turn: number; blur: number; strength: number }

function light(seed: number) {
  const next = random(seed)
  const between = (low: number, high: number) => low + next() * (high - low)
  const angle = between(140, 220)
  const forms: Form[] = []
  const count = 4 + Math.floor(next() * 3)
  for (let i = 0; i < count; i++) {
    const shade = i % 2 === 1 || next() < .25
    forms.push({
      kind: shade ? "shade" : "light",
      x: between(-5, 105),
      y: between(-5, 105),
      w: between(28, 80),
      r: between(.35, 1.8),
      turn: between(-35, 35),
      blur: between(3, 7),
      strength: shade ? between(.35, .65) : between(.6, .95),
    })
  }
  const person = next() < .34
  const figure = {
    x: between(58, 84), h: between(80, 118), drop: between(4, 26), blur: between(1.6, 3), strength: between(.4, .62),
    turn: between(-8, 8), flip: next() < .5 ? -1 : 1, fade: between(0, 360),
  }
  return { angle, forms, person, figure }
}

const vars = (values: Record<string, string>) => values as React.CSSProperties

function Cover({
  title, subtitle, date, number, mark = "ohm", seed = 1, figure, tone = "day", ratio = "wide", image, focus, fade = .4, layout = "title",
  className, style, children, ...props
}: CoverProps) {
  const field = React.useMemo(() => light(seed), [seed])
  const person = figure ?? field.person
  return (
    <div
      data-slot="cover"
      data-tone={tone}
      data-ratio={ratio}
      data-layout={layout}
      className={cn("ohm-cover", className)}
      style={{ ...vars({ "--cover-angle": `${field.angle}deg`, "--fade": `${fade}` }), ...style }}
      {...props}
    >
      <div className="ohm-cover-field" data-image={image ? "" : undefined} aria-hidden="true">
        {image && <img className="ohm-cover-image" src={image} alt="" style={focus ? { objectPosition: focus } : undefined} />}
        {image && <span className="ohm-cover-veil" />}
        {field.forms.filter(form => !image || form.kind === "light").map((form, i) => (
          <span key={i} className="ohm-cover-form" data-kind={form.kind} style={vars({
            "--x": `${form.x}%`, "--y": `${form.y}%`, "--w": `${form.w}cqw`, "--r": `${form.r}`,
            "--turn": `${form.turn}deg`, "--blur": `${form.blur}cqw`, "--strength": `${form.strength}`,
          })} />
        ))}
        {!image && person && (
          <span className="ohm-cover-figure" style={vars({
            "--x": `${field.figure.x}%`, "--h": `${field.figure.h}%`, "--drop": `${field.figure.drop}%`,
            "--blur": `${field.figure.blur}cqw`, "--strength": `${field.figure.strength}`,
            "--turn": `${field.figure.turn}deg`, "--flip": `${field.figure.flip}`, "--fade": `${field.figure.fade}deg`,
          })}>
            <svg viewBox="0 0 200 400" fill="currentColor">
              <path d="M96 16c30 2 44 28 41 58-3 26-17 42-28 48l3 18c40 6 70 30 78 74l12 186H0l6-178c6-46 34-72 72-80l2-18c-12-8-24-26-25-50-1-32 12-60 41-58Z" />
            </svg>
          </span>
        )}
        <span className="ohm-cover-grain" />
      </div>
      <div className="ohm-cover-text">
        {mark && <p className="ohm-cover-mark">{mark}</p>}
        {number && <p className="ohm-cover-number">{number}</p>}
        {title && <h2 className="ohm-cover-title">{title}</h2>}
        {subtitle && <p className="ohm-cover-subtitle">{subtitle}</p>}
        {date && <p className="ohm-cover-date">{date}</p>}
        {children}
      </div>
    </div>
  )
}

export { Cover, type CoverProps }
