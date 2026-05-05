import * as React from 'react'
import {
  AlertTriangle,
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeftRight,
  BadgeCheck,
  ShoppingBag,
  BookOpen,
  Calendar,
  CaseSensitive,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleCheck,
  CircleX,
  Copy as CopyIcon,
  CreditCard,
  Crop,
  Download,
  Eraser,
  Eye,
  EyeOff,
  Facebook,
  Frame,
  Image as ImageIcon,
  ImageDown,
  ImagePlus,
  Images,
  Instagram,
  LayoutGrid,
  Layers,
  Linkedin,
  Loader2,
  Lock,
  Mail,
  Map as MapIcon,
  MapPin,
  Megaphone,
  Menu,
  Minus,
  Palette,
  PenLine,
  Pin,
  Pipette,
  Play,
  Plus,
  PlusSquare,
  Quote,
  RotateCcw,
  RotateCw,
  Ruler,
  Save,
  Scissors,
  Search,
  ShoppingCart,
  Signature,
  Wand2,
  Check,
  Square,
  SquareCheck,
  Star,
  Sun,
  Tag,
  TextCursorInput,
  Twitter,
  Type,
  Upload,
  User as UserIcon,
  UserCheck,
  UserX,
  Variable,
  Youtube,
  X,
  Home,
  IdCard,
  Users,
  Filter,
  Bell,
  Settings,
  Settings2,
  UserCog,
} from 'lucide-react'
import {
  Pencil,
  Trash2,
  Share2,
  Link as LinkIcon,
  ExternalLink,
  RefreshCcw,
  ArrowRight,
  ArrowUpRight,
  MessageSquare,
  MessageCircle,
  Send,
  Phone,
  PhoneCall,
  Headphones,
  Mic,
  MicOff,
  Camera,
  Video,
  Music,
  Volume2,
  VolumeX,
  Monitor,
  Laptop,
  Smartphone,
  File as FileIcon,
  FileText,
  FilePlus,
  Folder,
  FolderOpen,
  Clipboard,
  SlidersHorizontal,
  Wrench,
  Power,
  Plug,
  Unlock,
  Info,
  HelpCircle,
  CheckCircle2,
  PlusCircle,
  MinusCircle,
  Shield,
  ShieldCheck,
  ShieldAlert,
  DollarSign,
  Wallet,
  Receipt,
  QrCode,
  Barcode,
  Clock,
  Timer,
  Hourglass,
  Compass,
  Navigation,
  Flag,
  Globe,
  Key,
  LogIn,
  LogOut,
  Fingerprint,
  Grid3X3,
  PanelsTopLeft,
  Table,
  List as ListIcon,
  ListChecks,
  Moon,
  Cloud,
  Leaf,
  Flame,
  Zap,
  Rocket,
} from 'lucide-react'

import { cn } from '@/lib/utils'

type LegacySize = 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge'
type Orientation = 'up' | 'down' | 'left' | 'right'

export type IconName =
  | keyof typeof ICONS
  | string

export type IconTone =
  | 'foreground'
  | 'muted'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'background'

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'color'> {
  name: IconName
  size?: LegacySize | number
  tone?: IconTone
  // Legacy aliases
  primaryColor?:
    | 'default'
    | 'primaryBodyText'
    | 'primaryHeadingText'
    | 'inverseBodyText'
    | 'inverseHeadingText'
    | 'primaryBrand'
    | 'secondaryBrand'
    | 'warning'
    | 'danger'
    | 'success'
    | 'background'
    | 'accent'
    | string
  secondaryColor?: string
  orientation?: Orientation
  strokeWidth?: number
  decorative?: boolean
}

const SIZE_MAP: Record<LegacySize, number> = {
  xSmall: 18,
  small: 24,
  medium: 32,
  large: 64,
  xLarge: 88,
}

