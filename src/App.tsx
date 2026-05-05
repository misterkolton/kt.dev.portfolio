import {
  createContext,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { CircleEllipsis, Ellipsis, ExternalLink } from 'lucide-react'
import { AnimatedCheckmark } from '@/components/ui/animated-checkmark'

type QuickLink = {
  label: string
  href: string
}

type ExperienceItem = {
  area: string
  title: string
  summary: string
}

type ProjectStatus = 'live' | 'active' | 'planned'

type ProjectItem = {
  name: string
  status: ProjectStatus
  summary: string
  tags: string[]
  links: QuickLink[]
  featured?: boolean
  date?: string
  problem?: string
  results?: string[]
  role?: string
  duration?: string
  platform?: string
  timeline?: string
  systemNotes?: string
  patterns?: string[]
}

type PostItem = {
  date: string
  title: string
  summary: string
}

type ThemeMode = 'dark' | 'light'
type PortfolioMode = 'standard' | 'developer' | 'design'
type PortfolioView = Exclude<PortfolioMode, 'developer'>
type CardVariant = 'standard' | 'design'
type ExploreSectionId = 'about' | 'experience' | 'projects' | 'posts'
type TerminalSectionId = 'about' | 'projects' | 'contact'
type TerminalCommand = 'help' | 'about' | 'projects' | 'contact' | 'open' | 'clear'
type ProjectOrderingStrategy = 'none' | 'design-focus' | 'developer-tech'

type TerminalHistoryItem =
  | { id: number; kind: 'command'; command: string }
  | { id: number; kind: 'lines'; lines: string[] }

type ToggleGroupProps<T extends string> = {
  label: string
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

type DesignSystemLinkProps = {
  children: ReactNode
  className?: string
  variant?: 'inline' | 'menu'
}

type ModeOption = {
  value: PortfolioMode
  label: string
  description: string
}

type ExploreSectionOpenState = Record<ExploreSectionId, boolean>

type LensConfig = {
  view: PortfolioView
  cardVariant: CardVariant
  defaultExpandedSections: ExploreSectionOpenState
  sectionOrder: ExploreSectionId[]
  orderingStrategy: ProjectOrderingStrategy
}

type PortfolioModeContextValue = {
  mode: PortfolioMode
  setMode: (mode: PortfolioMode) => void
  switchToPortfolio: () => void
}

const THEME_STORAGE_KEY = 'kt-theme'
const PORTFOLIO_MODE_STORAGE_KEY = 'portfolioMode'

const ABOUT_LEAD =
  'Software engineer building direct-user products with ownership that starts in discovery and continues through production.'

const ABOUT_PARAGRAPHS = [
  'I build software that users interact with directly, and I take responsibility for how those systems behave in production.',
  'Much of my work begins before implementation. I spend time in design and discovery, working through flows, constraints, and tradeoffs with product early so problems are well understood before they turn into code. From there I own solutions end to end, from architecture and implementation through iteration, scaling, and long term maintenance.',
  'I have led large scale redesigns and foundational changes in production systems, making decisions that balanced delivery pressure with the need to improve reliability, performance, and extensibility. I have designed and maintained shared systems used across teams, worked across application and service layers, and owned interfaces and data contracts that had to remain stable as products evolved.',
  'I operate comfortably in environments where things break and timelines move. I have handled production incidents, resolved regressions under pressure, and made tradeoffs with incomplete information while keeping systems stable and teams unblocked.',
  'I value clarity in systems and in decisions. I think about how software is understood months or years later, not just how it works at launch. I am looking for teams building complex products, tackling ambiguous problems, and valuing engineers who can move from uncertainty to execution with sound judgment.',
] as const

const QUICK_LINKS: QuickLink[] = [
  { label: 'github', href: 'https://github.com/misterkolton' },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/koltonthompson/' },
  { label: 'source', href: 'https://github.com/misterkolton/kt.dev.portfolio' },
]

const EXPERIENCE: ExperienceItem[] = [
  {
    area: 'platform/',
    title: 'Resilient product foundations',
    summary:
      'Shipped core workflows spanning UI and service layers while protecting reliability as feature load increased.',
  },
  {
    area: 'performance/',
    title: 'Editor and runtime optimization',
    summary:
      'Improved latency and rendering behavior in interaction-heavy surfaces where responsiveness mattered to adoption.',
  },
  {
    area: 'commerce/',
    title: 'Payment and risk flows',
    summary:
      'Balanced delivery speed with operational safety across checkout logic, fraud controls, and integration boundaries.',
  },
  {
    area: 'tooling/',
    title: 'Shared systems and release confidence',
    summary:
      'Built typed UI primitives and release workflows that helped teams ship faster without drifting from standards.',
  },
]

const PROJECTS: ProjectItem[] = [
  {
    name: 'portfolio',
    status: 'live',
    summary:
      'The live portfolio site, with viewing modes for technical, standard, and design-focused presentation.',
    tags: ['react', 'typescript', 'vite', 'vercel'],
    featured: true,
    date: '2026-05-04',
    systemNotes:
      'Mode-specific composition keeps the portfolio adaptable without splitting content across multiple pages.',
    patterns: ['global mode dock', 'route-level design system', 'responsive portfolio skins'],
    links: [
      { label: 'live', href: 'https://kolton.dev' },
      {
        label: 'source',
        href: 'https://github.com/misterkolton/kt.dev.portfolio',
      },
    ],
  },
  {
    name: 'token-design-system',
    status: 'live',
    summary:
      'A component and documentation system for reusable UI patterns, interaction states, and portfolio-grade interface polish.',
    tags: ['design', 'system', 'components', 'accessibility'],
    date: '2026-05-03',
    systemNotes:
      'Documents shared primitives and composed examples so product surfaces can stay consistent while still feeling crafted.',
    patterns: ['component documentation', 'glass menu controls', 'responsive examples'],
    links: [{ label: 'live', href: '/design-system' }],
  },
  {
    name: 'incident-playbook-kit',
    status: 'planned',
    summary:
      'Practical templates and runbook patterns for triage, communication, and post-incident system hardening.',
    tags: ['ops', 'reliability', 'playbooks'],
    date: '2026-02-12',
    systemNotes:
      'Structured around fast scanning, repeatable incident roles, and decision logs that survive the incident.',
    patterns: ['checklist flow', 'status taxonomy', 'post-incident review'],
    links: [{ label: 'github', href: 'https://github.com/misterkolton' }],
  },
  {
    name: 'service-contract-lab',
    status: 'planned',
    summary:
      'A sandbox for testing versioned API contracts and backward-compatibility checks before release windows.',
    tags: ['api', 'contracts', 'testing'],
    date: '2026-01-21',
    systemNotes:
      'The surface is planned around comparing versions, highlighting risk, and keeping release decisions explicit.',
    patterns: ['comparison cards', 'compatibility matrix', 'release gate'],
    links: [{ label: 'github', href: 'https://github.com/misterkolton' }],
  },
]

const POSTS: PostItem[] = [
  {
    date: 'Feb 2026',
    title: 'Designing for maintainers, not just launch day',
    summary:
      'How early architecture decisions reduce incident frequency and lower long-term team cognitive load.',
  },
  {
    date: 'Jan 2026',
    title: 'From regression to guardrail in one release cycle',
    summary:
      'A pattern for converting production bugs into durable tests and safer rollout gates.',
  },
]

const MODE_OPTIONS: ModeOption[] = [
  {
    value: 'standard',
    label: 'Standard',
    description: 'Clean browsing view.',
  },
  {
    value: 'developer',
    label: 'Developer',
    description: 'Technical lens + command access.',
  },
  {
    value: 'design',
    label: 'Design',
    description: 'UI decisions and system focus.',
  },
]

const MODE_LABELS: Record<PortfolioMode, string> = {
  standard: 'Standard',
  developer: 'Developer',
  design: 'Design',
}

const PORTFOLIO_LENS_CONFIG: Record<PortfolioView, LensConfig> = {
  standard: {
    view: 'standard',
    cardVariant: 'standard',
    defaultExpandedSections: {
      about: true,
      experience: true,
      projects: true,
      posts: true,
    },
    sectionOrder: ['about', 'experience', 'projects', 'posts'],
    orderingStrategy: 'none',
  },
  design: {
    view: 'design',
    cardVariant: 'design',
    defaultExpandedSections: {
      about: true,
      experience: false,
      projects: true,
      posts: true,
    },
    sectionOrder: ['projects', 'about', 'experience', 'posts'],
    orderingStrategy: 'design-focus',
  },
}

const TERMINAL_COMMANDS: TerminalCommand[] = [
  'help',
  'about',
  'projects',
  'contact',
  'open',
  'clear',
]

const TERMINAL_SECTIONS: TerminalSectionId[] = ['about', 'projects', 'contact']

const TERMINAL_ALIASES: Record<string, TerminalCommand> = {
  '?': 'help',
  ls: 'help',
}

const TERMINAL_INTRO_LINES = [
  'terminal ready (developer mode)',
  "type 'help' to list commands",
]

const TERMINAL_ENGINEERING_TAGS = new Set([
  'react',
  'typescript',
  'vite',
  'api',
  'contracts',
  'testing',
  'reliability',
  'ops',
  'playbooks',
  'vercel',
])

const TERMINAL_DESIGN_TAGS = new Set([
  'design',
  'system',
  'components',
  'ui',
  'ux',
  'typography',
  'layout',
  'accessibility',
])

const OPEN_USAGE_LINES = ['Usage: open <about|projects|contact>']

const DESIGN_SYSTEM_OPEN_DELAY = 1100

const STATUS_PRIORITY: Record<ProjectStatus, number> = {
  live: 3,
  active: 2,
  planned: 1,
}

const PortfolioModeContext = createContext<PortfolioModeContextValue | null>(null)

const usePortfolioMode = (): PortfolioModeContextValue => {
  const contextValue = useContext(PortfolioModeContext)

  if (!contextValue) {
    throw new Error('usePortfolioMode must be used within PortfolioModeContext')
  }

  return contextValue
}

const hasWindow = (): boolean => typeof window !== 'undefined'

const safeLocalStorageGet = (key: string): string | null => {
  if (!hasWindow()) {
    return null
  }

  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

const safeLocalStorageSet = (key: string, value: string): void => {
  if (!hasWindow()) {
    return
  }

  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Intentionally ignored.
  }
}

const readStoredTheme = (): ThemeMode =>
  safeLocalStorageGet(THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark'

const isPortfolioMode = (value: string | null): value is PortfolioMode =>
  value === 'standard' ||
  value === 'developer' ||
  value === 'design'

const readStoredMode = (): PortfolioMode => {
  const storedValue = safeLocalStorageGet(PORTFOLIO_MODE_STORAGE_KEY)
  return isPortfolioMode(storedValue) ? storedValue : 'standard'
}

const cloneSectionState = (
  state: ExploreSectionOpenState,
): ExploreSectionOpenState => ({ ...state })

const countMatchingTags = (tags: string[], matcher: Set<string>): number =>
  tags.reduce(
    (count, tag) => (matcher.has(tag.toLowerCase()) ? count + 1 : count),
    0,
  )

const parseProjectDate = (value?: string): number => {
  if (!value) {
    return Number.NEGATIVE_INFINITY
  }

  const timestamp = Date.parse(value)
  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp
}

const sortByExistingOrder = (
  projects: ProjectItem[],
  compare: (
    projectA: ProjectItem,
    projectB: ProjectItem,
    indexA: number,
    indexB: number,
  ) => number,
): ProjectItem[] => {
  const rankedProjects = projects.map((project, index) => ({ project, index }))

  rankedProjects.sort((entryA, entryB) =>
    compare(entryA.project, entryB.project, entryA.index, entryB.index),
  )

  return rankedProjects.map((entry) => entry.project)
}

const getOrderedProjectsForStrategy = (
  projects: ProjectItem[],
  strategy: ProjectOrderingStrategy,
): ProjectItem[] => {
  if (strategy === 'none') {
    return projects
  }

  if (strategy === 'developer-tech') {
    return sortByExistingOrder(projects, (projectA, projectB, indexA, indexB) => {
      const techScoreA = countMatchingTags(projectA.tags, TERMINAL_ENGINEERING_TAGS)
      const techScoreB = countMatchingTags(projectB.tags, TERMINAL_ENGINEERING_TAGS)

      if (techScoreB !== techScoreA) {
        return techScoreB - techScoreA
      }

      const statusA = STATUS_PRIORITY[projectA.status]
      const statusB = STATUS_PRIORITY[projectB.status]
      if (statusB !== statusA) {
        return statusB - statusA
      }

      return indexA - indexB
    })
  }

  const hasDesignData = projects.some(
    (project) =>
      Boolean(project.systemNotes) ||
      Boolean(project.patterns?.length) ||
      countMatchingTags(project.tags, TERMINAL_DESIGN_TAGS) > 0 ||
      Boolean(project.featured) ||
      Number.isFinite(parseProjectDate(project.date)),
  )

  if (!hasDesignData) {
    return projects
  }

  return sortByExistingOrder(projects, (projectA, projectB, indexA, indexB) => {
    const hasDesignNotesA =
      (projectA.systemNotes ? 1 : 0) +
      (projectA.patterns?.length ? 1 : 0) +
      (countMatchingTags(projectA.tags, TERMINAL_DESIGN_TAGS) > 0 ? 1 : 0)
    const hasDesignNotesB =
      (projectB.systemNotes ? 1 : 0) +
      (projectB.patterns?.length ? 1 : 0) +
      (countMatchingTags(projectB.tags, TERMINAL_DESIGN_TAGS) > 0 ? 1 : 0)

    if (hasDesignNotesB !== hasDesignNotesA) {
      return hasDesignNotesB - hasDesignNotesA
    }

    const featuredA = projectA.featured ? 1 : 0
    const featuredB = projectB.featured ? 1 : 0
    if (featuredB !== featuredA) {
      return featuredB - featuredA
    }

    const dateA = parseProjectDate(projectA.date)
    const dateB = parseProjectDate(projectB.date)
    if (dateB !== dateA) {
      return dateB - dateA
    }

    return indexA - indexB
  })
}

const buildHelpLines = (): string[] => [
  'Available commands:',
  'about      jump to about section',
  'projects   jump to projects section',
  'contact    jump to contact links',
  'open       open <about|projects|contact>',
  'clear      clear terminal output',
]

const isTerminalSectionId = (value: string): value is TerminalSectionId =>
  TERMINAL_SECTIONS.includes(value as TerminalSectionId)

const isTerminalCommand = (value: string): value is TerminalCommand =>
  TERMINAL_COMMANDS.includes(value as TerminalCommand)

const resolveTerminalCommand = (value: string): TerminalCommand | null => {
  const mappedCommand = TERMINAL_ALIASES[value] ?? value
  return isTerminalCommand(mappedCommand) ? mappedCommand : null
}

const sharedPrefix = (values: string[]): string => {
  const [firstValue, ...restValues] = values
  if (!firstValue) {
    return ''
  }

  let prefix = firstValue

  for (const value of restValues) {
    while (!value.startsWith(prefix)) {
      prefix = prefix.slice(0, -1)
      if (!prefix) {
        return ''
      }
    }
  }

  return prefix
}

const isTypingTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  if (target.isContentEditable) {
    return true
  }

  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT'
  )
}

function CommandHeading({
  command,
  onToggle,
  isOpen,
}: {
  command: string
  onToggle?: () => void
  isOpen?: boolean
}) {
  if (!onToggle) {
    return (
      <p className="command-heading">
        <span className="prompt-marker">&gt;</span>
        <span>{command}</span>
      </p>
    )
  }

  return (
    <button
      className="command-heading command-heading-toggle"
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
    >
      <span className="prompt-marker">&gt;</span>
      <span>{command}</span>
      <span className="command-heading-caret" aria-hidden="true">
        {isOpen ? '▾' : '▸'}
      </span>
    </button>
  )
}

function SectionFrame({
  id,
  label,
  command,
  isOpen,
  isCollapsible,
  onToggle,
  children,
}: {
  id: ExploreSectionId
  label: string
  command: string
  isOpen: boolean
  isCollapsible: boolean
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <section id={id} className="section-block" aria-label={label} data-collapsed={!isOpen}>
      <CommandHeading
        command={command}
        isOpen={isOpen}
        onToggle={isCollapsible ? onToggle : undefined}
      />
      <div className="section-body" hidden={!isOpen}>
        {children}
      </div>
    </section>
  )
}

function ToggleGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: ToggleGroupProps<T>) {
  return (
    <div className="toggle-group">
      <p className="toggle-label">{label}:</p>
      <div className="toggle-options" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.value}
            className="toggle-button"
            type="button"
            data-active={option.value === value}
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function DesignSystemLink({
  children,
  className = '',
  variant = 'inline',
}: DesignSystemLinkProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const openTimerRef = useRef<number | null>(null)
  const resetTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (openTimerRef.current !== null) {
        window.clearTimeout(openTimerRef.current)
      }

      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current)
      }
    }
  }, [])

  const openDesignSystem = () => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current)
    }

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current)
    }

    setIsConfirming(true)
    openTimerRef.current = window.setTimeout(() => {
      window.open('/design-system', '_blank', 'noopener,noreferrer')
      openTimerRef.current = null

      resetTimerRef.current = window.setTimeout(() => {
        setIsConfirming(false)
        resetTimerRef.current = null
      }, 450)
    }, DESIGN_SYSTEM_OPEN_DELAY)
  }

  if (variant === 'menu') {
    return (
      <button
        className={`menu-action-button ${className}`.trim()}
        type="button"
        onClick={openDesignSystem}
      >
        <span>{children}</span>
        <span className="menu-action-pill" aria-live="polite">
          {isConfirming ? (
              <AnimatedCheckmark
                className="menu-action-check"
                size="xSmall"
                tone="success"
                duration={620}
              />
          ) : (
            'live'
          )}
        </span>
      </button>
    )
  }

  return (
    <button
      className={`design-system-link ${className}`.trim()}
      type="button"
      onClick={openDesignSystem}
      aria-live="polite"
    >
      {isConfirming ? (
        <AnimatedCheckmark
          className="design-system-link-check"
          size="xSmall"
          tone="success"
          duration={620}
        />
      ) : (
        children
      )}
    </button>
  )
}

