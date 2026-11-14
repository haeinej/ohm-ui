// One page per registry item. Descriptions come from registry.json, so the gallery and the
// registry say the same thing. A new item needs an entry in PAGES and a place in SECTIONS.
import {AssistantRuntimeProvider} from '@assistant-ui/react';
import {useMemo, useState, type ComponentType, type ReactNode} from 'react';
import {Link} from '@tanstack/react-router';
import registry from '../registry.json';
import {icons, iconGroups, type IconName} from '@/registry/ohm/lib/icons';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/registry/ohm/ui/accordion';
import {Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount} from '@/registry/ohm/ui/avatar';
import {Badge} from '@/registry/ohm/ui/badge';
import {Button} from '@/registry/ohm/ui/button';
import {ButtonGroup} from '@/registry/ohm/ui/button-group';
import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/registry/ohm/ui/card';
import {Checkbox} from '@/registry/ohm/ui/checkbox';
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from '@/registry/ohm/ui/collapsible';
import {Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from '@/registry/ohm/ui/dialog';
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger,
} from '@/registry/ohm/ui/dropdown-menu';
import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from '@/registry/ohm/ui/empty';
import {Field, FieldDescription, FieldLabel} from '@/registry/ohm/ui/field';
import {FileTree, FileTreePanel, FileTreeTab, FileTreeTabs, FileTreeToolbar, type FileTreeNode} from '@/registry/ohm/ui/file-tree';
import {HoverCard, HoverCardContent, HoverCardTrigger} from '@/registry/ohm/ui/hover-card';
import {Icon} from '@/registry/ohm/ui/icon';
import {Input} from '@/registry/ohm/ui/input';
import {InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput} from '@/registry/ohm/ui/input-group';
import {Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle} from '@/registry/ohm/ui/item';
import {Kbd, KbdGroup} from '@/registry/ohm/ui/kbd';
import {Label} from '@/registry/ohm/ui/label';
import {NativeSelect, NativeSelectOption} from '@/registry/ohm/ui/native-select';
import {notify} from '@/registry/ohm/ui/notice';
import {
  Panel, PanelAction, PanelContent, PanelDescription, PanelFooter, PanelGroup, PanelHeader, PanelItem, PanelLabel,
  PanelSeparator, PanelTitle,
} from '@/registry/ohm/ui/panel';
import {Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger} from '@/registry/ohm/ui/popover';
import {Progress} from '@/registry/ohm/ui/progress';
import {LoadingBar, LoadingDot} from '@/registry/ohm/ui/screen';
import {ScrollArea} from '@/registry/ohm/ui/scroll-area';
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from '@/registry/ohm/ui/select';
import {Separator} from '@/registry/ohm/ui/separator';
import {Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger} from '@/registry/ohm/ui/sheet';
import {Skeleton} from '@/registry/ohm/ui/skeleton';
import {Switch} from '@/registry/ohm/ui/switch';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/registry/ohm/ui/tabs';
import {Textarea} from '@/registry/ohm/ui/textarea';
import {Toggle} from '@/registry/ohm/ui/toggle';
import {ToggleGroup, ToggleGroupItem} from '@/registry/ohm/ui/toggle-group';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/registry/ohm/ui/tooltip';
import {Thread} from '@/registry/ohm/assistant/thread';
import {useDemoRuntime} from './demo-runtime';

const described = Object.fromEntries(registry.items.map(item => [item.name, item.description]));

// ---- page furniture ----

function Example({title, children, className, backdrop}: {title?: string; children: ReactNode; className?: string; backdrop?: boolean}) {
  return <section className="flex flex-col gap-3">
    {title && <h3>{title}</h3>}
    <div className={`relative flex min-h-40 flex-wrap items-center justify-center gap-4 overflow-hidden rounded-3xl p-5 sm:p-8 ${backdrop ? '' : 'bg-muted dark:bg-(--ohm-panel)'} ${className ?? ''}`}>
      {backdrop && <Backdrop/>}
      {children}
    </div>
  </section>;
}

