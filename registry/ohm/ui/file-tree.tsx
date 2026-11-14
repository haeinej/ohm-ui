import * as React from "react"
import { cn } from "@/registry/ohm/lib/cn"
import { icons } from "@/registry/ohm/lib/icons"

/**
 * A folder tree for finding and opening things: notes, sources, files. Folders open in place;
 * a quiet guide line shows what belongs to which folder; the open item sits on a tone.
 * Data comes in as props; the tree keeps no data of its own.
 *
 *   <FileTree nodes={tree} selected={id} onSelect={setId} defaultExpanded={["00-system"]} />
 *
 * Put it in a FileTreePanel with FileTreeTabs and a FileTreeToolbar for a full side panel.
 */
export type FileTreeNode = {
  id: string
  name: string
  /** A folder has children, even an empty list. */
  children?: FileTreeNode[]
}

type Row = { node: FileTreeNode; depth: number; parent?: string }

function visibleRows(nodes: FileTreeNode[], expanded: ReadonlySet<string>, depth = 0, parent?: string): Row[] {
  return nodes.flatMap(node => [
    { node, depth, parent },
    ...(node.children && expanded.has(node.id) ? visibleRows(node.children, expanded, depth + 1, node.id) : []),
  ])
}

function FileTree({
  nodes,
  selected,
  onSelect,
  expanded: expandedProp,
  defaultExpanded = [],
  onExpandedChange,
  className,
  "aria-label": label = "Files",
  ...props
}: Omit<React.ComponentProps<"div">, "onSelect"> & {
  nodes: FileTreeNode[]
  selected?: string | null
  onSelect?: (id: string, node: FileTreeNode) => void
  /** Controlled: which folders are open. */
  expanded?: ReadonlySet<string>
  defaultExpanded?: Iterable<string>
  onExpandedChange?: (expanded: Set<string>) => void
}) {
  const [own, setOwn] = React.useState(() => new Set(defaultExpanded))
  const expanded = expandedProp ?? own
  const setExpanded = (next: Set<string>) => {
    if (!expandedProp) setOwn(next)
    onExpandedChange?.(next)
  }
  const toggle = (id: string, open = !expanded.has(id)) => {
    const next = new Set(expanded)
    if (open) next.add(id)
    else next.delete(id)
    setExpanded(next)
  }

  const rows = visibleRows(nodes, expanded)
  const [focused, setFocused] = React.useState<string | null>(null)
  const current = rows.some(row => row.node.id === focused) ? focused : (selected ?? rows[0]?.node.id ?? null)
  const refs = React.useRef(new Map<string, HTMLDivElement>())
  const focus = (id: string | undefined) => {
    if (!id) return
    setFocused(id)
    refs.current.get(id)?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    // The row the key was pressed on, read from the event so it never lags a focus update.
    const from = (event.target as HTMLElement).closest<HTMLElement>("[data-slot=file-tree-item]")?.dataset.id ?? current
    const at = rows.findIndex(row => row.node.id === from)
    const row = rows[at]
    if (!row) return
    const isFolder = Boolean(row.node.children)
    const open = expanded.has(row.node.id)
    const keys: Record<string, () => void> = {
      ArrowDown: () => focus(rows[at + 1]?.node.id),
      ArrowUp: () => focus(rows[at - 1]?.node.id),
      Home: () => focus(rows[0]?.node.id),
      End: () => focus(rows.at(-1)?.node.id),
      ArrowRight: () => {
        if (isFolder && !open) toggle(row.node.id, true)
        else if (isFolder) focus(rows[at + 1]?.node.id)
      },
      ArrowLeft: () => {
        if (isFolder && open) toggle(row.node.id, false)
        else focus(row.parent)
      },
      Enter: () => (isFolder ? toggle(row.node.id) : onSelect?.(row.node.id, row.node)),
      " ": () => (isFolder ? toggle(row.node.id) : onSelect?.(row.node.id, row.node)),
    }
    const action = keys[event.key]
    if (!action) return
    event.preventDefault()
    action()
  }

  return (
    <div
      role="tree"
      aria-label={label}
      data-slot="file-tree"
      onKeyDown={onKeyDown}
      className={cn("flex flex-col gap-px text-body", className)}
      {...props}
    >
      {rows.map(({ node, depth }) => {
        const isFolder = Boolean(node.children)
        const open = isFolder && expanded.has(node.id)
        const isSelected = node.id === selected
        const Chevron = open ? icons.expand : icons.next
        return (
          <div
            key={node.id}
            ref={element => {
              if (element) refs.current.set(node.id, element)
              else refs.current.delete(node.id)
            }}
            role="treeitem"
            aria-level={depth + 1}
            aria-expanded={isFolder ? open : undefined}
            aria-selected={isFolder ? undefined : isSelected}
            tabIndex={node.id === current ? 0 : -1}
            data-slot="file-tree-item"
            data-id={node.id}
            onFocus={() => setFocused(node.id)}
            onClick={() => (isFolder ? toggle(node.id) : onSelect?.(node.id, node))}
            style={{ "--depth": depth } as React.CSSProperties}
            className={cn(
              "group/row relative flex min-h-8 cursor-default items-center gap-1.5 rounded-lg pr-2 pl-[calc(var(--depth)*1.25rem+0.5rem)] outline-none select-none",
              "text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              "focus-visible:ring-2 focus-visible:ring-ring/40",
              "aria-selected:bg-foreground/8 aria-selected:font-medium aria-selected:text-foreground"
            )}
          >
            {/* One guide line per ancestor folder, at the column its chevron sits in. */}
            {Array.from({ length: depth }, (_, level) => (
              <span
                key={level}
                aria-hidden="true"
                style={{ left: `calc(${level} * 1.25rem + 1.05rem)` }}
                className="absolute inset-y-0 w-px bg-border"
              />
            ))}
            {isFolder ? (
              <Chevron aria-hidden="true" className="size-icon-sm shrink-0 text-muted-foreground" />
            ) : (
              <span aria-hidden="true" className="w-1 shrink-0" />
            )}
            <span className={cn("truncate", isFolder && "text-foreground")}>{node.name}</span>
          </div>
        )
      })}
    </div>
  )
}