// Map supported names to Lucide components.
const ICONS = {
  // basics
  close: X,
  rightChevron: ChevronRight,
  leftChevron: ChevronLeft,
  chevron: ChevronRight, // rotate via orientation
  search: Search,
  star: Star,
  cart: ShoppingCart,
  priceTag: Tag,
  layer: Layers,
  layerUp: Layers,
  layerDown: Layers,
  loading: Loader2,
  play: Play,
  lock: Lock,
  user: UserIcon,
  noUsers: UserX,
  userSuccess: UserCheck,
  check: Check,
  exclamation: AlertTriangle,
  add: Plus,
  plus: Plus,
  minus: Minus,
  plusSquare: PlusSquare,
  delete: Eraser,
  copy: CopyIcon,
  crop: Crop,
  alignCenter: AlignCenter,
  alignLeft: AlignLeft,
  alignRight: AlignRight,
  frame: Frame,
  cut: Scissors,
  wand: Wand2,
  signature: Signature,
  signaturePen: PenLine,
  rotateLeft: RotateCcw,
  rotateRight: RotateCw,
  redo: RotateCw,
  undo: RotateCcw,
  colorPalette: Palette,
  dropper: Pipette,
  textBox: TextCursorInput,
  fontSize: CaseSensitive,
  aText: Type,
  text: Type,
  flipHorizontal: ChevronRight, // rotated in CSS if needed
  flipVertical: ChevronDown, // rotated in CSS if needed
  filter: Filter,
  brightness: Sun,
  frameWidth: Frame,
  frameHeight: Frame,
  fullBleed: Square,
  fullBleedLandscape: Square,
  fullBleedPortrait: Square,
  fullBleedImage: ImageIcon,
  fullBleedText: Type,
  panelMode: LayoutGrid,
  viewPanels: LayoutGrid,
  rotate: RotateCw,
  view: Eye,
  replaceImage: ImageDown,
  quotation: Quote,
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedIn: Linkedin,
  youtube: Youtube,
  pinterest: Pin,
  visible: Eye,
  invisible: EyeOff,
  elementIcon: Square,
  complete: CircleCheck,
  download: Download,
  closeCircle: CircleX,
  backgroundSettings: ImageIcon,
  upload: Upload,
  stickers: BadgeCheck,
  image: ImageIcon,
  imageUpload: ImagePlus,
  clearPanel: Eraser,
  viewCarousel: Images,
  viewSinglePanel: Square,
  editorText: TextCursorInput,
  layout: LayoutGrid,
  background: ImageIcon,
  save: Save,
  size: Ruler,
  variable: Variable,
  squareCheck: SquareCheck,
  userTag: UserIcon,
  map: MapIcon,
  mapLocation: MapPin,
  location: MapPin,
  creditCard: CreditCard,
  calendar: Calendar,
  home: Home,
  bag: ShoppingBag,
  swap: ArrowLeftRight,
  warning: AlertTriangle,
  catalog: BookOpen,
  campaigns: Megaphone,
  contact: Mail,
  idCard: IdCard,
  groups: Users,
  bell: Bell,
  settings: Settings,
  defaultSettings: Settings2,
  userCog: UserCog,
  userSettings: UserCog,
  // CRUD / actions
  edit: Pencil,
  trash: Trash2,
  share: Share2,
  link: LinkIcon,
  externalLink: ExternalLink,
  refresh: RefreshCcw,
  // Navigation
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  // Communication
  message: MessageSquare,
  chat: MessageCircle,
  send: Send,
  phone: Phone,
  phoneCall: PhoneCall,
  headset: Headphones,
  mic: Mic,
  micOff: MicOff,
  // Media / devices
  camera: Camera,
  video: Video,
  music: Music,
  volume: Volume2,
  volumeMute: VolumeX,
  monitor: Monitor,
  laptop: Laptop,
  smartphone: Smartphone,
  // Files / folders
  file: FileIcon,
  fileText: FileText,
  filePlus: FilePlus,
  folder: Folder,
  folderOpen: FolderOpen,
  clipboard: Clipboard,
  // System / tools
  sliders: SlidersHorizontal,
  wrench: Wrench,
  tools: Wrench,
  power: Power,
  plug: Plug,
  unlock: Unlock,
  // Status
  info: Info,
  help: HelpCircle,
  checkCircle: CheckCircle2,
  xCircle: CircleX,
  plusCircle: PlusCircle,
  minusCircle: MinusCircle,
  shield: Shield,
  shieldCheck: ShieldCheck,
  shieldAlert: ShieldAlert,
  // Commerce
  dollar: DollarSign,
  wallet: Wallet,
  receipt: Receipt,
  qrCode: QrCode,
  barcode: Barcode,
  // Time
  clock: Clock,
  timer: Timer,
  hourglass: Hourglass,
  // Map / location
  compass: Compass,
  navigation: Navigation,
  flag: Flag,
  globe: Globe,
  // Auth
  key: Key,
  login: LogIn,
  logout: LogOut,
  fingerprint: Fingerprint,
  // Layout / UI
  grid: Grid3X3,
  panels: PanelsTopLeft,
  table: Table,
  list: ListIcon,
  listChecks: ListChecks,
  // Weather / nature
  moon: Moon,
  cloud: Cloud,
  leaf: Leaf,
  flame: Flame,
  zap: Zap,
  rocket: Rocket,
  price: Tag,
  socLogo: BadgeCheck,
  hamburger: Menu,
  right: ChevronRight,
  left: ChevronLeft,
  up: ChevronUp,
  down: ChevronDown,
} as const

