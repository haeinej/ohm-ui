import type {ComponentProps, ReactNode} from 'react';
import {cn} from '@/registry/ohm/lib/cn';
import {NoticeLayer, NoticePill} from '@/registry/ohm/ui/notice';

/*
 * App-level screens on the shadcn foundation: header / content / footer; motion uses
 * the `ohm-step-enter` entrance (@ohm/ui/motion.css); the optional backdrop is the
 * brand atmosphere (@ohm/ui/atmosphere.css). Edgeless: surfaces separate by tone and
 * shadow, never borders.
 */

/** Inline busy mark for a control that is working (e.g. inside a Button). Not for screens. */
export function LoadingDot({size = 8, className}: {size?: number; className?: string}) {
  return <span aria-hidden="true" className={cn('inline-block flex-none animate-pulse rounded-full bg-current motion-reduce:animate-none', className)} style={{width: size, height: size}}/>;
}

/** A wait inside a panel: blank. `label` is announced to screen readers only. */
export function Loading({label = 'Loading', className}: {label?: string; className?: string}) {
  return <div role="status" className={cn('flex-1', className)}><span className="sr-only">{label}</span></div>;
}

/**
 * The loading line: a short, thick, round-capped track with an indicator sliding
 * across it. Ink on a faint track, so it follows light and dark. It fades in
 * after a beat, so quick loads show nothing at all. Mirrors the boot markup in
 * web/index.html (`.boot-bar`), which shows before scripts run.
 */
export function LoadingBar({className}: {className?: string}) {
  return <div aria-hidden="true" className={cn('ohm-loading-bar', className)}><span/></div>;
}

/** A wait for everything beside the rail (a page's code loading): the loading line centered in that space. */
export function LoadingArea({label = 'Loading', className}: {label?: string; className?: string}) {
  return <div role="status" className={cn('grid min-h-0 min-w-0 flex-1 place-items-center', className)}>
    <LoadingBar/><span className="sr-only">{label}</span>
  </div>;
}

/** A full-viewport wait (boot, hand-offs): a blank page with the loading line. */
export function LoadingScreen({label = 'Loading'}: {label?: string}) {
  return <div role="status" className="grid h-dvh place-items-center bg-background">
    <LoadingBar/><span className="sr-only">{label}</span>
  </div>;
}

/** A blocking error or state: blank page with the message in the notice pill. */
export function StatusScreen({children, action, role = 'alert'}: {children: ReactNode; action?: ReactNode; role?: 'alert' | 'status'}) {
  return <div className="h-dvh bg-background">
    <NoticeLayer><NoticePill role={role} action={action}>{children}</NoticePill></NoticeLayer>
  </div>;
}

/** The brand atmosphere, for an explicitly immersive backdrop (onboarding, sign-in). */
export function Atmosphere({paused = false}: {paused?: boolean}) {
  return <div aria-hidden="true" className="ohm-atmosphere" data-ohm-atmosphere-motion={paused ? 'paused' : undefined}/>;
}

/**
 * The default popup screen: one centered, edgeless sheet over a quiet backdrop,
 * full-bleed on phones. Use for onboarding, setup, sign-in hand-offs and any
 * single-task flow that takes over the screen. Compose it from PopupHeader,
 * PopupBody (with PopupTitle) and PopupFooter; a <form> may wrap body and footer.
 */
export function PopupScreen({children, backdrop, className, label, ...props}: Omit<ComponentProps<'section'>, 'aria-label'> & {
  /** Accessible name of the task, e.g. "Account setup" (or pass aria-labelledby). */
  label?: string;
  /** Replaces the muted backdrop, e.g. <Atmosphere/>. */
  backdrop?: ReactNode;
}) {
  return <main className="relative isolate grid h-dvh place-items-center bg-muted text-foreground sm:p-6">
    {backdrop}
    <section aria-label={label} {...props} className={cn(
      'ohm-step-enter relative flex h-full w-full flex-col overflow-hidden bg-background',
      'sm:h-[min(660px,calc(100dvh-48px))] sm:max-w-[600px] sm:rounded-sheet sm:shadow-(--ohm-window-shadow)',
      className)}>
      {children}
    </section>
  </main>;
}

/** Top row for back/close controls. */
export function PopupHeader({className, ...props}: ComponentProps<'header'>) {
  return <header {...props} className={cn('flex min-h-16 flex-none items-center px-3.5 pt-[env(safe-area-inset-top)] sm:pt-0', className)}/>;
}

/** Scrolling body, with the sheet's reading padding. */
export function PopupBody({className, ...props}: ComponentProps<'div'>) {
  return <div {...props} className={cn('min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pt-4 pb-7 sm:px-16', className)}/>;
}

/** The task title. Focus it when a step changes so screen readers follow. */
export function PopupTitle({className, ...props}: ComponentProps<'h1'>) {
  return <h1 tabIndex={-1} {...props} className={cn('mb-7 font-serif text-h2 text-foreground outline-none', className)}/>;
}

/** Bottom actions; stays put while the body scrolls. */
export function PopupFooter({className, ...props}: ComponentProps<'footer'>) {
  return <footer {...props} className={cn('flex flex-none flex-col gap-1.5 px-6 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-16 sm:pb-7', className)}/>;
}
