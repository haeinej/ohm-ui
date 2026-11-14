import {useEffect, useLayoutEffect, useRef, useSyncExternalStore, type ReactNode} from 'react';
import {Button} from '@/registry/ohm/ui/button';
import {cn} from '@/registry/ohm/lib/cn';

/*
 * Every message the app raises (errors, update available, blocked states) is a
 * notice: the floating pill first designed for "A new version of ohm is
 * ready." Screens stay blank; the pill floats top-center over them. A notice is
 * a passing notification with no close control: it leaves on its own after a few
 * seconds (the notification center keeps it), unless it tracks something still
 * going on, such as work in progress or an update waiting.
 */

export type NoticeAction = {label: string; run: () => void};
export type Notice = {id: string; message: ReactNode; action?: NoticeAction; tone?: 'error' | 'info';
  /** How long it stays, in ms; null keeps it until it is dismissed. By default a few seconds, longer with an action. */
  ttl?: number | null};

/** How long a notice stays by default: long enough to read, and to press its action. */
const ttlOf = (notice: Notice) => notice.action ? 8000 : notice.tone === 'info' ? 4000 : 6000;
const timers = new Map<string, ReturnType<typeof setTimeout>>();

let notices: Notice[] = [];
const listeners = new Set<() => void>(), raised = new Set<(notice: Notice) => void>();
/** Hears every newly raised notice, as the notification center keeps a history of them. */
export function onNotice(listener: (notice: Notice) => void) { raised.add(listener); return () => { raised.delete(listener); }; }
const emit = () => { for (const listener of listeners) listener(); };

/** Shows a notice; the same id replaces the previous one. Returns the id. */
export function notify(notice: Omit<Notice, 'id'> & {id?: string}): string {
  const id = notice.id ?? crypto.randomUUID();
  const next: Notice = {tone: 'error', ...notice, id};
  const fresh = !notices.some(n => n.id === id && n.message === notice.message);
  notices = [...notices.filter(n => n.id !== id), next];
  clearTimeout(timers.get(id)); timers.delete(id);
  const ttl = notice.ttl === undefined ? ttlOf(next) : notice.ttl;
  if (ttl) timers.set(id, setTimeout(() => dismissNotice(id), ttl));
  emit();
  if (fresh) for (const listener of raised) listener(next);
  return id;
}

export function dismissNotice(id: string) {
  clearTimeout(timers.get(id)); timers.delete(id);
  if (!notices.some(n => n.id === id)) return;
  notices = notices.filter(n => n.id !== id);
  emit();
}

const subscribe = (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener); };

/**
 * Shows `error` as a notice while it is set and dismisses it when it clears or
 * the caller unmounts. Replaces inline `{error && <p role="alert">…}` markup.
 */
export function useErrorNotice(error: ReactNode | null | undefined | false, action?: NoticeAction) {
  const latest = useRef(action);
  latest.current = action;
  const label = action?.label;
  useEffect(() => {
    if (!error) return;
    const id = notify({message: error, action: label ? {label, run: () => latest.current?.run()} : undefined});
    return () => dismissNotice(id);
  }, [error, label]);
}

/**
 * Shows background work in progress ("Filing…", "Checking for mail") as an info
 * pill with the working dot while `active`, and removes it when the work ends
 * (it does not time out).
 */
export function useBusyNotice(id: string, label: string | false | null | undefined, action?: NoticeAction) {
  const latest = useRef(action);
  latest.current = action;
  const actionLabel = action?.label;
  useEffect(() => {
    if (!label) return;
    notify({id, tone: 'info', ttl: null, message: <span className="inline-flex items-center gap-2"><BusyDot/>{label}</span>,
      action: actionLabel ? {label: actionLabel, run: () => latest.current?.run()} : undefined});
    return () => dismissNotice(id);
  }, [id, label, actionLabel]);
}

function BusyDot() {
  return <span aria-hidden="true" className="inline-block size-2 flex-none animate-pulse rounded-full bg-current motion-reduce:animate-none"/>;
}

/** The pill itself: message, then at most one action. */
export function NoticePill({children, action, role = 'alert', className}: {children: ReactNode; action?: ReactNode; role?: 'alert' | 'status'; className?: string}) {
  return <div role={role} className={cn(
    'pointer-events-auto flex max-w-[calc(100vw-24px)] items-center gap-3 rounded-full bg-(--ohm-float) py-2 pr-2 pl-4 has-[>span:only-child]:pr-4 text-body text-foreground shadow-(--ohm-float-shadow) backdrop-blur-xl',
    // Urgent ones (alerts: errors and broken access) read light red.
    role === 'alert' && 'bg-(--ohm-danger-wash) text-destructive',
    'ohm-step-enter', className)}>
    <span className="min-w-0 py-1.5">{children}</span>
    {action}
  </div>;
}

/**
 * Fixed top-center column the pills float in. It is a manual popover so it sits
 * in the browser's top layer, above modal <dialog>s; re-shown on every render
 * so it stays above a dialog opened after it.
 */
export function NoticeLayer({children}: {children: ReactNode}) {
  const layer = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = layer.current;
    if (!el?.showPopover) return;
    if (el.matches(':popover-open')) el.hidePopover();
    el.showPopover();
  });
  return <div ref={layer} popover="manual" className="pointer-events-none fixed inset-x-0 top-[calc(12px+env(safe-area-inset-top,0px))] bottom-auto z-50 m-0 flex w-auto flex-col items-center gap-2 overflow-visible border-0 bg-transparent p-0 px-3">{children}</div>;
}

/** Mount once at the root: renders every notice raised through notify(). */
export function Notices() {
  const list = useSyncExternalStore(subscribe, () => notices);
  if (!list.length) return null;
  return <NoticeLayer>
    {list.map(n => <NoticePill key={n.id} role={n.tone === 'info' ? 'status' : 'alert'}
      action={n.action && <Button type="button" className="rounded-full" onClick={() => { dismissNotice(n.id); n.action!.run(); }}>{n.action.label}</Button>}>{n.message}</NoticePill>)}
  </NoticeLayer>;
}