function TopRightMenu({
  theme,
  onThemeChange,
}: {
  theme: ThemeMode
  onThemeChange: (value: ThemeMode) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { mode, setMode } = usePortfolioMode()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'm') {
        event.preventDefault()
        setIsOpen((currentValue) => !currentValue)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const onPointerDown = (event: PointerEvent) => {
      const targetNode = event.target as Node | null
      if (!targetNode) {
        return
      }

      if (popoverRef.current?.contains(targetNode)) {
        return
      }

      if (triggerRef.current?.contains(targetNode)) {
        return
      }

      setIsOpen(false)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  const advancedValue: Extract<PortfolioMode, 'developer' | 'design'> =
    mode === 'developer' ? 'developer' : 'design'
  const isDesignMode = mode === 'design'

  return (
    <div className="top-right-menu" data-design={isDesignMode}>
      <button
        ref={triggerRef}
        className="top-right-menu-trigger"
        type="button"
        aria-label="Open appearance and shell settings, Command or Control M"
        aria-expanded={isOpen}
        aria-controls="top-right-menu-popover"
        title="Open menu (Cmd/Ctrl + M)"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        {isDesignMode ? (
          <CircleEllipsis size={22} strokeWidth={1.8} aria-hidden="true" />
        ) : (
          <Ellipsis size={18} strokeWidth={2} aria-hidden="true" />
        )}
      </button>

      {isOpen ? (
        <div
          id="top-right-menu-popover"
          ref={popoverRef}
          className="top-right-menu-popover"
          role="dialog"
          aria-label="Appearance and shell settings"
        >
          <ToggleGroup
            label="theme"
            value={theme}
            onChange={(value) => {
              onThemeChange(value)
            }}
            options={[
              { value: 'dark', label: 'dark' },
              { value: 'light', label: 'light' },
            ]}
          />
          <ToggleGroup
            label="advanced"
            value={advancedValue}
            onChange={(value) => {
              if (value === 'developer') {
                setMode('developer')
              } else {
                setMode('design')
              }
            }}
            options={[
              { value: 'developer', label: 'developer' },
              { value: 'design', label: 'design' },
            ]}
          />
          <div className="menu-action-group">
            <p className="toggle-label">system</p>
            <DesignSystemLink variant="menu">design system</DesignSystemLink>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function GlobalTopControls({
  theme,
  onThemeChange,
}: {
  theme: ThemeMode
  onThemeChange: (value: ThemeMode) => void
}) {
  return (
    <div className="global-top-controls" aria-label="Portfolio controls">
      <TopRightMenu theme={theme} onThemeChange={onThemeChange} />
    </div>
  )
}

function TerminalNav({ inline }: { inline?: boolean }) {
  return (
    <nav className={`terminal-nav${inline ? ' terminal-nav--inline' : ''}`} aria-label="Section navigation">
      <span className="terminal-nav-label">nav</span>
      <a href="#about">about</a>
      <a href="#projects">work</a>
      <DesignSystemLink>system</DesignSystemLink>
      <a href="#contact">contact</a>
    </nav>
  )
}

function LensHeaderDesign() {
  return (
    <section className="lens-header lens-header--design" aria-label="Design lens">
      <div className="lens-header-copy">
        <p className="lens-header-title">Design View</p>
        <p className="lens-header-subtitle">UI decisions, system, and accessibility notes.</p>
      </div>
    </section>
  )
}

function AboutSection({
  condensed,
  isOpen,
  isCollapsible,
  onToggle,
}: {
  condensed: boolean
  isOpen: boolean
  isCollapsible: boolean
  onToggle: () => void
}) {
  const visibleParagraphs = condensed ? ABOUT_PARAGRAPHS.slice(0, 3) : ABOUT_PARAGRAPHS

  return (
    <SectionFrame
      id="about"
      label="About"
      command="cat about.txt"
      isOpen={isOpen}
      isCollapsible={isCollapsible}
      onToggle={onToggle}
    >
      <h1 className="hero-name">Kolton Thompson</h1>
      <p className="hero-lead">{ABOUT_LEAD}</p>
      <div className="about-copy">
        {visibleParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div id="contact" className="quick-links" aria-label="Contact links">
        {QUICK_LINKS.map((link) => (
          <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
            {link.label}
          </a>
        ))}
      </div>
    </SectionFrame>
  )
}

function ExperienceSection({
  isOpen,
  isCollapsible,
  onToggle,
}: {
  isOpen: boolean
  isCollapsible: boolean
  onToggle: () => void
}) {
  return (
    <SectionFrame
      id="experience"
      label="Experience"
      command="ls experience/"
      isOpen={isOpen}
      isCollapsible={isCollapsible}
      onToggle={onToggle}
    >
      <ul className="entry-list">
        {EXPERIENCE.map((entry) => (
          <li className="entry-item" key={entry.area}>
            <p className="entry-area">{entry.area}</p>
            <div className="entry-content">
              <p className="entry-title">{entry.title}</p>
              <p className="entry-summary">{entry.summary}</p>
            </div>
          </li>
        ))}
      </ul>
      <a className="section-link" href="https://kolton.dev" target="_blank" rel="noreferrer">
        -&gt; view full resume
      </a>
    </SectionFrame>
  )
}

function ProjectCardStandard({
  project,
  showProjectTags,
}: {
  project: ProjectItem
  showProjectTags: boolean
}) {
  return (
    <li
      id={project.name === 'portfolio' ? 'portfolio-project' : undefined}
      className="project-item"
      key={project.name}
    >
      <div className="project-heading">
        <p className="project-name">{project.name}</p>
        <span className={`project-status project-status--${project.status}`}>
          [{project.status}]
        </span>
      </div>
      <p className="project-summary">{project.summary}</p>
      {showProjectTags ? (
        <p className="project-tags">{project.tags.map((tag) => `#${tag}`).join(' ')}</p>
      ) : null}
      <div className="project-links">
        {project.links.map((link) =>
          link.href === '/design-system' ? (
            <DesignSystemLink key={`${project.name}-${link.label}`}>
              {link.label}
            </DesignSystemLink>
          ) : (
            <a key={`${project.name}-${link.label}`} href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ),
        )}
      </div>
    </li>
  )
}

function ProjectCardDesign({ project }: { project: ProjectItem }) {
  const hasPatterns = Boolean(project.patterns?.length)

  return (
    <li
      id={project.name === 'portfolio' ? 'portfolio-project' : undefined}
      className="project-item project-item--design"
      key={project.name}
    >
      <div className="project-heading">
        <p className="project-name">{project.name}</p>
        <span className={`project-status project-status--${project.status}`}>
          [{project.status}]
        </span>
      </div>

      {project.tags.length > 0 ? (
        <p className="design-card-tags">{project.tags.map((tag) => `#${tag}`).join(' ')}</p>
      ) : null}

      {project.systemNotes ? <p className="design-card-notes">{project.systemNotes}</p> : null}
      <p className="project-summary">{project.summary}</p>

      {hasPatterns ? (
        <p className="design-card-patterns">
          Patterns: {(project.patterns ?? []).join(' · ')}
        </p>
      ) : null}

      <div className="project-links">
        {project.links.map((link) =>
          link.href === '/design-system' ? (
            <DesignSystemLink key={`${project.name}-${link.label}`}>
              {link.label}
            </DesignSystemLink>
          ) : (
            <a key={`${project.name}-${link.label}`} href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ),
        )}
      </div>
    </li>
  )
}

function ProjectsSection({
  projects,
  cardVariant,
  showProjectTags,
  isOpen,
  isCollapsible,
  onToggle,
}: {
  projects: ProjectItem[]
  cardVariant: CardVariant
  showProjectTags: boolean
  isOpen: boolean
  isCollapsible: boolean
  onToggle: () => void
}) {
  return (
    <SectionFrame
      id="projects"
      label="Projects"
      command="ls projects/"
      isOpen={isOpen}
      isCollapsible={isCollapsible}
      onToggle={onToggle}
    >
      <ul className={`project-list project-list--${cardVariant}`}>
        {projects.map((project) => {
          if (cardVariant === 'design') {
            return <ProjectCardDesign key={project.name} project={project} />
          }

          return (
            <ProjectCardStandard
              key={project.name}
              project={project}
              showProjectTags={showProjectTags}
            />
          )
        })}
      </ul>
    </SectionFrame>
  )
}

function PostsSection({
  isOpen,
  isCollapsible,
  onToggle,
}: {
  isOpen: boolean
  isCollapsible: boolean
  onToggle: () => void
}) {
  return (
    <SectionFrame
      id="posts"
      label="Posts"
      command="ls posts/"
      isOpen={isOpen}
      isCollapsible={isCollapsible}
      onToggle={onToggle}
    >
      <ul className="post-list">
        {POSTS.map((post) => (
          <li className="post-item" key={post.title}>
            <p className="post-date">{post.date}</p>
            <div className="post-content">
              <p className="post-title">{post.title}</p>
              <p className="post-summary">{post.summary}</p>
            </div>
          </li>
        ))}
      </ul>
    </SectionFrame>
  )
}

function ExploreTerminal({
  isOpen,
  focusSignal,
  prefersReducedMotion,
}: {
  isOpen: boolean
  focusSignal: number
  prefersReducedMotion: boolean
}) {
  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const historyIdRef = useRef(1)

  const nextHistoryId = () => {
    historyIdRef.current += 1
    return historyIdRef.current
  }

  const focusInput = () => {
    const inputElement = inputRef.current
    if (!inputElement) {
      return
    }

    try {
      inputElement.focus({ preventScroll: true })
    } catch {
      inputElement.focus()
    }
  }

  const [commandInput, setCommandInput] = useState('')
  const [history, setHistory] = useState<TerminalHistoryItem[]>([
    { id: 1, kind: 'lines', lines: TERMINAL_INTRO_LINES },
  ])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    focusInput()
  }, [isOpen, focusSignal])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const outputElement = outputRef.current
    if (!outputElement) {
      return
    }

    outputElement.scrollTop = outputElement.scrollHeight
  }, [history, isOpen])

  const appendOutputLines = (lines: string[]) => {
    setHistory((previousHistory) => [
      ...previousHistory,
      { id: nextHistoryId(), kind: 'lines', lines },
    ])
  }

  const appendCommand = (command: string) => {
    setHistory((previousHistory) => [
      ...previousHistory,
      { id: nextHistoryId(), kind: 'command', command },
    ])
  }

  const jumpToSection = (sectionId: TerminalSectionId) => {
    const targetElement = document.getElementById(sectionId)
    if (!targetElement) {
      appendOutputLines([`Section not found: ${sectionId}`])
      return
    }

    targetElement.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })

    appendOutputLines([`Jumped to #${sectionId}.`])
  }

  const handleAutocomplete = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Tab') {
      return
    }

    event.preventDefault()

    const rawInput = commandInput.toLowerCase()
    const normalizedInput = rawInput.trim()

    if (!normalizedInput) {
      appendOutputLines([`Available commands: ${TERMINAL_COMMANDS.join(', ')}`])
      return
    }

    const hasTrailingSpace = rawInput.endsWith(' ')
    const [firstToken = '', secondToken = ''] = normalizedInput.split(/\s+/, 2)

    if (firstToken === 'open') {
      const sectionPrefix = hasTrailingSpace ? '' : secondToken
      const sectionMatches = TERMINAL_SECTIONS.filter((section) =>
        section.startsWith(sectionPrefix),
      )

      if (sectionMatches.length === 0) {
        appendOutputLines([`No completions for: ${normalizedInput}`])
        return
      }

      if (sectionMatches.length === 1) {
        const [match] = sectionMatches
        if (match) {
          setCommandInput(`open ${match}`)
        }
        return
      }

      const commonPrefix = sharedPrefix(sectionMatches)
      if (commonPrefix.length > sectionPrefix.length) {
        setCommandInput(`open ${commonPrefix}`)
        return
      }

      appendOutputLines([
        `Completions: ${sectionMatches.map((match) => `open ${match}`).join(', ')}`,
      ])
      return
    }

    if (normalizedInput.includes(' ')) {
      return
    }

    if (TERMINAL_COMMANDS.includes(firstToken as TerminalCommand)) {
      return
    }

    const commandMatches = TERMINAL_COMMANDS.filter((command) =>
      command.startsWith(firstToken),
    )

    if (commandMatches.length === 0) {
      appendOutputLines([`No completions for: ${normalizedInput}`])
      return
    }

    if (commandMatches.length === 1) {
      const [match] = commandMatches
      if (match) {
        setCommandInput(match)
      }
      return
    }

    const commonPrefix = sharedPrefix(commandMatches)
    if (commonPrefix.length > firstToken.length) {
      setCommandInput(commonPrefix)
      return
    }

    appendOutputLines([`Completions: ${commandMatches.join(', ')}`])
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const rawCommand = commandInput.trim()
    if (!rawCommand) {
      return
    }

    setCommandInput('')
    appendCommand(rawCommand)

    const normalizedCommand = rawCommand.toLowerCase()
    const [commandName = '', commandArg = ''] = normalizedCommand.split(/\s+/, 2)
    const resolvedCommand = resolveTerminalCommand(commandName)

    if (!resolvedCommand) {
      appendOutputLines([
        `Command not found: ${rawCommand}`,
        "Type 'help' to list available commands.",
      ])
      return
    }

    if (resolvedCommand === 'clear') {
      setHistory([{ id: nextHistoryId(), kind: 'lines', lines: TERMINAL_INTRO_LINES }])
      return
    }

    if (resolvedCommand === 'help') {
      appendOutputLines(buildHelpLines())
      return
    }

    if (resolvedCommand === 'open') {
      if (!commandArg) {
        appendOutputLines(OPEN_USAGE_LINES)
        return
      }

      if (!isTerminalSectionId(commandArg)) {
        appendOutputLines([
          `Unknown open target: ${commandArg}`,
          'Try: open about, open projects, or open contact',
        ])
        return
      }

      jumpToSection(commandArg)
      return
    }

    jumpToSection(resolvedCommand)
  }

  return (
    <section className="explore-terminal" aria-label="Interactive terminal">
      <div className="explore-terminal-output" ref={outputRef} onClick={focusInput}>
        {history.map((item) => {
          if (item.kind === 'command') {
            return (
              <p className="explore-terminal-command" key={item.id}>
                <span className="explore-terminal-prompt">kolton@dev:~$</span>
                <span>{item.command}</span>
              </p>
            )
          }

          return (
            <div className="explore-terminal-block" key={item.id}>
              {item.lines.map((line, index) => (
                <p className="explore-terminal-line" key={`${item.id}-${index}`}>
                  {line}
                </p>
              ))}
            </div>
          )
        })}
      </div>
      <form className="explore-terminal-input-row" onSubmit={handleSubmit}>
        <span className="explore-terminal-prompt" aria-hidden="true">
          kolton@dev:~$
        </span>
        <input
          ref={inputRef}
          className="explore-terminal-input"
          value={commandInput}
          onChange={(event) => setCommandInput(event.target.value)}
          onKeyDown={handleAutocomplete}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="help"
        />
      </form>
    </section>
  )
}

