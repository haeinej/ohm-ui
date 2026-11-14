import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card"
import { cn } from "@/registry/ohm/lib/cn"

/** shadcn/ui hover card on Base UI's PreviewCard: content shown while the trigger is hovered or focused. */
function HoverCard(props: PreviewCardPrimitive.Root.Props) {
  return <PreviewCardPrimitive.Root data-slot="hover-card" {...props} />
}

function HoverCardTrigger({ delay = 450, closeDelay = 150, ...props }: PreviewCardPrimitive.Trigger.Props) {
  return <PreviewCardPrimitive.Trigger data-slot="hover-card-trigger" delay={delay} closeDelay={closeDelay} {...props} />
}

function HoverCardContent({
  className,
  side = "bottom",
  sideOffset = 8,
  align = "start",
  collisionBoundary,
  ...props
}: PreviewCardPrimitive.Popup.Props & Pick<PreviewCardPrimitive.Positioner.Props, "side" | "sideOffset" | "align" | "collisionBoundary">) {
  return (
    <PreviewCardPrimitive.Portal>
      <PreviewCardPrimitive.Positioner side={side} sideOffset={sideOffset} align={align} collisionBoundary={collisionBoundary} className="z-50 outline-none">
        <PreviewCardPrimitive.Popup
          data-slot="hover-card-content"
          className={cn(
            "origin-(--transform-origin) outline-none transition-[opacity,transform] duration-150 data-[ending-style]:scale-98 data-[ending-style]:opacity-0 data-[starting-style]:scale-98 data-[starting-style]:opacity-0 motion-reduce:transition-none",
            className
          )}
          {...props}
        />
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
