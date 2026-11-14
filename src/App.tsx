// The gallery, laid out like a component library's docs: the library's own Sidebar on the left,
// one page per registry item on the right. Every page renders the item from source.
import {useEffect, useState, type CSSProperties} from 'react';
import {Link} from '@tanstack/react-router';
import {Button} from '@/registry/ohm/ui/button';
import {Icon} from '@/registry/ohm/ui/icon';
import {icons} from '@/registry/ohm/lib/icons';
import {Kbd} from '@/registry/ohm/ui/kbd';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from '@/registry/ohm/ui/sidebar';
import {ToggleGroup, ToggleGroupItem} from '@/registry/ohm/ui/toggle-group';
import {TooltipProvider} from '@/registry/ohm/ui/tooltip';
import {Notices} from '@/registry/ohm/ui/notice';
import {PAGES, SECTIONS, type PageId} from './pages';

type Theme = 'light' | 'dark' | 'system';

export function Gallery({page}: {page: PageId}) {
  const [theme, setTheme] = useState<Theme>('light');
  useEffect(() => { setTheme((document.documentElement.dataset.theme as Theme) || 'light'); }, []);
  const choose = (next: Theme) => {
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem('ohm-ui-theme', next);
  };
  const current = PAGES[page];

  return <TooltipProvider>
    {/* The sidebar is set as docs.ohmmmm.com's: 248px on its own tone, the name in Coconat with the
        forest dot, quiet 12px group labels, muted 14px rows, the current one in ink on a tone. */}
    <SidebarProvider style={{'--sidebar-width': '15.5rem'} as CSSProperties}>
      <Sidebar>
        <SidebarHeader className="px-3 pt-10 pb-0">
          <Link to="/" className="flex items-center gap-2 px-3 pt-1 pb-3 font-serif text-[24px] leading-none tracking-[-0.02em] text-foreground">
            <span className="size-2.5 rounded-full bg-(--ohm-forest)"/>
            design
          </Link>
        </SidebarHeader>
        <SidebarContent className="gap-6 px-3 pt-2 pb-10">
          {SECTIONS.map(section => <SidebarGroup key={section.title} className="p-0">
            <SidebarGroupLabel className="h-4 px-3 text-[12px] leading-4 font-normal tracking-normal text-muted-foreground">{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="mt-1.5 gap-px">
                {section.pages.map(id => <SidebarMenuItem key={id}>
                  <SidebarMenuButton isActive={id === page} render={<Link to="/$page" params={{page: id}}/>} className="h-auto rounded-xl px-3 py-1.5 text-[14px] leading-5 tracking-[-0.01em] text-muted-foreground transition-colors duration-180 hover:bg-muted hover:text-foreground data-active:bg-foreground/8 data-active:font-medium data-active:text-foreground">{PAGES[id].title}</SidebarMenuButton>
                </SidebarMenuItem>)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>)}
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="h-svh overflow-y-auto">
        <header className="sticky top-0 z-20 flex h-12 shrink-0 items-center gap-1.5 bg-background px-3">
          <SidebarTrigger className="size-7"/>
          <span className="text-small text-muted-foreground">{current.section}</span>
          <span className="text-small text-muted-foreground">/</span>
          <span className="text-small font-medium">{current.title}</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1 text-small text-muted-foreground sm:flex">Sidebar <Kbd>⌘</Kbd><Kbd>B</Kbd></span>
            <ToggleGroup value={[theme]} onValueChange={value => value[0] && choose(value[0] as Theme)} aria-label="Appearance" size="sm" spacing={1}>
              <ToggleGroupItem className="size-8 rounded-full px-0" value="light" aria-label="Light"><Icon icon={icons.light} size="sm"/></ToggleGroupItem>
              <ToggleGroupItem className="size-8 rounded-full px-0" value="dark" aria-label="Dark"><Icon icon={icons.dark} size="sm"/></ToggleGroupItem>
              <ToggleGroupItem className="size-8 rounded-full px-0" value="system" aria-label="Follow the device"><Icon icon={icons.theme} size="sm"/></ToggleGroupItem>
            </ToggleGroup>
          </div>
        </header>
        <main className="mx-auto flex w-full max-w-[920px] flex-col gap-8 px-6 pt-10 pb-24">
          <div className="flex flex-col gap-2">
            <h1>{current.title}</h1>
            {current.description && <p className="max-w-[60ch] text-body text-muted-foreground">{current.description}</p>}
            {current.install && <InstallLine name={current.install}/>}
          </div>
          <current.Page/>
        </main>
      </SidebarInset>
    </SidebarProvider>
    <Notices/>
  </TooltipProvider>;
}

function InstallLine({name}: {name: string}) {
  const command = `npx shadcn add @ohm/${name}`;
  return <div className="flex w-fit items-center gap-1 rounded-xl bg-muted py-1 pr-1 pl-3 font-mono text-small">
    <span>{command}</span>
    <Button variant="ghost" size="icon-sm" aria-label="Copy install command" onClick={() => navigator.clipboard.writeText(command)}>
      <Icon icon={icons.copy} size="sm"/>
    </Button>
  </div>;
}
