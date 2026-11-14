// An agent's work, folded: consecutive tool calls become one line that opens to a line per step.
// Labels come from `describe`, so an app names its own tools; the default humanizes the tool name.
import {useAuiState} from '@assistant-ui/react';
import {ChevronDownIcon} from 'lucide-react';
import {createContext, useContext, useState, type ReactNode} from 'react';
import {Button} from '@/registry/ohm/ui/button';
import {cn} from '@/registry/ohm/lib/cn';

export type ToolPart = {type: 'tool-call'; toolName: string; args?: Record<string, unknown>; result?: unknown; status?: {type: string}};

/** What a step says while it runs and once it is done. */
export type ToolDescriber = (part: ToolPart) => {doing: string; done: string; icon?: ReactNode};

const humanize = (name: string) => name.replace(/[_-]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
export const defaultDescribe: ToolDescriber = part => ({doing: `Running ${humanize(part.toolName)}`, done: `Ran ${humanize(part.toolName)}`});

const DescribeContext = createContext<ToolDescriber>(defaultDescribe);
/** Gives every ToolGroup and ToolStep below it the app's own wording for its tools. */
export const ToolDescriptions = DescribeContext.Provider;

const running = (p: ToolPart) => p.result === undefined && p.status?.type !== 'incomplete';
const errorOf = (result: unknown) => {
  if (result && typeof result === 'object' && 'error' in result && typeof result.error === 'string') return result.error;
  return undefined;
};

/** One step: what it did, and why it stopped if it failed. */
export function ToolStep({part}: {part: ToolPart}) {
  const describe = useContext(DescribeContext);
  const {doing, done, icon} = describe(part);
  const live = running(part), error = errorOf(part.result);
  return <li data-slot="tool-step" data-running={live || undefined} data-error={error ? true : undefined} className="flex flex-col gap-0.5 py-1">
    <div className="flex items-center gap-2 text-body text-muted-foreground">
      {icon}<span className={cn(live && 'animate-pulse motion-reduce:animate-none')}>{live ? doing : done}</span>
    </div>
    {error && <p className="pl-6 text-small text-destructive">{error}</p>}
  </li>;
}

/** Consecutive tool calls: a one-line summary that opens to each step. Open while working. */
export function ToolGroup({indices, children}: {indices: readonly number[]; children: ReactNode}) {
  const describe = useContext(DescribeContext);
  const parts = useAuiState(s => s.message.parts) as readonly {type: string}[];
  const tools = indices.map(i => parts[i]).filter((p): p is ToolPart => p?.type === 'tool-call');
  const live = tools.some(running);
  const [open, setOpen] = useState<boolean | null>(null);
  const expanded = open ?? live;
  const current = [...tools].reverse().find(running);
  const failed = tools.filter(t => errorOf(t.result)).length;
  const labels = [...new Set(tools.map(t => describe(t).done))];
  const head = current ? describe(current).doing
    : labels.slice(0, 3).join(', ') + (labels.length > 3 ? ', and more' : '');
  return <div data-slot="tool-activity" className="my-1">
    <Button type="button" variant="ghost" aria-expanded={expanded} onClick={() => setOpen(!expanded)}
      className="-ml-1.5 h-auto min-h-control-sm max-w-full justify-start gap-2 px-1.5 py-0.5 text-left font-normal text-muted-foreground">
      <span className="truncate">{head}{failed ? ` · ${failed} didn’t finish` : ''}</span>
      <ChevronDownIcon className={cn('size-4 flex-none transition-transform', expanded && 'rotate-180')}/>
    </Button>
    {expanded && <ol className="ml-1.5 pl-3">{children}</ol>}
  </div>;
}