// Some imports above might not be used; define stubs to satisfy TS if not referenced everywhere
// but ensure the important ones exist. The build will tree-shake.

function sizeToNumber(size?: LegacySize | number): number | undefined {
  if (size == null) return undefined
  if (typeof size === 'number') return size
  return SIZE_MAP[size]
}

function mapLegacyColorToClass(c?: IconProps['primaryColor'] | IconTone): string | undefined {
  switch (c) {
    case 'primary':
    case 'primaryBrand':
      return 'text-primary'
    case 'secondary':
    case 'secondaryBrand':
      return 'text-secondary'
    case 'accent':
      return 'text-accent'
    case 'warning':
      return 'text-amber-500'
    case 'danger':
      return 'text-red-600'
    case 'success':
      return 'text-emerald-600'
    case 'background':
      return 'text-background'
    case 'inverseBodyText':
    case 'inverseHeadingText':
      return 'text-background'
    case 'primaryBodyText':
    case 'primaryHeadingText':
    case 'foreground':
    case 'default':
      return 'text-foreground'
    case 'muted':
      return 'text-muted-foreground'
    default:
      return undefined
  }
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'small',
  tone,
  primaryColor,
  secondaryColor, // accepted for API flexibility, not used by Lucide icons
  orientation,
  strokeWidth = 2,
  decorative,
  className,
  ...rest
}) => {
  const Cmp = (ICONS as Record<string, any>)[name] ?? X

  const numericSize = sizeToNumber(size)
  const colorClass = mapLegacyColorToClass(tone ?? primaryColor)
  const rotateClass = orientation
    ? orientation === 'up'
      ? '-rotate-90'
      : orientation === 'down'
        ? 'rotate-90'
        : orientation === 'left'
          ? 'rotate-180'
          : ''
    : ''

  const spinClass = name === 'loading' ? 'animate-spin' : ''

  // If user provides a raw color string in primaryColor (e.g., #f00), prefer inline style
  const inlineColor =
    primaryColor && !mapLegacyColorToClass(primaryColor as any) && /^#|^rgb|^hsl/.test(String(primaryColor))
      ? { color: String(primaryColor) }
      : undefined

  return (
    <Cmp
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : (typeof name === 'string' ? name : undefined)}
      className={cn(colorClass, rotateClass, spinClass, className)}
      size={numericSize}
      strokeWidth={strokeWidth}
      style={inlineColor}
      {...rest}
    />
  )
}

export default Icon

// Export keys for docs/search
export const ICON_KEYS = Object.keys(ICONS) as string[]
// Core icons highlighted in the docs catalog.
export const NEW_ICON_KEYS = [
  'settings','defaultSettings','userCog','userSettings',
  'edit','trash','share','link','externalLink','refresh',
  'arrowRight','arrowUpRight',
  'message','chat','send','phone','phoneCall','headset','mic','micOff',
  'camera','video','music','volume','volumeMute','monitor','laptop','smartphone',
  'file','fileText','filePlus','folder','folderOpen','clipboard',
  'sliders','wrench','tools','power','plug','unlock',
  'info','help','checkCircle','xCircle','plusCircle','minusCircle','shield','shieldCheck','shieldAlert',
  'dollar','wallet','receipt','qrCode','barcode',
  'clock','timer','hourglass',
  'compass','navigation','flag','globe',
  'key','login','logout','fingerprint',
  'grid','panels','table','list','listChecks',
  'moon','cloud','leaf','flame','zap','rocket',
] as const
export const LEGACY_ICON_KEYS = ICON_KEYS.filter(k => !(NEW_ICON_KEYS as readonly string[]).includes(k))