/** The side panel a tree lives in: a toned column with its controls on top. */
function FileTreePanel({ className, ...props }: React.ComponentProps<"aside">) {
  return (
    <aside
      data-slot="file-tree-panel"
      className={cn("flex min-h-0 flex-col bg-sidebar text-sidebar-foreground", className)}
      {...props}
    />
  )
}

/** The panel's top bar: one icon per view (files, search, bookmarks), the open one on a tone. */
function FileTreeTabs({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="tablist"
      data-slot="file-tree-tabs"
      className={cn("flex items-center gap-1 border-b border-sidebar-border p-2", className)}
      {...props}
    />
  )
}

function FileTreeTab({
  active,
  className,
  ...props
}: React.ComponentProps<"button"> & { active?: boolean }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      data-slot="file-tree-tab"
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors outline-none",
        "hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40",
        "aria-selected:bg-muted aria-selected:text-foreground [&_svg:not([class*='size-'])]:size-icon",
        className
      )}
      {...props}
    />
  )
}

/** A row of quiet icon actions under the tabs: new note, new folder, sort, collapse all. */
function FileTreeToolbar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="toolbar"
      data-slot="file-tree-toolbar"
      className={cn(
        "flex items-center gap-1 px-2 pt-2 pb-1",
        "[&_button]:inline-flex [&_button]:size-8 [&_button]:items-center [&_button]:justify-center [&_button]:rounded-lg",
        "[&_button]:text-muted-foreground [&_button]:transition-colors [&_button:hover]:bg-muted [&_button:hover]:text-foreground",
        "[&_svg:not([class*='size-'])]:size-icon",
        className
      )}
      {...props}
    />
  )
}

export { FileTree, FileTreePanel, FileTreeTabs, FileTreeTab, FileTreeToolbar }