/** Something for glass to blur: the brand atmosphere with a few shapes and words over it. */
function Backdrop() {
  return <div aria-hidden="true" className="absolute inset-0 -z-0">
    <div className="ohm-atmosphere"/>
    <div className="absolute top-6 left-6 size-14 rounded-full sm:left-10 sm:size-28 bg-(--ohm-green-light)"/>
    <div className="absolute right-6 bottom-6 size-16 rounded-full sm:right-12 sm:size-36 bg-(--ohm-red)"/>
    <p className="absolute bottom-8 left-8 hidden font-serif sm:block text-[64px] leading-none text-(--ohm-on-accent)">ohm</p>
  </div>;
}

// ---- foundations ----

const SWATCHES = [
  ['paper', 'The page'], ['menu', 'Menus, sidebar'], ['wash', 'Hover, muted fill'], ['line', 'Hairlines'],
  ['muted', 'Secondary text'], ['ink', 'Text'], ['forest', 'The one green'], ['accent-fill', 'Primary action'],
  ['green-light', 'Live, done, positive'], ['red', 'Destructive, failed'], ['ebony', 'Atmosphere'],
] as const;

function ColorPage() {
  return <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
    {SWATCHES.map(([name, job]) => <div key={name} className="flex flex-col gap-2">
      <div className="h-20 rounded-2xl shade-1" style={{background: `var(--ohm-${name})`}}/>
      <div className="flex flex-col">
        <code className="font-mono text-small">--ohm-{name}</code>
        <span className="text-small text-muted-foreground">{job}</span>
      </div>
    </div>)}
  </div>;
}

function TypePage() {
  const rows: [string, ReactNode][] = [
    ['h1 · Coconat 400', <h1>Display title</h1>],
    ['h2 · Coconat 400', <h2>Section title</h2>],
    ['h3 · Helvetica Neue 600', <h3>Group label</h3>],
    ['body · Helvetica Neue 400', <p className="text-body">Text and controls. The quick brown fox jumps over the lazy dog.</p>],
    ['small · Helvetica Neue 400', <p className="text-small text-muted-foreground">Metadata, timestamps, hints.</p>],
    ['mono', <code className="font-mono text-small">npx shadcn add @ohm/panel</code>],
  ];
  return <div className="flex flex-col">
    {rows.map(([role, sample]) => <div key={role} className="grid grid-cols-[200px_1fr] items-baseline gap-6 py-4">
      <span className="text-small text-muted-foreground">{role}</span>{sample}
    </div>)}
  </div>;
}

function DepthPage() {
  return <div className="flex flex-col gap-10">
    <Example title="Shade" className="gap-6 bg-background">
      {[1, 2, 3, 4, 5].map(step => <div key={step} className={`flex size-32 flex-col justify-end rounded-2xl bg-card p-3 shade-${step}`}>
        <code className="font-mono text-small">shade-{step}</code>
        <span className="text-small text-muted-foreground">{['Rows, chips', 'Cards', 'Menus, popovers', 'Panels, sheets', 'Dialogs, windows'][step - 1]}</span>
      </div>)}
    </Example>
    <p className="max-w-[60ch] text-body text-muted-foreground">
      Every step is a contact shadow and an ambient one, from a single light above, with a 1px inset edge so the surface reads on any background. Tailwind's <code className="font-mono">shadow-xs</code> … <code className="font-mono">shadow-xl</code> map to the same steps, so shadcn components get them too.
    </p>
  </div>;
}

function FrostPage() {
  const materials = ['frost-thin', 'frost', 'frost-thick', 'tint'] as const;
  return <div className="flex flex-col gap-10">
    <Example title="Materials" backdrop className="min-h-80">
      {materials.map(material => <Panel key={material} material={material} elevation="3" className="relative w-44">
        <PanelHeader><PanelTitle>{material}</PanelTitle></PanelHeader>
        <PanelContent className="text-small text-muted-foreground">Blur {material === 'frost-thin' ? '12' : material === 'frost-thick' ? '40' : '24'}px, saturated.</PanelContent>
      </Panel>)}
    </Example>
    <Example title="A floating toolbar" backdrop className="min-h-64">
      <Panel material="frost" elevation="4" size="sm" className="relative flex-row items-center">
        {(['edit', 'image', 'link', 'code', 'quote'] as const).map(name => <Button key={name} variant="ghost" size="icon" aria-label={name}><Icon icon={icons[name]}/></Button>)}
        <Separator orientation="vertical" className="mx-1 h-6"/>
        <Button className="rounded-full">Publish</Button>
      </Panel>
    </Example>
    <p className="max-w-[60ch] text-body text-muted-foreground">
      Glass needs something behind it. Use it for surfaces that float over content: toolbars, headers over a scrolling page, panels over imagery. Without blur support, or when someone asks for less transparency, it turns solid.
    </p>
  </div>;
}

