import { useEffect, useRef, type CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/ohm/ui/avatar';
import { cn } from '@/registry/ohm/lib/cn';

const material = {
  '--foreground': 'var(--ohm-paper-light)',
  '--muted-foreground': 'var(--ohm-identity-muted)',
  // Pointer state, written by useCardMotion: -1..1 on each axis.
  '--tx': '0', '--ty': '0',
} as CSSProperties;

/** Soft, shapeless light under the glass. Each drifts at its own depth as the card turns. */
const blobs: { at: string; size: string; tone: string; depth: number }[] = [
  { at: 'left-[-30%] top-[-50%]', size: 'size-[95%]', tone: 'var(--ohm-identity-glow)', depth: 10 },
  { at: 'right-[-35%] top-[-5%]', size: 'size-[90%]', tone: 'var(--ohm-identity-glow-soft)', depth: -12 },
  { at: 'left-[5%] bottom-[-70%]', size: 'size-[110%]', tone: 'var(--ohm-identity-deep)', depth: 8 },
];

/** Bounded pointer response: the card leans gently toward the pointer. */
function useCardMotion() {
  const card = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = card.current;
    if (!el) return;
    const allowed = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const target = { x: 0, y: 0 }, now = { x: 0, y: 0 };
    let frame = 0;
    const write = () => {
      const s = el.style;
      s.setProperty('--tx', now.x.toFixed(4));
      s.setProperty('--ty', now.y.toFixed(4));
    };
    const step = () => {
      // Critically-damped ease toward the pointer; stops scheduling once it has settled.
      now.x += (target.x - now.x) * 0.14;
      now.y += (target.y - now.y) * 0.14;
      write();
      const moving = Math.abs(target.x - now.x) + Math.abs(target.y - now.y) > 0.001;
      frame = moving ? requestAnimationFrame(step) : 0;
    };
    const kick = () => { if (!frame) frame = requestAnimationFrame(step); };
    const move = (event: PointerEvent) => {
      if (!allowed.matches || event.pointerType === 'touch') return;
      const box = el.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width * 2 - 1;
      const y = (event.clientY - box.top) / box.height * 2 - 1;
      const inside = Math.abs(x) <= 1 && Math.abs(y) <= 1;
      // Inside the card it follows fully; across the page it only leans, so it feels aware, not twitchy.
      const reach = inside ? 1 : 0.35;
      target.x = Math.max(-1, Math.min(1, x)) * reach;
      target.y = Math.max(-1, Math.min(1, y)) * reach;
      kick();
    };
    const rest = () => { target.x = 0; target.y = 0; kick(); };
    const leaveWindow = (event: PointerEvent) => { if (!event.relatedTarget) rest(); };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerout', leaveWindow);
    window.addEventListener('blur', rest);
    allowed.addEventListener('change', rest);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerout', leaveWindow);
      window.removeEventListener('blur', rest);
      allowed.removeEventListener('change', rest);
    };
  }, []);
  return card;
}

/** `did:plc:xrcmfy47…` → method and the key in fours, read like a card number. */
function didParts(did: string) {
  const at = did.lastIndexOf(':');
  return { method: did.slice(0, at + 1), groups: did.slice(at + 1).match(/.{1,4}/g) ?? [] };
}

/**
 * The person's identity as a plain, cloudy glass card that leans toward the pointer: picture, name, the address of
 * their home and their DID. `onOpenWorkspace` makes the address a link once a workspace exists.
 */
export type IdentityCardProps = {
  did: string;
  name: string;
  address?: string | null;
  avatarSrc?: string | null;
  bannerSrc?: string | null;
  onOpenWorkspace?: () => void;
  className?: string;
};

