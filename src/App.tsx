// The gallery: every registry item, rendered from source. Add a section when you add an item.
import {AssistantRuntimeProvider} from '@assistant-ui/react';
import {useState, type ReactNode} from 'react';
import {MoonIcon, PlusIcon, SunIcon} from 'lucide-react';
import {Button} from '@/registry/ohm/ui/button';
import {Checkbox} from '@/registry/ohm/ui/checkbox';
import {Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from '@/registry/ohm/ui/dialog';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger} from '@/registry/ohm/ui/dropdown-menu';
import {Field, FieldDescription, FieldLabel} from '@/registry/ohm/ui/field';
import {HoverCard, HoverCardContent, HoverCardTrigger} from '@/registry/ohm/ui/hover-card';
import {Input} from '@/registry/ohm/ui/input';
import {Label} from '@/registry/ohm/ui/label';
import {NativeSelect, NativeSelectOption} from '@/registry/ohm/ui/native-select';
import {Notices, notify} from '@/registry/ohm/ui/notice';
import {Progress} from '@/registry/ohm/ui/progress';
import {LoadingBar} from '@/registry/ohm/ui/screen';
import {Separator} from '@/registry/ohm/ui/separator';
import {Switch} from '@/registry/ohm/ui/switch';
import {Textarea} from '@/registry/ohm/ui/textarea';
import {Thread} from '@/registry/ohm/assistant/thread';
import {useDemoRuntime} from './demo-runtime';

const SWATCHES = ['paper', 'ink', 'muted', 'wash', 'line', 'accent', 'accent-fill', 'forest', 'leaf', 'signal', 'agent', 'danger', 'ebony'];

function Section({id, title, children}: {id: string; title: string; children: ReactNode}) {
  return <section id={id} className="flex flex-col gap-4 py-8">
    <h3 className="text-h3">{title}</h3>
    {children}
  </section>;
}

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);
  const runtime = useDemoRuntime();
  return <div data-theme={theme ?? undefined} className="min-h-dvh bg-background text-foreground">
    <Notices/>
    <main className="mx-auto flex max-w-[880px] flex-col px-6 py-12">
      <header className="flex items-end justify-between gap-4 pb-8">
        <div>
          <h1>ohm ui</h1>
          <p className="text-muted-foreground">Foundations, components and assistant parts. Every item here is in the registry.</p>
        </div>
        <Button variant="ghost" size="icon" aria-label="Switch light and dark"
          onClick={() => setTheme(t => (t ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <SunIcon/> : <MoonIcon/>}
        </Button>
      </header>

      <Section id="type" title="Type">
        <h1>Display, Coconat</h1>
        <h2>Title, Coconat</h2>
        <h3>Section, Helvetica Neue 600</h3>
        <p className="text-body">Body. Text and controls, Helvetica Neue 400.</p>
        <p className="text-small text-muted-foreground">Small. Metadata, timestamps, hints.</p>
        <code className="font-mono text-small">ui-monospace for code</code>
      </Section>

      <Section id="color" title="Color">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
          {SWATCHES.map(name => <div key={name} className="flex flex-col gap-1.5">
            <div className="h-12 rounded-field shadow-(--ohm-float-shadow)" style={{background: `var(--ohm-${name})`}}/>
            <code className="text-small text-muted-foreground">--ohm-{name}</code>
          </div>)}
        </div>
      </Section>

      <Section id="button" title="Button">
        <div className="flex flex-wrap items-center gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button size="icon" aria-label="Add"><PlusIcon/></Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Section>

      <Section id="field" title="Field, input, textarea, select">
        <div className="grid max-w-[420px] gap-4">
          <Field>
            <FieldLabel htmlFor="g-name">Name</FieldLabel>
            <Input id="g-name" placeholder="Your name"/>
            <FieldDescription>Shown on your profile.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="g-note">Note</FieldLabel>
            <Textarea id="g-note" placeholder="Write something"/>
          </Field>
          <Field>
            <FieldLabel htmlFor="g-vis">Visibility</FieldLabel>
            <NativeSelect id="g-vis" defaultValue="private">
              <NativeSelectOption value="public">Public</NativeSelectOption>
              <NativeSelectOption value="friends">Friends</NativeSelectOption>
              <NativeSelectOption value="private">Private</NativeSelectOption>
            </NativeSelect>
          </Field>
        </div>
      </Section>

      <Section id="toggles" title="Checkbox, switch, label">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2"><Checkbox id="g-check" defaultChecked/><Label htmlFor="g-check">Keep a copy</Label></div>
          <div className="flex items-center gap-2"><Switch id="g-switch"/><Label htmlFor="g-switch">Notify me</Label></div>
        </div>
      </Section>

      <Section id="overlays" title="Dialog, dropdown menu, hover card">
        <div className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger render={<Button variant="outline">Open dialog</Button>}/>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Make this public?</DialogTitle>
                <DialogDescription>Everyone will be able to read it once it is published.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="outline">Cancel</Button>}/>
                <DialogClose render={<Button>Make public</Button>}/>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline">Menu</Button>}/>
            <DropdownMenuContent>
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem>Move</DropdownMenuItem>
              <DropdownMenuSeparator/>
              <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <HoverCard>
            <HoverCardTrigger render={<Button variant="link">Hover me</Button>}/>
            <HoverCardContent>A preview card, opened on hover or focus.</HoverCardContent>
          </HoverCard>
        </div>
      </Section>

      <Section id="feedback" title="Notice, progress, loading, separator">
        <div className="flex flex-col gap-4">
          <div><Button variant="outline" onClick={() => notify({tone: 'info', message: 'Saved. It is private.'})}>Show a notice</Button></div>
          <Progress value={64}/>
          <Progress value={null}/>
          <LoadingBar/>
          <Separator/>
        </div>
      </Section>

      <Section id="thread" title="Assistant thread">
        <div className="h-[520px] overflow-hidden rounded-panel shadow-(--ohm-panel-shadow)">
          <AssistantRuntimeProvider runtime={runtime}>
            <Thread/>
          </AssistantRuntimeProvider>
        </div>
      </Section>
    </main>
  </div>;
}