function IconsPage() {
  const [query, setQuery] = useState('');
  const groups = useMemo(() => Object.entries(iconGroups).map(([group, set]) =>
    [group, Object.keys(set).filter(name => name.toLowerCase().includes(query.toLowerCase()))] as const)
    .filter(([, names]) => names.length), [query]);
  return <div className="flex flex-col gap-8">
    <InputGroup className="max-w-xs">
      <InputGroupAddon><Icon icon={icons.search}/></InputGroupAddon>
      <InputGroupInput placeholder="Search icons" value={query} onChange={event => setQuery(event.target.value)}/>
    </InputGroup>
    <div className="flex flex-wrap items-end gap-6">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => <div key={size} className="flex flex-col items-center gap-2">
        <Icon icon={icons.community} size={size}/><code className="font-mono text-small text-muted-foreground">{size}</code>
      </div>)}
    </div>
    {groups.map(([group, names]) => <section key={group} className="flex flex-col gap-3">
      <h3 className="capitalize">{group}</h3>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-2">
        {names.map(name => <button key={name} type="button"
          onClick={() => { navigator.clipboard.writeText(`icons.${name}`); notify({tone: 'info', message: `Copied icons.${name}`}); }}
          className="flex flex-col items-center gap-2 rounded-2xl py-4 text-small text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Icon icon={icons[name as IconName]} size="lg" className="text-foreground"/>{name}
        </button>)}
      </div>
    </section>)}
  </div>;
}


// ---- files ----

const leaf = (folder: string, names: string[]): FileTreeNode[] => names.map(name => ({id: `${folder}/${name}`, name}));
const TREE: FileTreeNode[] = [
  {id: '00-system', name: '00-system', children: leaf('00-system', [
    '1. general prompt for using sources', 'assistant-brain', 'assistant-persona', 'fetch-and-ingest-plan', 'linking-model',
    'next-actions', 'templates-claim', 'templates-concept', 'templates-method', 'templates-source-note',
  ])},
  {id: '01-inbox', name: '01-inbox', children: []},
  {id: '02-source-registry', name: '02-source-registry', children: [
    {id: '02-source-registry/session-materials', name: 'session-materials', children: leaf('session-materials', ['week-1', 'week-2'])},
    {id: '02-source-registry/whitepapers', name: 'whitepapers', children: leaf('whitepapers', [
      'README', 'whitepaper-index', 'wp--conformity-analyzed', 'wp--field-study---2018-', 'wp--field-study---2018--a41c07',
      'wp--of-the-student-writing-the-hypothesis-and-the-method', 'wp-1--each-student-should-upload-their-final-draft',
      'wp-a-brief-guide-to-persuasion', 'wp-a-useful-concept-for-understanding-change',
    ])},
  ]},
  {id: '03-notes', name: '03-notes', children: leaf('03-notes', ['claims', 'concepts'])},
];