/** Fixed-size identity object. Apps supply data; no account or storage access lives here. */
export function IdentityCard({ did, name, address, avatarSrc, bannerSrc, onOpenWorkspace, className }: IdentityCardProps) {
  const card = useCardMotion();
  const initial = name.trim().charAt(0).toUpperCase();
  const { method, groups } = didParts(did);
  const addressContent = <>
    <span className="truncate">{address}</span>
    <ArrowUpRight aria-hidden className="size-icon-sm shrink-0 opacity-70" />
  </>;
  const pill = '-ml-3 inline-flex min-w-0 max-w-full items-center gap-1.5 self-start rounded-full px-3 py-1.5 text-body text-foreground backdrop-blur-md transition-colors';

  return <div className={cn("w-(--ohm-identity-width) max-w-full flex-none [perspective:var(--ohm-identity-perspective)]", className)} style={material}>
    <section
      ref={card}
      data-identity-card="glass"
      aria-label={`Identity card for ${name}`}
      className="@container relative isolate aspect-(--ohm-identity-ratio) w-full overflow-hidden rounded-3xl text-left text-foreground will-change-transform"
      style={{
        transform: 'rotateX(calc(var(--ty) * var(--ohm-identity-tilt-x))) rotateY(calc(var(--tx) * var(--ohm-identity-tilt-y)))',
        boxShadow: 'calc(var(--tx) * var(--ohm-identity-shadow-x)) calc(var(--ohm-identity-shadow-y) + var(--ty) * var(--ohm-identity-shadow-drift)) var(--ohm-identity-shadow-blur) var(--ohm-identity-shadow-spread) var(--ohm-identity-shadow-color), var(--ohm-identity-shadow-contact)',
      }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-3xl" style={{ background: 'var(--ohm-identity-base)', clipPath: 'inset(0 round var(--ohm-radius-sheet))' }}>
        {/* Under the glass: their banner if they have one, otherwise soft forest light */}
        {bannerSrc
          ? <img className="absolute inset-0 size-full scale-110 object-cover blur-2xl" src={bannerSrc} alt="" referrerPolicy="no-referrer" />
          : blobs.map((b, i) => <span key={i} aria-hidden className={`absolute ${b.at} ${b.size} rounded-full blur-(--ohm-identity-blur) opacity-90`}
              style={{ background: b.tone, transform: `translate(calc(var(--tx) * ${b.depth}px), calc(var(--ty) * ${b.depth}px))` }} />)}

        {/* The glass itself */}
        <span aria-hidden className="absolute inset-0" style={{
          background: 'var(--ohm-identity-glass)',
          backdropFilter: 'var(--ohm-frost-blur)',
        }} />

        {/* Identity */}
        <div className="relative flex size-full flex-col justify-between p-3 @min-[16rem]:p-4 @min-[23rem]:p-6">
          <Avatar className="size-8 @min-[16rem]:size-16 @min-[23rem]:size-24 after:hidden" style={{
            transform: 'translate(calc(var(--tx) * 4px), calc(var(--ty) * 3px))',
          }}>
            <AvatarImage src={avatarSrc ?? undefined} alt="" referrerPolicy="no-referrer" />
            <AvatarFallback className="bg-transparent">
              <span className="flex size-full items-center justify-center rounded-full text-h1"
                style={{ fontFamily: 'var(--ohm-font-serif)', background: 'var(--ohm-identity-initial-fill)', color: 'var(--ohm-identity-initial)' }}>
                {initial}
              </span>
            </AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-col gap-1 @min-[16rem]:gap-2 @min-[23rem]:gap-3">
            <h2 className="truncate text-h2">{name}</h2>
            {address && (onOpenWorkspace
              ? <button type="button" onClick={onOpenWorkspace} className={`${pill} hover:bg-(--ohm-identity-pill-hover)`}
                  style={{ background: 'var(--ohm-identity-pill)' }} aria-label={`Open the workspace at ${address}`}>
                  {addressContent}
                </button>
              : <span className={pill} style={{ background: 'var(--ohm-identity-pill)' }} title={address}>{addressContent}</span>)}
            <p className="flex min-w-0 items-baseline gap-2 font-mono text-small text-muted-foreground" title={did}>
              <span className="shrink-0 opacity-70">{method}</span>
              <span className="flex min-w-0 gap-1.5 overflow-hidden tracking-wider">{groups.map((g, i) => <span key={i}>{g}</span>)}</span>
            </p>
          </div>
        </div>
      </div>

    </section>
  </div>;
}
