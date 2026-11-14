// The ohm icon set: Lucide icons (shadcn's set) chosen once for each meaning, so the same
// idea always has the same picture. Reach for a name here before importing from lucide-react;
// add a name here when a meaning is missing.
import {
  ArchiveIcon, ArrowUpNarrowWideIcon, ChevronsDownUpIcon, ChevronsUpDownIcon, FileIcon, FolderOpenIcon, FolderPlusIcon,
  GalleryVerticalIcon, SquarePenIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, ArrowUpRightIcon, AtSignIcon, AudioLinesIcon,
  BanIcon, BellIcon, BellOffIcon, BookmarkIcon, BookOpenIcon, BotIcon, CalendarIcon, ChartSplineIcon, CheckIcon,
  ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, CircleCheckIcon, CircleHelpIcon, CircleXIcon, CodeIcon,
  CopyIcon, DownloadIcon, EllipsisIcon, EllipsisVerticalIcon, EyeIcon, EyeOffIcon, FileTextIcon, FilterIcon,
  FolderIcon, GlobeIcon, HeartIcon, HouseIcon, ImageIcon, InfoIcon, LinkIcon, ListIcon, LockIcon, LockOpenIcon,
  LogOutIcon, MailIcon, MailOpenIcon, MenuIcon, MessageCircleIcon, MessageSquareTextIcon, MoonIcon, PanelLeftIcon,
  PencilIcon, PinIcon, PlusIcon, QuoteIcon, RefreshCwIcon, SearchIcon, SettingsIcon, Share2Icon, SparklesIcon,
  StarIcon, SunIcon, SunMoonIcon, TagIcon, Trash2Icon, TriangleAlertIcon, UploadIcon, UserIcon, UsersIcon,
  VideoIcon, VolumeXIcon, XIcon,
  type LucideIcon,
} from "lucide-react"

export const iconGroups = {
  navigation: {
    home: HouseIcon, search: SearchIcon, menu: MenuIcon, sidebar: PanelLeftIcon, back: ArrowLeftIcon,
    forward: ArrowRightIcon, close: XIcon, more: EllipsisIcon, moreVertical: EllipsisVerticalIcon,
    expand: ChevronDownIcon, collapse: ChevronUpIcon, next: ChevronRightIcon, external: ArrowUpRightIcon,
  },
  actions: {
    add: PlusIcon, edit: PencilIcon, delete: Trash2Icon, copy: CopyIcon, share: Share2Icon, download: DownloadIcon,
    upload: UploadIcon, send: ArrowUpIcon, archive: ArchiveIcon, pin: PinIcon, bookmark: BookmarkIcon,
    refresh: RefreshCwIcon, filter: FilterIcon, write: SquarePenIcon, newFolder: FolderPlusIcon, sort: ArrowUpNarrowWideIcon,
    collapseAll: ChevronsDownUpIcon, expandAll: ChevronsUpDownIcon, layout: GalleryVerticalIcon, done: CheckIcon, like: HeartIcon, favorite: StarIcon,
  },
  people: {
    user: UserIcon, people: UsersIcon, mention: AtSignIcon, mail: MailIcon, read: MailOpenIcon,
    chat: MessageCircleIcon, contact: MessageSquareTextIcon, notify: BellIcon, mute: BellOffIcon,
    silence: VolumeXIcon, block: BanIcon, community: GlobeIcon, agent: BotIcon, magic: SparklesIcon,
  },
  content: {
    document: FileTextIcon, docs: BookOpenIcon, image: ImageIcon, video: VideoIcon, audio: AudioLinesIcon,
    link: LinkIcon, code: CodeIcon, folder: FolderIcon, files: FolderOpenIcon, file: FileIcon, label: TagIcon, quote: QuoteIcon, list: ListIcon,
    date: CalendarIcon,
  },
  status: {
    help: CircleHelpIcon, info: InfoIcon, warning: TriangleAlertIcon, success: CircleCheckIcon,
    error: CircleXIcon, status: ChartSplineIcon, locked: LockIcon, unlocked: LockOpenIcon,
    visible: EyeIcon, hidden: EyeOffIcon,
  },
  system: {
    settings: SettingsIcon, theme: SunMoonIcon, light: SunIcon, dark: MoonIcon, signOut: LogOutIcon,
  },
} satisfies Record<string, Record<string, LucideIcon>>

type Groups = typeof iconGroups
export type IconName = { [G in keyof Groups]: keyof Groups[G] }[keyof Groups]

/** Every icon by meaning: icons.help, icons.delete, icons.community. */
export const icons = Object.assign({}, ...Object.values(iconGroups)) as Record<IconName, LucideIcon>