function FilesPage() {
  const [view, setView] = useState<'files' | 'search' | 'bookmarks'>('files');
  const [selected, setSelected] = useState<string | null>('whitepapers/wp--field-study---2018--a41c07');
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(['00-system', '02-source-registry', '02-source-registry/whitepapers']));
  return <div className="flex flex-col gap-10">
    <Example title="A file lookup panel" className="items-stretch justify-start p-6">
      <FileTreePanel className="h-[640px] w-80 overflow-hidden rounded-2xl shade-2">
        <FileTreeTabs aria-label="Views">
          <FileTreeTab active={view === 'files'} onClick={() => setView('files')} aria-label="Files"><Icon icon={icons.files}/></FileTreeTab>
          <FileTreeTab active={view === 'search'} onClick={() => setView('search')} aria-label="Search"><Icon icon={icons.search}/></FileTreeTab>
          <FileTreeTab active={view === 'bookmarks'} onClick={() => setView('bookmarks')} aria-label="Bookmarks"><Icon icon={icons.bookmark}/></FileTreeTab>
        </FileTreeTabs>
        <FileTreeToolbar aria-label="File actions">
          <button type="button" aria-label="New note"><Icon icon={icons.write}/></button>
          <button type="button" aria-label="New folder"><Icon icon={icons.newFolder}/></button>
          <button type="button" aria-label="Sort"><Icon icon={icons.sort}/></button>
          <button type="button" aria-label="Layout"><Icon icon={icons.layout}/></button>
          <button type="button" aria-label="Collapse all" onClick={() => setExpanded(new Set())}><Icon icon={icons.collapseAll}/></button>
        </FileTreeToolbar>
        <ScrollArea className="min-h-0 flex-1">
          <FileTree className="px-2 pb-3" nodes={TREE} selected={selected} onSelect={setSelected} expanded={expanded} onExpandedChange={setExpanded}/>
        </ScrollArea>
      </FileTreePanel>
    </Example>
  </div>;
}

// ---- components ----

function QuickActions() {
  return <ButtonGroup>
    <Button variant="secondary">Button Group</Button>
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="secondary" size="icon" aria-label="More actions"><Icon icon={icons.collapse}/></Button>}/>
      <DropdownMenuContent side="top" align="end" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
          <DropdownMenuItem>Mute Conversation</DropdownMenuItem>
          <DropdownMenuItem>Mark as Read</DropdownMenuItem>
          <DropdownMenuItem>Block User</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator/>
        <DropdownMenuItem variant="destructive">Delete Conversation</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </ButtonGroup>;
}

function SupportPanel({material = 'solid' as const}: {material?: 'solid' | 'frost' | 'frost-thick'}) {
  const [active, setActive] = useState('docs');
  const rows = [['help', 'Help Center'], ['docs', 'Docs'], ['contact', 'Contact Us'], ['status', 'Status'], ['community', 'Community']] as const;
  return <Panel material={material} elevation="3" className="relative w-64">
    <PanelGroup>
      <PanelLabel>Support</PanelLabel>
      {rows.map(([name, label]) => <PanelItem key={name} active={active === name} onClick={() => setActive(name)}>
        <Icon icon={icons[name]}/>{label}
      </PanelItem>)}
    </PanelGroup>
  </Panel>;
}

function PanelPage() {
  return <div className="flex flex-col gap-10">
    <Example title="Navigation"><SupportPanel/></Example>
    <Example title="Settings">
      <Panel size="lg" elevation="3" className="w-full max-w-sm">
        <PanelHeader>
          <PanelTitle>Notifications</PanelTitle>
          <PanelDescription>Choose what reaches you.</PanelDescription>
          <PanelAction><Button variant="ghost" size="icon-sm" aria-label="Close"><Icon icon={icons.close}/></Button></PanelAction>
        </PanelHeader>
        <PanelContent className="flex flex-col gap-3">
          {['Replies to you', 'Mentions', 'Weekly summary'].map((label, at) => <div key={label} className="flex items-center justify-between gap-4">
            <Label htmlFor={`n-${at}`}>{label}</Label><Switch id={`n-${at}`} defaultChecked={at < 2}/>
          </div>)}
        </PanelContent>
        <PanelSeparator/>
        <PanelFooter className="justify-end"><Button variant="ghost">Cancel</Button><Button>Save</Button></PanelFooter>
      </Panel>
    </Example>
    <Example title="Elevation" className="gap-6 bg-background">
      {(['0', '1', '2', '3', '4', '5'] as const).map(step => <Panel key={step} elevation={step} className="size-28 justify-end">
        <PanelContent><code className="font-mono text-small">elevation {step}</code></PanelContent>
      </Panel>)}
    </Example>
    <Example title="Over content" backdrop className="min-h-96"><SupportPanel material="frost"/></Example>
  </div>;
}