function PortfolioShell({
  view,
  sectionOpenState,
  onToggleSection,
}: {
  view: PortfolioView
  sectionOpenState: ExploreSectionOpenState
  onToggleSection: (sectionId: ExploreSectionId) => void
}) {
  const lensConfig = PORTFOLIO_LENS_CONFIG[view]

  const orderedProjects = useMemo(
    () => getOrderedProjectsForStrategy(PROJECTS, lensConfig.orderingStrategy),
    [lensConfig.orderingStrategy],
  )

  const isCollapsible = view !== 'standard'
  const sectionIsOpen = (sectionId: ExploreSectionId): boolean =>
    view === 'standard' ? true : sectionOpenState[sectionId]

  const renderedSections: Record<ExploreSectionId, ReactNode> = {
    about: (
      <AboutSection
        condensed={view === 'standard'}
        isOpen={sectionIsOpen('about')}
        isCollapsible={isCollapsible}
        onToggle={() => onToggleSection('about')}
      />
    ),
    experience: (
      <ExperienceSection
        isOpen={sectionIsOpen('experience')}
        isCollapsible={isCollapsible}
        onToggle={() => onToggleSection('experience')}
      />
    ),
    projects: (
      <ProjectsSection
        projects={orderedProjects}
        cardVariant={lensConfig.cardVariant}
        showProjectTags={lensConfig.cardVariant === 'standard' ? false : lensConfig.cardVariant === 'design'}
        isOpen={sectionIsOpen('projects')}
        isCollapsible={isCollapsible}
        onToggle={() => onToggleSection('projects')}
      />
    ),
    posts: (
      <PostsSection
        isOpen={sectionIsOpen('posts')}
        isCollapsible={isCollapsible}
        onToggle={() => onToggleSection('posts')}
      />
    ),
  }

  return (
    <div className="terminal-landing">
      <div className="portfolio-top-row">
        <TerminalNav inline />
      </div>

      {view === 'design' ? <LensHeaderDesign /> : null}

      {lensConfig.sectionOrder.map((sectionId) => (
        <div key={sectionId}>{renderedSections[sectionId]}</div>
      ))}
    </div>
  )
}

