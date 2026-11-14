import {Progress as ProgressPrimitive} from '@base-ui/react/progress';
import {cn} from '@/registry/ohm/lib/cn';

/** shadcn/ui Progress (base-nova). `value={null}` is indeterminate: the bar slides like the loading line. */
export function Progress({className, children, value, ...props}: ProgressPrimitive.Root.Props) {
  return <ProgressPrimitive.Root value={value} data-slot="progress" className={cn('flex flex-wrap gap-3', className)} {...props}>
    {children}
    <ProgressPrimitive.Track data-slot="progress-track" className="relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted">
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full rounded-full bg-primary transition-all data-indeterminate:w-2/5 data-indeterminate:animate-[ohm-loading-slide_1.1s_var(--ohm-ease-morph)_infinite_alternate] motion-reduce:data-indeterminate:w-full motion-reduce:data-indeterminate:animate-none motion-reduce:data-indeterminate:opacity-50"
      />
    </ProgressPrimitive.Track>
  </ProgressPrimitive.Root>;
}

export function ProgressLabel({className, ...props}: ProgressPrimitive.Label.Props) {
  return <ProgressPrimitive.Label data-slot="progress-label" className={cn('text-xs text-muted-foreground', className)} {...props}/>;
}

export function ProgressValue({className, ...props}: ProgressPrimitive.Value.Props) {
  return <ProgressPrimitive.Value data-slot="progress-value" className={cn('ml-auto text-xs text-muted-foreground tabular-nums', className)} {...props}/>;
}