function ButtonPage() {
  return <div className="flex flex-col gap-10">
    <Example title="Variants">
      <Button>Default</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button><Button variant="destructive">Destructive</Button><Button variant="link">Link</Button>
    </Example>
    <Example title="Sizes and icons">
      <Button size="xs">Extra small</Button><Button size="sm">Small</Button><Button>Default</Button><Button size="lg">Large</Button>
      <Button size="icon" aria-label="Add"><Icon icon={icons.add}/></Button>
      <Button variant="outline"><Icon icon={icons.upload}/>Upload</Button>
      <Button disabled>Disabled</Button>
    </Example>
  </div>;
}

function ButtonGroupPage() {
  return <div className="flex flex-col gap-10">
    <Example title="With a menu" className="min-h-56 items-end sm:min-h-72"><QuickActions/></Example>
    <Example title="Segments">
      <ButtonGroup><Button variant="outline">Day</Button><Button variant="outline">Week</Button><Button variant="outline">Month</Button></ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon" aria-label="Previous"><Icon icon={icons.back}/></Button>
        <Button variant="outline" size="icon" aria-label="Next"><Icon icon={icons.forward}/></Button>
      </ButtonGroup>
    </Example>
  </div>;
}

function MenuPage() {
  const [pinned, setPinned] = useState(true);
  return <div className="flex flex-col gap-10">
    <Example title="Quick actions" className="min-h-80 items-start">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline">Open menu</Button>}/>
        <DropdownMenuContent className="w-60">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
            <DropdownMenuItem><Icon icon={icons.mute}/>Mute Conversation</DropdownMenuItem>
            <DropdownMenuItem><Icon icon={icons.read}/>Mark as Read<DropdownMenuShortcut>⌘R</DropdownMenuShortcut></DropdownMenuItem>
            <DropdownMenuCheckboxItem checked={pinned} onCheckedChange={setPinned}>Pinned</DropdownMenuCheckboxItem>
            <DropdownMenuItem><Icon icon={icons.block}/>Block User</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator/>
          <DropdownMenuItem variant="destructive"><Icon icon={icons.delete}/>Delete Conversation</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Example>
  </div>;
}

function OverlaysPage() {
  return <div className="flex flex-col gap-10">
    <Example title="Popover">
      <Popover>
        <PopoverTrigger render={<Button variant="outline">Share</Button>}/>
        <PopoverContent>
          <PopoverHeader><PopoverTitle>Share this post</PopoverTitle><PopoverDescription>Anyone with the link can read it.</PopoverDescription></PopoverHeader>
          <InputGroup>
            <InputGroupInput readOnly value="ohm.example/p/3m5k2x"/>
            <InputGroupAddon align="inline-end"><InputGroupButton aria-label="Copy link"><Icon icon={icons.copy}/></InputGroupButton></InputGroupAddon>
          </InputGroup>
        </PopoverContent>
      </Popover>
    </Example>
    <Example title="Tooltip">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="Help"><Icon icon={icons.help}/></Button>}/>
        <TooltipContent>Help Center</TooltipContent>
      </Tooltip>
    </Example>
    <Example title="Hover card">
      <HoverCard>
        <HoverCardTrigger render={<Button variant="link">@ohm</Button>}/>
        <HoverCardContent className="w-64">
          <div className="flex gap-3"><Avatar><AvatarFallback>OH</AvatarFallback></Avatar>
            <div className="flex flex-col"><span className="font-medium">ohm</span><span className="text-small text-muted-foreground">A home for what you make.</span></div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </Example>
    <Example title="Dialog">
      <Dialog>
        <DialogTrigger render={<Button variant="outline">Make public</Button>}/>
        <DialogContent>
          <DialogHeader><DialogTitle>Make this public?</DialogTitle><DialogDescription>Everyone will be able to read it once it is published.</DialogDescription></DialogHeader>
          <DialogFooter><DialogClose render={<Button variant="outline">Cancel</Button>}/><DialogClose render={<Button>Make public</Button>}/></DialogFooter>
        </DialogContent>
      </Dialog>
    </Example>
    <Example title="Sheet">
      <Sheet>
        <SheetTrigger render={<Button variant="outline">Open sheet</Button>}/>
        <SheetContent>
          <SheetHeader><SheetTitle>Filters</SheetTitle><SheetDescription>Narrow what the list shows.</SheetDescription></SheetHeader>
          <div className="flex flex-col gap-3 px-4">
            {['Public', 'Friends', 'Private'].map(label => <div key={label} className="flex items-center gap-2"><Checkbox id={`f-${label}`} defaultChecked/><Label htmlFor={`f-${label}`}>{label}</Label></div>)}
          </div>
          <SheetFooter><SheetClose render={<Button>Apply</Button>}/></SheetFooter>
        </SheetContent>
      </Sheet>
    </Example>
  </div>;
}

