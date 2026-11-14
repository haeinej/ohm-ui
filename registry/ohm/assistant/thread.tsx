// A conversation with an agent, built from assistant-ui primitives on ohm tokens.
// Wrap it in your runtime: <AssistantRuntimeProvider runtime={runtime}><Thread/></AssistantRuntimeProvider>.
// The thread takes no data of its own; the runtime is where messages come from.
import {
  ActionBarPrimitive, AuiIf, ComposerPrimitive, ErrorPrimitive, MessagePrimitive, ThreadPrimitive,
  groupPartByType, useAuiState,
} from '@assistant-ui/react';
import {ArrowDownIcon, ArrowUpIcon, CheckIcon, CopyIcon} from 'lucide-react';
import type {ReactNode} from 'react';
import {Button} from '@/registry/ohm/ui/button';
import {cn} from '@/registry/ohm/lib/cn';
import {MarkdownText} from '@/registry/ohm/assistant/markdown-text';
import {ToolGroup, ToolStep, type ToolPart} from '@/registry/ohm/assistant/tool-activity';

export function Thread({className, empty, placeholder}: {className?: string; empty?: ReactNode; placeholder?: string}) {
  return <ThreadPrimitive.Root data-slot="thread" className={cn('relative flex h-full min-h-0 flex-col bg-background', className)}>
    <ThreadPrimitive.Viewport className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-6">
      <div className="mx-auto flex w-full max-w-[680px] flex-1 flex-col gap-4">
        <AuiIf condition={s => s.thread.isEmpty}>{empty ?? <ThreadEmpty/>}</AuiIf>
        <ThreadPrimitive.Messages>
          {({message}) => message.role === 'user' ? <UserMessage/> : <AssistantMessage/>}
        </ThreadPrimitive.Messages>
      </div>
      <ThreadPrimitive.ViewportFooter className="sticky bottom-0 mx-auto mt-auto flex w-full max-w-[680px] flex-col items-center gap-2 bg-background pt-2 pb-4">
        <ThreadPrimitive.ScrollToBottom asChild>
          <Button type="button" variant="outline" size="icon-sm" aria-label="Scroll to the latest message" className="rounded-full disabled:invisible">
            <ArrowDownIcon/>
          </Button>
        </ThreadPrimitive.ScrollToBottom>
        <Composer placeholder={placeholder}/>
      </ThreadPrimitive.ViewportFooter>
    </ThreadPrimitive.Viewport>
  </ThreadPrimitive.Root>;
}

function ThreadEmpty() {
  return <div className="flex flex-1 items-center justify-center py-12">
    <h2 className="text-h2 text-muted-foreground">How can I help?</h2>
  </div>;
}

/** Text in, send while idle, stop while running. */
export function Composer({placeholder = 'Write a message…', className}: {placeholder?: string; className?: string}) {
  return <ComposerPrimitive.Root data-slot="composer"
    className={cn('flex w-full items-end gap-1 rounded-sheet border border-transparent bg-(--ohm-glass-strong) p-1.5 pl-4 shadow-(--ohm-float-shadow) focus-within:border-border focus-within:shadow-(--ohm-float-shadow-focus)', className)}>
    <ComposerPrimitive.Input data-slot="composer-input" rows={1} placeholder={placeholder} aria-label={placeholder}
      unstable_insertNewlineOnTouchEnter
      className="max-h-36 min-h-control-md min-w-0 flex-1 resize-none border-0 bg-transparent py-2 font-sans text-base text-foreground outline-none focus-visible:outline-none placeholder:text-muted-foreground"/>
    <AuiIf condition={s => !s.thread.isRunning}>
      <ComposerPrimitive.Send asChild>
        <Button type="submit" size="icon-sm" className="rounded-full" aria-label="Send message"><ArrowUpIcon/></Button>
      </ComposerPrimitive.Send>
    </AuiIf>
    <AuiIf condition={s => s.thread.isRunning}>
      <ComposerPrimitive.Cancel asChild>
        {/* While the agent runs, send becomes a plain square: press it to stop. */}
        <Button type="button" size="icon-sm" className="rounded-[7px]" aria-label="Stop reply" title="Stop reply"/>
      </ComposerPrimitive.Cancel>
    </AuiIf>
  </ComposerPrimitive.Root>;
}

export function UserMessage() {
  return <MessagePrimitive.Root data-slot="user-message" className="flex justify-end">
    <div className="max-w-[80%] rounded-card bg-(--ohm-bubble-self) px-3.5 py-2 text-body whitespace-pre-wrap text-foreground">
      <MessagePrimitive.Parts/>
    </div>
  </MessagePrimitive.Root>;
}

const groupTools = groupPartByType({'tool-call': ['group-tools']});

export function AssistantMessage() {
  const waiting = useAuiState(s => s.thread.isRunning && s.message.isLast
    && !s.message.content.some(p => p.type === 'text' && p.text.trim()));
  return <MessagePrimitive.Root data-slot="assistant-message" className="group flex flex-col">
    <MessagePrimitive.GroupedParts groupBy={groupTools} indicator="never">{({part, children}) => {
      switch (part.type) {
        case 'group-tools': return <ToolGroup indices={(part as {indices: readonly number[]}).indices}>{children}</ToolGroup>;
        case 'text': return <MarkdownText/>;
        case 'tool-call': return <ToolStep part={part as ToolPart}/>;
        default: return <></>;
      }
    }}</MessagePrimitive.GroupedParts>
    {waiting && <TypingIndicator/>}
    <MessagePrimitive.Error>
      <ErrorPrimitive.Root className="mt-2 rounded-field bg-(--ohm-danger-wash) px-3 py-2 text-body text-destructive"><ErrorPrimitive.Message/></ErrorPrimitive.Root>
    </MessagePrimitive.Error>
    <ActionBarPrimitive.Root hideWhenRunning className="mt-1 flex gap-1">
      <ActionBarPrimitive.Copy asChild>
        <Button type="button" variant="ghost" size="icon-sm" className="rounded-full text-muted-foreground" aria-label="Copy reply" title="Copy reply">
          <AuiIf condition={s => s.message.isCopied}><CheckIcon/><span className="sr-only" role="status">Copied</span></AuiIf>
          <AuiIf condition={s => !s.message.isCopied}><CopyIcon/></AuiIf>
        </Button>
      </ActionBarPrimitive.Copy>
    </ActionBarPrimitive.Root>
  </MessagePrimitive.Root>;
}

export function TypingIndicator({label = 'Thinking'}: {label?: string}) {
  return <span role="status" aria-label={label} className="flex h-6 items-center gap-1">
    {[0, 1, 2].map(i => <i key={i} className="size-1.5 animate-pulse rounded-full bg-muted-foreground motion-reduce:animate-none" style={{animationDelay: `${i * 160}ms`}}/>)}
  </span>;
}
