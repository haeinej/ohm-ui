"use client"

import * as React from "react"
import { cn } from "@/registry/ohm/lib/cn"

/**
 * The ohm wave: the slow, flowing field of greens from ohmmmm.com's opening section, drawn with
 * WebGL. Here it fills its box in full, in a stronger green, so it can sit behind glass, a hero or
 * a card. It bends gently toward the pointer, animates only while on screen, draws one still frame
 * with reduced motion, and without WebGL falls back to a still forest field.
 *
 *   <div className="relative h-80 overflow-hidden rounded-3xl"><Wave /> …content… </div>
 *
 * `strength` (0–1, default 1) sets how far the field reaches into its lighter greens.
 */
const VERTEX = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`

const FRAGMENT = `
  precision mediump float;
  uniform vec2 u_size;
  uniform float u_time;
  uniform vec2 u_pointer;
  uniform float u_near;
  uniform float u_strength;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
    return v;
  }

  // The home page's greens, pushed fuller: deep ink, forest, a living moss, leaf, and a pale mint
  // only at the crests.
  vec3 palette(float t) {
    vec3 ink = vec3(0.004, 0.137, 0.086);
    vec3 forest = vec3(0.020, 0.235, 0.141);
    vec3 moss = vec3(0.078, 0.392, 0.231);
    vec3 leaf = vec3(0.235, 0.565, 0.341);
    vec3 light = vec3(0.482, 0.749, 0.541);
    vec3 pale = vec3(0.741, 0.882, 0.729);
    vec3 c = mix(ink, forest, smoothstep(0.10, 0.34, t));
    c = mix(c, moss, smoothstep(0.34, 0.54, t));
    c = mix(c, leaf, smoothstep(0.54, 0.70, t));
    c = mix(c, light, smoothstep(0.70, 0.84, t));
    return mix(c, pale, smoothstep(0.84, 0.97, t));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_size;
    float aspect = u_size.x / u_size.y;
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 0.55;
    float t = u_time * 0.045;

    vec2 toPointer = (u_pointer - 0.5) * vec2(aspect, 1.0) * 0.55 - p;
    float pull = exp(-dot(toPointer, toPointer) * 14.0) * u_near;

    vec2 q = vec2(fbm(p * 2.2 + vec2(t, -t * 0.6)), fbm(p * 2.2 + vec2(5.2, 1.3) - t * 0.8));
    vec2 r = vec2(fbm(p * 1.8 + 1.9 * q + vec2(1.7, 9.2) + t * 1.2),
                  fbm(p * 1.8 + 1.9 * q + vec2(8.3, 2.8) - t));
    r += toPointer * pull * 1.4;
    float f = fbm(p * 1.6 + 2.0 * r);

    float wave = 0.12 * sin(p.x * 5.0 - p.y * 3.0 + t * 9.0 + f * 5.0);
    float tone = clamp((f * 1.25 - 0.08 + wave + pull * 0.35) * mix(0.7, 1.0, u_strength), 0.0, 1.0);
    vec3 color = palette(tone);

    // a little ebony in the deepest folds, as on the home page
    color = mix(color, vec3(0.145, 0.055, 0.055), smoothstep(0.62, 0.86, q.x) * (1.0 - tone) * 0.45);

    color *= 0.94 + 0.06 * hash(gl_FragCoord.xy + floor(u_time * 24.0));  // grain
    gl_FragColor = vec4(color, 1.0);
  }`

function Wave({
  strength = 1,
  className,
  ...props
}: React.ComponentProps<"div"> & { strength?: number }) {
  const stage = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [still, setStill] = React.useState(false)

  React.useEffect(() => {
    const box = stage.current
    const canvas = canvasRef.current
    if (!box || !canvas) return
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: false, antialias: false })
    if (!gl) { setStill(true); return }

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null
    }
    const vs = compile(gl.VERTEX_SHADER, VERTEX), fs = compile(gl.FRAGMENT_SHADER, FRAGMENT)
    const program = gl.createProgram()!
    if (vs && fs) { gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program) }
    if (!vs || !fs || !gl.getProgramParameter(program, gl.LINK_STATUS)) { setStill(true); return }
    gl.useProgram(program)

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, "a_position")
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    const uniform = (name: string) => gl.getUniformLocation(program, name)
    const uSize = uniform("u_size"), uTime = uniform("u_time"), uPointer = uniform("u_pointer")
    const uNear = uniform("u_near"), uStrength = uniform("u_strength")
    gl.uniform1f(uStrength, Math.min(1, Math.max(0, strength)))

    // The field is soft, so it is drawn below screen resolution and scaled up.
    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * 0.6))
      const h = Math.max(1, Math.round(canvas.clientHeight * 0.6))
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h }
      gl.viewport(0, 0, w, h)
      gl.uniform2f(uSize, w, h)
    }

    // The pointer, in the field's own 0–1 coordinates (y up), and how near it is; both ease.
    const pointer = { x: 0.5, y: 0.5, near: 0, tx: 0.5, ty: 0.5, tnear: 0 }
    const onMove = (event: PointerEvent) => {
      const rect = box.getBoundingClientRect()
      pointer.tx = (event.clientX - rect.left) / rect.width
      pointer.ty = 1 - (event.clientY - rect.top) / rect.height
      const inside = pointer.tx >= 0 && pointer.tx <= 1 && pointer.ty >= 0 && pointer.ty <= 1
      pointer.tnear = inside ? 1 : 0
    }

    const start = performance.now() - 40000 // begin mid-flow, not from a blank field
    const draw = (now: number) => {
      pointer.x += (pointer.tx - pointer.x) * 0.05
      pointer.y += (pointer.ty - pointer.y) * 0.05
      pointer.near += (pointer.tnear - pointer.near) * 0.04
      gl.uniform1f(uTime, (now - start) / 1000)
      gl.uniform2f(uPointer, pointer.x, pointer.y)
      gl.uniform1f(uNear, pointer.near)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
    const sizes = new ResizeObserver(() => { resize(); if (reduced) draw(start + 40000) })
    sizes.observe(canvas)
    resize()
    if (reduced) {
      draw(start + 40000)
      return () => sizes.disconnect()
    }

    addEventListener("pointermove", onMove, { passive: true })
    let frame = 0
    const loop = (now: number) => { draw(now); frame = requestAnimationFrame(loop) }
    const seen = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !frame) frame = requestAnimationFrame(loop)
      if (!entry.isIntersecting && frame) { cancelAnimationFrame(frame); frame = 0 }
    })
    seen.observe(box)
    return () => {
      cancelAnimationFrame(frame)
      seen.disconnect()
      sizes.disconnect()
      removeEventListener("pointermove", onMove)
      // The context is left alive: React may mount the same canvas again (Strict Mode), and a
      // released context cannot be got back. It goes with the canvas when the canvas goes.
    }
  }, [strength])

  return (
    <div
      ref={stage}
      aria-hidden="true"
      data-slot="wave"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden bg-(--ohm-forest)",
        still && "bg-[radial-gradient(60%_70%_at_75%_30%,color-mix(in_oklab,var(--ohm-green-light)_45%,var(--ohm-forest)),transparent_72%),radial-gradient(50%_60%_at_25%_75%,color-mix(in_oklab,var(--ohm-forest)_70%,black),transparent_70%)]",
        className
      )}
      {...props}
    >
      {!still && <canvas ref={canvasRef} className="block size-full" />}
    </div>
  )
}

export { Wave }