function FormsPage() {
  return <div className="flex flex-col gap-10">
    <Example title="Fields" className="justify-start">
      <div className="grid w-full max-w-xs gap-5">
        <Field><FieldLabel htmlFor="g-name">Name</FieldLabel><Input id="g-name" placeholder="Your name"/><FieldDescription>Shown on your profile.</FieldDescription></Field>
        <Field><FieldLabel htmlFor="g-note">Note</FieldLabel><Textarea id="g-note" placeholder="Write something"/></Field>
        <Field>
          <FieldLabel>Visibility</FieldLabel>
          <div><Select defaultValue="private" items={{public: 'Public', friends: 'Friends', private: 'Private'}}>
            <SelectTrigger className="w-40"><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectGroup><SelectLabel>Who can read it</SelectLabel>
                <SelectItem value="public">Public</SelectItem><SelectItem value="friends">Friends</SelectItem><SelectItem value="private">Private</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select></div>
        </Field>
        <Field><FieldLabel htmlFor="g-native">Native select</FieldLabel>
          <div><NativeSelect id="g-native" defaultValue="writing" className="w-40"><NativeSelectOption value="writing">Writing</NativeSelectOption><NativeSelectOption value="photos">Photos</NativeSelectOption></NativeSelect></div>
        </Field>
        <InputGroup>
          <InputGroupAddon><Icon icon={icons.search}/></InputGroupAddon>
          <InputGroupInput placeholder="Search your vault"/>
          <InputGroupAddon align="inline-end"><Kbd>⌘K</Kbd></InputGroupAddon>
        </InputGroup>
      </div>
    </Example>
    <Example title="Choices">
      <div className="flex items-center gap-2"><Checkbox id="g-check" defaultChecked/><Label htmlFor="g-check">Keep a copy</Label></div>
      <div className="flex items-center gap-2"><Switch id="g-switch"/><Label htmlFor="g-switch">Notify me</Label></div>
      <Toggle aria-label="Bookmark"><Icon icon={icons.bookmark}/></Toggle>
      <ToggleGroup defaultValue={['list']}>
        <ToggleGroupItem value="list" aria-label="List"><Icon icon={icons.list}/></ToggleGroupItem>
        <ToggleGroupItem value="grid" aria-label="Images"><Icon icon={icons.image}/></ToggleGroupItem>
      </ToggleGroup>
    </Example>
  </div>;
}