function DeveloperShell({
  sectionOpenState,
  onToggleSection,
}: {
  sectionOpenState: ExploreSectionOpenState
  onToggleSection: (sectionId: ExploreSectionId) => void
}) {
  return (
    <PortfolioShell
      view="standard"
      sectionOpenState={sectionOpenState}
      onToggleSection={onToggleSection}
    />
  )
}

function DesignPortfolioShell() {
  const orderedProjects = useMemo(
    () => getOrderedProjectsForStrategy(PROJECTS, 'design-focus'),
    [],
  )
  const featuredProject = orderedProjects.find((project) => project.featured) ?? orderedProjects[0]

  return (
    <div className="design-portfolio">
      <header className="design-hero">
        <div className="design-hero-copy">
          <p className="design-kicker">Software Engineer / Designer</p>
          <h1>Kolton Thompson</h1>
          <p className="design-hero-title">I design the product surface and build the system underneath it.</p>
          <p>
            Product-minded engineer focused on resilient user-facing systems,
            design systems, typed interfaces, and production-quality interaction
            design.
          </p>
          <div className="design-hero-links" aria-label="Primary links">
            {QUICK_LINKS.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="design-hero-panel" aria-label="Engineering profile">
          <p className="design-panel-label">Current Focus</p>
          <div className="design-code-card" aria-label="Engineering focus">
            <p><span>craft</span> engineering + design</p>
            <p><span>range</span> discovery → production</p>
            <p><span>strength</span> UI systems, UX, reliability</p>
          </div>
          <div className="design-stack-pills" aria-label="Technology stack">
            {['React', 'TypeScript', 'Design Systems', 'Reliability'].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <DesignSystemLink>
            Token Design System
            <ExternalLink size={18} strokeWidth={2.2} aria-hidden="true" />
          </DesignSystemLink>
        </div>
      </header>

      <section className="design-metrics" aria-label="Engineering strengths">
        <div>
          <span>01</span>
          <p>Product discovery through shipped UI</p>
        </div>
        <div>
          <span>02</span>
          <p>Design systems with engineering rigor</p>
        </div>
        <div>
          <span>03</span>
          <p>Production reliability without losing polish</p>
        </div>
      </section>

      {featuredProject ? (
        <section className="design-featured" aria-label="Featured project">
          <div className="design-section-heading">
            <p>Featured Build</p>
            <h2>Portfolio platform</h2>
          </div>
          <div className="design-featured-card">
            <div className="design-featured-main">
              <span className={`design-status design-status--${featuredProject.status}`}>
                {featuredProject.status}
              </span>
              <p>{featuredProject.systemNotes ?? featuredProject.summary}</p>
              <div className="design-tag-row">
                {featuredProject.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <div className="design-featured-side">
              <p>Patterns</p>
              {(featuredProject.patterns ?? []).map((pattern) => (
                <span key={pattern}>{pattern}</span>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="design-rail" aria-label="Project catalog">
        <div className="design-section-heading">
          <p>Project Index</p>
          <h2>Shipped and planned engineering systems</h2>
        </div>
        <div className="design-card-row">
          {orderedProjects.map((project) => (
            <article
              id={project.name === 'portfolio' ? 'portfolio-project' : undefined}
              className="design-project-card"
              key={project.name}
            >
              <div className="design-card-header">
                <span>{project.status}</span>
                {project.date ? <time dateTime={project.date}>{project.date}</time> : null}
              </div>
              <h3>{project.name}</h3>
              <p>{project.summary}</p>
              <div className="design-card-links">
                {project.links.map((link) =>
                  link.href === '/design-system' ? (
                    <DesignSystemLink key={`${project.name}-${link.label}`}>
                      {link.label}
                    </DesignSystemLink>
                  ) : (
                    <a key={`${project.name}-${link.label}`} href={link.href} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  ),
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="design-workbench" aria-label="Experience and writing">
        <div className="design-workbench-column">
          <div className="design-section-heading">
            <p>Capabilities</p>
            <h2>What I bring to a product team</h2>
          </div>
          <div className="design-capability-list">
            {EXPERIENCE.map((entry) => (
              <article key={entry.area}>
                <span>{entry.area}</span>
                <h3>{entry.title}</h3>
                <p>{entry.summary}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="design-writing-panel">
          <p className="design-panel-label">Writing</p>
          {POSTS.map((post) => (
            <article key={post.title}>
              <time>{post.date}</time>
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
            </article>
          ))}
        </aside>
      </section>
    </div>
  )
}

function GlobalModeDock() {
  const { mode, setMode } = usePortfolioMode()
  const isDeveloperMode = mode === 'developer'
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)
  const [terminalFocusSignal, setTerminalFocusSignal] = useState(0)
  const [isLensPopoverOpen, setIsLensPopoverOpen] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (!hasWindow()) {
      return false
    }

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  const lensPopoverRef = useRef<HTMLDivElement>(null)
  const lensToggleRef = useRef<HTMLButtonElement>(null)
  const terminalPanelIsVisible = isDeveloperMode && isTerminalOpen

  const openTerminalAndFocus = useCallback(() => {
    if (!isDeveloperMode) {
      return
    }

    setIsTerminalOpen(true)
    setTerminalFocusSignal((currentValue) => currentValue + 1)
  }, [isDeveloperMode])

  useEffect(() => {
    if (!hasWindow()) {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const onPreferenceChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', onPreferenceChange)

    return () => {
      mediaQuery.removeEventListener('change', onPreferenceChange)
    }
  }, [])

  useEffect(() => {
    if (!isLensPopoverOpen) {
      return
    }

    const onPointerDown = (event: PointerEvent) => {
      const targetNode = event.target as Node | null
      if (!targetNode) {
        return
      }

      if (lensPopoverRef.current?.contains(targetNode)) {
        return
      }

      if (lensToggleRef.current?.contains(targetNode)) {
        return
      }

      setIsLensPopoverOpen(false)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLensPopoverOpen(false)
      }
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isLensPopoverOpen])

  useEffect(() => {
    if (!isDeveloperMode) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'j') {
        event.preventDefault()
        setIsTerminalOpen((currentValue) => !currentValue)
        return
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        openTerminalAndFocus()
        return
      }

      if (
        event.key === '/' &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !isTypingTarget(event.target)
      ) {
        event.preventDefault()
        openTerminalAndFocus()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isDeveloperMode, openTerminalAndFocus])

  return (
    <div className="terminal-dock" data-open={terminalPanelIsVisible}>
      {isLensPopoverOpen ? (
        <div
          id="lens-mode-popover"
          className="lens-popover"
          ref={lensPopoverRef}
          role="dialog"
          aria-label="View selector"
        >
          <div className="lens-popover-list" role="radiogroup" aria-label="Portfolio view">
            {MODE_OPTIONS.map((option) => (
              <button
                key={option.value}
                className="lens-option"
                type="button"
                role="radio"
                aria-checked={option.value === mode}
                onClick={() => {
                  if (option.value !== 'developer') {
                    setIsTerminalOpen(false)
                  }
                  setMode(option.value)
                  setIsLensPopoverOpen(false)
                }}
              >
                <span className="lens-option-check" aria-hidden="true">
                  {option.value === mode ? '✓' : ''}
                </span>
                <span className="lens-option-copy">
                  <span className="lens-option-label">{option.label}</span>
                  <span className="lens-option-description">{option.description}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {isDeveloperMode ? (
        <div id="explore-terminal-panel" className="terminal-dock-panel" hidden={!terminalPanelIsVisible}>
          <ExploreTerminal
            isOpen={terminalPanelIsVisible}
            focusSignal={terminalFocusSignal}
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>
      ) : null}

      <div className="terminal-dock-bar terminal-dock-bar--developer">
        <div className="terminal-dock-bar-left">
          {isDeveloperMode ? (
            <button
              className="terminal-dock-toggle terminal-dock-toggle--prominent"
              type="button"
              onClick={() => setIsTerminalOpen((currentValue) => !currentValue)}
              aria-expanded={terminalPanelIsVisible}
              aria-controls="explore-terminal-panel"
            >
              <span className="terminal-dock-icon" aria-hidden="true">
                &gt;_
              </span>
              <span>{terminalPanelIsVisible ? 'close terminal' : 'open terminal'}</span>
            </button>
          ) : (
            <span className="terminal-dock-status">portfolio</span>
          )}
        </div>

        <div className="terminal-dock-meta">
          <button
            ref={lensToggleRef}
            className="terminal-lens-trigger"
            type="button"
            aria-expanded={isLensPopoverOpen}
            aria-controls="lens-mode-popover"
            onClick={() => setIsLensPopoverOpen((currentValue) => !currentValue)}
          >
            <span>View: {MODE_LABELS[mode]}</span>
            <span aria-hidden="true">▾</span>
          </button>
          {isDeveloperMode ? (
            <span className="terminal-dock-shortcut">cmd/ctrl + j · cmd/ctrl + k</span>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function ModeGate({
  sectionOpenState,
  onToggleSection,
}: {
  sectionOpenState: ExploreSectionOpenState
  onToggleSection: (sectionId: ExploreSectionId) => void
}) {
  const { mode } = usePortfolioMode()

  if (mode === 'developer') {
    return (
      <DeveloperShell
        sectionOpenState={sectionOpenState}
        onToggleSection={onToggleSection}
      />
    )
  }

  if (mode === 'design') {
    return <DesignPortfolioShell />
  }

  return (
    <PortfolioShell
      view={mode}
      sectionOpenState={sectionOpenState}
      onToggleSection={onToggleSection}
    />
  )
}

function App() {
  const initialMode = readStoredMode()
  const initialPortfolioView: PortfolioView =
    initialMode === 'developer' ? 'standard' : initialMode

  const [theme, setTheme] = useState<ThemeMode>(() => readStoredTheme())
  const [modeState, setModeState] = useState<PortfolioMode>(initialMode)
  const [portfolioSectionOpenState, setPortfolioSectionOpenState] =
    useState<ExploreSectionOpenState>(() =>
      cloneSectionState(
        PORTFOLIO_LENS_CONFIG[initialPortfolioView].defaultExpandedSections,
      ),
    )

  const lastPortfolioViewRef = useRef<PortfolioView>(initialPortfolioView)
  const portfolioSectionInteractionRef = useRef<Record<ExploreSectionId, boolean>>({
    about: false,
    experience: false,
    projects: false,
    posts: false,
  })

  const applyPortfolioDefaults = (view: Exclude<PortfolioView, 'standard'>) => {
    const defaults = PORTFOLIO_LENS_CONFIG[view].defaultExpandedSections

    setPortfolioSectionOpenState((previousState) => {
      let changed = false
      const nextState = { ...previousState }

      for (const sectionId of Object.keys(defaults) as ExploreSectionId[]) {
        if (portfolioSectionInteractionRef.current[sectionId]) {
          continue
        }

        if (nextState[sectionId] !== defaults[sectionId]) {
          changed = true
          nextState[sectionId] = defaults[sectionId]
        }
      }

      return changed ? nextState : previousState
    })
  }

  const setMode = (nextMode: PortfolioMode) => {
    if (nextMode === 'developer') {
      if (modeState !== 'developer') {
        lastPortfolioViewRef.current = modeState
      }

      setModeState('developer')
      return
    }

    lastPortfolioViewRef.current = nextMode

    if (nextMode === 'standard') {
      setPortfolioSectionOpenState(
        cloneSectionState(PORTFOLIO_LENS_CONFIG.standard.defaultExpandedSections),
      )
    } else {
      applyPortfolioDefaults(nextMode)
    }

    setModeState(nextMode)
  }

  const switchToPortfolio = () => {
    setMode(lastPortfolioViewRef.current)
  }

  const onTogglePortfolioSection = (sectionId: ExploreSectionId) => {
    portfolioSectionInteractionRef.current[sectionId] = true

    setPortfolioSectionOpenState((previousState) => ({
      ...previousState,
      [sectionId]: !previousState[sectionId],
    }))
  }

  useEffect(() => {
    safeLocalStorageSet(THEME_STORAGE_KEY, theme)
    document.documentElement.style.colorScheme = theme
  }, [theme])

  useEffect(() => {
    safeLocalStorageSet(PORTFOLIO_MODE_STORAGE_KEY, modeState)
  }, [modeState])

  const modeContextValue: PortfolioModeContextValue = {
    mode: modeState,
    setMode,
    switchToPortfolio,
  }

  return (
    <PortfolioModeContext.Provider value={modeContextValue}>
      <main className={`app-shell theme-${theme} mode-${modeState}`}>
        <GlobalTopControls theme={theme} onThemeChange={setTheme} />
        <ModeGate
          sectionOpenState={portfolioSectionOpenState}
          onToggleSection={onTogglePortfolioSection}
        />
        <GlobalModeDock />
      </main>
    </PortfolioModeContext.Provider>
  )
}

export default App
