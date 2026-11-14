import type {LucideIcon, LucideProps} from "lucide-react"
import { cn } from "@/registry/ohm/lib/cn"

const SIZES = {
  xs: "size-icon-xs",
  sm: "size-icon-sm",
  md: "size-icon",
  lg: "size-icon-lg",
  xl: "size-icon-xl",
} as const

export type IconSize = keyof typeof SIZES

/**
 * One icon at an ohm size and stroke. Icons are Lucide, shadcn's icon set.
 * Decorative by default; pass `label` when the icon is the only thing that says what a control does.
 *   <Icon icon={SearchIcon} />   <Icon icon={icons.help} size="lg" label="Help" />
 */
function Icon({
  icon: Glyph,
  size = "md",
  label,
  className,
  ...props
}: Omit<LucideProps, "size"> & { icon: LucideIcon; size?: IconSize; label?: string }) {
  return (
    <Glyph
      data-slot="icon"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      className={cn(SIZES[size], "shrink-0", className)}
      {...props}
    />
  )
}

export { Icon }