function DisplayPage() {
  return <div className="flex flex-col gap-10">
    <Example title="Card" className="justify-start">
      <Card className="w-full max-w-xs">
        <CardHeader><CardTitle>Collisions</CardTitle><CardDescription>Four essays, 2024</CardDescription>
          <CardAction><Badge variant="secondary">Series</Badge></CardAction></CardHeader>
        <CardContent className="text-body text-muted-foreground">Essays about what happens when two ways of living meet.</CardContent>
        <CardFooter><Button variant="outline" className="w-full">Read</Button></CardFooter>
      </Card>
    </Example>
    <Example title="Item" className="justify-start">
      <ItemGroup className="w-full max-w-sm">
        {[['docs', 'Writings', '12 posts'], ['image', 'Photographs', '48 posts'], ['code', 'Things I make', '6 posts']].map(([icon, title, detail]) =>
          <Item key={title} variant="outline">
            <ItemMedia variant="icon"><Icon icon={icons[icon as IconName]}/></ItemMedia>
            <ItemContent><ItemTitle>{title}</ItemTitle><ItemDescription>{detail}</ItemDescription></ItemContent>
            <ItemActions><Button variant="ghost" size="icon-sm" aria-label="More"><Icon icon={icons.more}/></Button></ItemActions>
          </Item>)}
      </ItemGroup>
    </Example>
    <Example title="Badge, avatar, kbd">
      <Badge>Public</Badge><Badge variant="secondary">Friends</Badge><Badge variant="outline">Private</Badge><Badge variant="destructive">Failed</Badge>
      <AvatarGroup><Avatar><AvatarFallback>HJ</AvatarFallback></Avatar><Avatar><AvatarFallback>MK</AvatarFallback></Avatar><AvatarGroupCount>+3</AvatarGroupCount></AvatarGroup>
      <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
    </Example>
    <Example title="Tabs">
      <Tabs defaultValue="all" className="w-full max-w-sm">
        <TabsList><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="public">Public</TabsTrigger><TabsTrigger value="private">Private</TabsTrigger></TabsList>
        <TabsContent value="all" className="pt-3 text-body text-muted-foreground">Everything in the vault.</TabsContent>
        <TabsContent value="public" className="pt-3 text-body text-muted-foreground">What everyone can read.</TabsContent>
        <TabsContent value="private" className="pt-3 text-body text-muted-foreground">Only you.</TabsContent>
      </Tabs>
    </Example>
    <Example title="Accordion and collapsible" className="justify-start">
      <Accordion defaultValue={['a']} className="w-full max-w-sm">
        <AccordionItem value="a"><AccordionTrigger>What is a label?</AccordionTrigger><AccordionContent>The section of your site a post sits in, in your own words.</AccordionContent></AccordionItem>
        <AccordionItem value="b"><AccordionTrigger>Who can see a private post?</AccordionTrigger><AccordionContent>Only you.</AccordionContent></AccordionItem>
      </Accordion>
      <Collapsible className="w-full max-w-sm">
        <CollapsibleTrigger render={<Button variant="ghost"><Icon icon={icons.expand}/>Show details</Button>}/>
        <CollapsibleContent className="px-3 pt-2 text-body text-muted-foreground">Saved two minutes ago. Not published.</CollapsibleContent>
      </Collapsible>
    </Example>
    <Example title="Scroll area" className="justify-start">
      <ScrollArea className="h-48 w-full max-w-xs rounded-2xl bg-card shade-1">
        <div className="flex flex-col p-3">{Array.from({length: 24}, (_, at) => <span key={at} className="py-1.5 text-body">Post {at + 1}</span>)}</div>
      </ScrollArea>
    </Example>
  </div>;
}

function FeedbackPage() {
  return <div className="flex flex-col gap-10">
    <Example title="Notice"><Button variant="outline" onClick={() => notify({tone: 'info', message: 'Saved. It is private.'})}>Show a notice</Button>
      <Button variant="outline" onClick={() => notify({message: 'Could not save. Try again.'})}>Show an error</Button></Example>
    <Example title="Progress and loading" className="flex-col">
      <Progress value={64} className="w-full max-w-sm"/><Progress value={null} className="w-full max-w-sm"/><LoadingBar/><LoadingDot/>
    </Example>
    <Example title="Empty">
      <Empty>
        <EmptyHeader><EmptyMedia variant="icon"><Icon icon={icons.folder}/></EmptyMedia><EmptyTitle>Nothing here yet</EmptyTitle>
          <EmptyDescription>Posts you file under this label appear here.</EmptyDescription></EmptyHeader>
        <EmptyContent><Button><Icon icon={icons.add}/>New post</Button></EmptyContent>
      </Empty>
    </Example>
    <Example title="Skeleton" className="justify-start">
      <div className="flex w-full max-w-sm items-center gap-3"><Skeleton className="size-10 rounded-full"/><div className="flex flex-1 flex-col gap-2"><Skeleton className="h-4 w-3/4"/><Skeleton className="h-4 w-1/2"/></div></div>
    </Example>
  </div>;
}

