import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { useRender } from "@base-ui/react/use-render"
import { mergeProps } from "@base-ui/react/merge-props"
import { cn } from "@/registry/ohm/lib/cn"

/**
 * A surface that holds a group of things: settings, a list, a side column, a floating tool.
 * Choose what it is made of (material), how far it sits off the page (elevation) and its size.
 * Frost materials need something behind them to blur: use them over imagery, maps or content
 * that scrolls underneath, not on a plain page.
 */
const panelVariants = cva(
  "group/panel relative flex flex-col text-foreground",
  {
    variants: {
      material: {
        solid: "bg-card",
        raised: "bg-(--ohm-raised)",
        muted: "bg-muted",
        "frost-thin": "frost-thin shadow-(--ohm-highlight)",
        frost: "frost shadow-(--ohm-highlight)",
        "frost-thick": "frost-thick shadow-(--ohm-highlight)",
        tint: "frost-tint shadow-(--ohm-highlight)",
      },
      elevation: {
        "0": "",
        "1": "shade-1",
        "2": "shade-2",
        "3": "shade-3",
        "4": "shade-4",
        "5": "shade-5",
      },
      size: {
        sm: "gap-2 rounded-xl p-2",
        default: "gap-3 rounded-2xl p-3",
        lg: "gap-4 rounded-3xl p-5",
      },
    },
    compoundVariants: [
      // A frost panel keeps its catch-light under any shade.
      { material: ["frost-thin", "frost", "frost-thick", "tint"], elevation: "1", className: "shadow-[var(--ohm-highlight),var(--ohm-edge),var(--ohm-shade-1)]" },
      { material: ["frost-thin", "frost", "frost-thick", "tint"], elevation: "2", className: "shadow-[var(--ohm-highlight),var(--ohm-edge),var(--ohm-shade-2)]" },
      { material: ["frost-thin", "frost", "frost-thick", "tint"], elevation: "3", className: "shadow-[var(--ohm-highlight),var(--ohm-edge),var(--ohm-shade-3)]" },
      { material: ["frost-thin", "frost", "frost-thick", "tint"], elevation: "4", className: "shadow-[var(--ohm-highlight),var(--ohm-edge),var(--ohm-shade-4)]" },
      { material: ["frost-thin", "frost", "frost-thick", "tint"], elevation: "5", className: "shadow-[var(--ohm-highlight),var(--ohm-edge),var(--ohm-shade-5)]" },
    ],
    defaultVariants: { material: "solid", elevation: "2", size: "default" },
  }
)

function Panel({
  className,
  material,
  elevation,
  size,
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof panelVariants>) {
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      { className: cn(panelVariants({ material, elevation, size }), className) },
      props
    ),
    state: { slot: "panel", material, elevation, size },
  })
}

function PanelHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-header"
      className={cn("grid auto-rows-min grid-cols-[1fr_auto] items-start gap-0.5 px-2 pt-1", className)}
      {...props}
    />
  )
}

function PanelTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-title"
      className={cn("text-(length:--ohm-type-title-size) leading-(--ohm-type-title-leading) font-semibold tracking-(--ohm-type-title-tracking)", className)}
      {...props}
    />
  )
}

function PanelDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="panel-description" className={cn("col-start-1 text-body text-muted-foreground", className)} {...props} />
}

/** Sits in the header's top-right corner: a close button, a menu. */
function PanelAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="panel-action" className={cn("col-start-2 row-span-2 row-start-1 self-start", className)} {...props} />
}

function PanelContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="panel-content" className={cn("px-2", className)} {...props} />
}

function PanelFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="panel-footer" className={cn("flex items-center gap-2 px-2 pb-1", className)} {...props} />
}

/** A group of rows inside a panel, under a quiet label: "Support", "Workspace". */
function PanelGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div role="group" data-slot="panel-group" className={cn("flex flex-col gap-0.5", className)} {...props} />
}

function PanelLabel({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="panel-label" className={cn("px-3 pt-1.5 pb-1 text-small text-muted-foreground", className)} {...props} />
}

/**
 * A row in a panel: an icon and a label, as a link or button (`render={<a href="…"/>}`).
 * `active` marks where you are. Rows highlight with tone, never a line.
 */
function PanelItem({
  className,
  active,
  render,
  ...props
}: useRender.ComponentProps<"button"> & { active?: boolean }) {
  return useRender({
    defaultTagName: "button",
    render,
    props: mergeProps<"button">(
      {
        type: render ? undefined : "button",
        "aria-current": active ? "page" : undefined,
        className: cn(
          "flex min-h-10 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-body text-foreground outline-none transition-colors",
          "hover:bg-muted focus-visible:bg-muted aria-[current=page]:bg-muted aria-[current=page]:font-medium",
          "disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-icon",
          className
        ),
      },
      props
    ),
    state: { slot: "panel-item", active },
  })
}

function PanelSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return <div role="separator" data-slot="panel-separator" className={cn("-mx-3 my-1 h-px bg-border group-data-[size=sm]/panel:-mx-2 group-data-[size=lg]/panel:-mx-5", className)} {...props} />
}

export {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelDescription,
  PanelAction,
  PanelContent,
  PanelFooter,
  PanelGroup,
  PanelLabel,
  PanelItem,
  PanelSeparator,
  panelVariants,
}