function ThreadPage() {
  const runtime = useDemoRuntime();
  return <div className="h-[560px] overflow-hidden rounded-3xl shade-3">
    <AssistantRuntimeProvider runtime={runtime}><Thread/></AssistantRuntimeProvider>
  </div>;
}

function OverviewPage() {
  return <div className="flex flex-col gap-10">
    <Example backdrop className="min-h-96 gap-8">
      <SupportPanel material="frost"/>
      <div className="relative flex flex-col items-center gap-6"><QuickActions/></div>
    </Example>
    <div className="grid gap-4 sm:grid-cols-3">
      {[['Foundations', 'Colour, type, shade, frost and icons, as tokens.', 'color'], ['Components', 'shadcn’s Maia style on Base UI, in ohm’s type and colour.', 'panel'], ['Assistant', 'Chat and agent interface, on assistant-ui.', 'thread']].map(([title, text, href]) =>
        <Link key={title} to="/$page" params={{page: href as PageId}} className="rounded-3xl bg-card p-5 shade-2 transition-shadow hover:shade-3">
          <h3>{title}</h3><p className="pt-1 text-body text-muted-foreground">{text}</p>
        </Link>)}
    </div>
  </div>;
}

// ---- the table of contents ----

type Page = {title: string; section: string; Page: ComponentType; description?: string; install?: string};
const page = (title: string, section: string, Page: ComponentType, install?: string, description?: string): Page =>
  ({title, section, Page, install, description: description ?? (install ? described[install] : undefined)});

export const PAGES = {
  overview: page('ohm design system', 'Start', OverviewPage, undefined, 'Foundations, components and agent interface for ohm. Light by default. Every item installs with the shadcn CLI.'),
  color: page('Colour', 'Foundations', ColorPage, undefined, 'One neutral set, the forest green, a light green and a red, and a few surfaces with one job each.'),
  type: page('Type', 'Foundations', TypePage, undefined, 'Coconat for display titles only. Everything else is Helvetica Neue in five roles.'),
  depth: page('Shade', 'Foundations', DepthPage, undefined, 'Five steps of elevation from one light source.'),
  frost: page('Frost glass', 'Foundations', FrostPage, undefined, 'Translucent materials over a blurred, saturated backdrop, each with its own edge and catch-light.'),
  icons: page('Icons', 'Foundations', IconsPage, 'icons'),
  panel: page('Panel', 'Components', PanelPage, 'panel'),
  files: page('File tree', 'Components', FilesPage, 'file-tree'),
  menu: page('Dropdown menu', 'Components', MenuPage, 'dropdown-menu'),
  'button-group': page('Button group', 'Components', ButtonGroupPage, 'button-group'),
  button: page('Button', 'Components', ButtonPage, 'button'),
  overlays: page('Overlays', 'Components', OverlaysPage, undefined, 'Popover, tooltip, hover card, dialog and sheet: frosted in light, solid and still in dark.'),
  forms: page('Forms', 'Components', FormsPage, undefined, 'Field, input, input group, textarea, select, checkbox, switch, toggle.'),
  display: page('Display', 'Components', DisplayPage, undefined, 'Card, item, badge, avatar, kbd, tabs, accordion, collapsible, scroll area.'),
  feedback: page('Feedback', 'Components', FeedbackPage, undefined, 'Notice, progress, loading, empty states and skeletons.'),
  thread: page('Thread', 'Assistant', ThreadPage, 'thread'),
} satisfies Record<string, Page>;
export type PageId = keyof typeof PAGES;

export const SECTIONS: {title: string; pages: PageId[]}[] = [
  {title: 'Start', pages: ['overview']},
  {title: 'Foundations', pages: ['color', 'type', 'depth', 'frost', 'icons']},
  {title: 'Components', pages: ['panel', 'files', 'menu', 'button-group', 'button', 'overlays', 'forms', 'display', 'feedback']},
  {title: 'Assistant', pages: ['thread']},
];
