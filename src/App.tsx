import {
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

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
}

type PostItem = {
  date: string
  title: string
  summary: string
}

type ThemeMode = 'dark' | 'light'
type ProfileMode = 'professional' | 'explore'
type ExploreLensMode = 'standard' | 'developer' | 'client' | 'design'
type ExploreSectionId = 'about' | 'experience' | 'projects' | 'posts'
type TerminalSectionId = 'about' | 'projects' | 'contact'
type TerminalCommand = 'help' | 'about' | 'projects' | 'contact' | 'open' | 'clear'

type TerminalHistoryItem =
  | { id: number; kind: 'command'; command: string }
  | { id: number; kind: 'lines'; lines: string[] }

type ToggleGroupProps<T extends string> = {
  label: string
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

type LensOption = {
  value: ExploreLensMode
  label: string
  description: string
}

type ExploreSectionOpenState = Record<ExploreSectionId, boolean>

type LensConfig = {
  sectionOrder: ExploreSectionId[]
  sectionDefaults: ExploreSectionOpenState
  terminalDefaultOpen: boolean
  terminalProminent: boolean
  showProjectTags: boolean
}

const THEME_STORAGE_KEY = 'kt-theme'
const PROFILE_STORAGE_KEY = 'kt-profile-mode'
const EXPLORE_LENS_STORAGE_KEY = 'exploreModeLens'

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
    name: 'terminal-portfolio',
    status: 'live',
    summary:
      'The previous terminal command interface for this site, kept as a working project and reference implementation.',
    tags: ['react', 'typescript', 'vite', 'vercel'],
    links: [
      { label: 'live', href: 'https://kolton.dev' },
      {
        label: 'source',
        href: 'https://github.com/misterkolton/kt.dev.portfolio',
      },
    ],
  },
  {
    name: 'incident-playbook-kit',
    status: 'active',
    summary:
      'Practical templates and runbook patterns for triage, communication, and post-incident system hardening.',
    tags: ['ops', 'reliability', 'playbooks'],
    links: [{ label: 'github', href: 'https://github.com/misterkolton' }],
  },
  {
    name: 'service-contract-lab',
    status: 'planned',
    summary:
      'A sandbox for testing versioned API contracts and backward-compatibility checks before release windows.',
    tags: ['api', 'contracts', 'testing'],
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

const EXPLORE_SECTION_IDS: ExploreSectionId[] = [
  'about',
  'experience',
  'projects',
  'posts',
]

const LENS_OPTIONS: LensOption[] = [
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
    value: 'client',
    label: 'Client',
    description: 'Outcomes and narrative first.',
  },
  {
    value: 'design',
    label: 'Design',
    description: 'UI decisions and system focus.',
  },
]

const LENS_LABELS: Record<ExploreLensMode, string> = {
  standard: 'Standard',
  developer: 'Developer',
  client: 'Client',
  design: 'Design',
}

const LENS_CONFIG: Record<ExploreLensMode, LensConfig> = {
  standard: {
    sectionOrder: ['about', 'experience', 'projects', 'posts'],
    sectionDefaults: {
      about: true,
      experience: true,
      projects: true,
      posts: true,
    },
    terminalDefaultOpen: false,
    terminalProminent: false,
    showProjectTags: false,
  },
  developer: {
    sectionOrder: ['projects', 'experience', 'posts', 'about'],
    sectionDefaults: {
      about: false,
      experience: false,
      projects: true,
      posts: true,
    },
    terminalDefaultOpen: true,
    terminalProminent: true,
    showProjectTags: true,
  },
  client: {
    sectionOrder: ['about', 'experience', 'projects', 'posts'],
    sectionDefaults: {
      about: true,
      experience: true,
      projects: true,
      posts: false,
    },
    terminalDefaultOpen: false,
    terminalProminent: false,
    showProjectTags: false,
  },
  design: {
    sectionOrder: ['projects', 'about', 'experience', 'posts'],
    sectionDefaults: {
      about: true,
      experience: false,
      projects: true,
      posts: true,
    },
    terminalDefaultOpen: false,
    terminalProminent: false,
    showProjectTags: true,
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
  'terminal ready (explore mode)',
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

const TERMINAL_IMPACT_TAGS = new Set(['reliability', 'ops', 'playbooks'])

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

const STATUS_PRIORITY: Record<ProjectStatus, number> = {
  live: 3,
  active: 2,
  planned: 1,
}

const OPEN_USAGE_LINES = ['Usage: open <about|projects|contact>']

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
    // ignored intentionally
  }
}

const isExploreLensMode = (value: string | null): value is ExploreLensMode =>
  value === 'standard' ||
  value === 'developer' ||
  value === 'client' ||
  value === 'design'

const readStoredTheme = (): ThemeMode =>
  safeLocalStorageGet(THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark'

const readStoredProfileMode = (): ProfileMode =>
  safeLocalStorageGet(PROFILE_STORAGE_KEY) === 'explore' ? 'explore' : 'professional'

const readStoredExploreLens = (): ExploreLensMode => {
  const storedValue = safeLocalStorageGet(EXPLORE_LENS_STORAGE_KEY)
  return isExploreLensMode(storedValue) ? storedValue : 'standard'
}

const countMatchingTags = (tags: string[], matcher: Set<string>): number =>
  tags.reduce(
    (count, tag) => (matcher.has(tag.toLowerCase()) ? count + 1 : count),
    0,
  )

const hasLensSignal = (projects: ProjectItem[], matcher: Set<string>): boolean =>
  projects.some((project) => countMatchingTags(project.tags, matcher) > 0)

const scoreProjectForLens = (project: ProjectItem, lensMode: ExploreLensMode): number => {
  const statusScore = STATUS_PRIORITY[project.status]

  if (lensMode === 'developer') {
    return countMatchingTags(project.tags, TERMINAL_ENGINEERING_TAGS) * 10 + statusScore
  }

  if (lensMode === 'client') {
    return countMatchingTags(project.tags, TERMINAL_IMPACT_TAGS) * 10 + statusScore
  }

  if (lensMode === 'design') {
    return countMatchingTags(project.tags, TERMINAL_DESIGN_TAGS) * 10 + statusScore
  }

  return statusScore
}

const getOrderedProjects = (
  projects: ProjectItem[],
  lensMode: ExploreLensMode,
): ProjectItem[] => {
  if (lensMode === 'standard') {
    return projects
  }

  if (lensMode === 'client' && !hasLensSignal(projects, TERMINAL_IMPACT_TAGS)) {
    return projects
  }

  if (lensMode === 'design' && !hasLensSignal(projects, TERMINAL_DESIGN_TAGS)) {
    return projects
  }

  const rankedProjects = projects.map((project, index) => ({
    index,
    project,
    score: scoreProjectForLens(project, lensMode),
  }))

  rankedProjects.sort((projectA, projectB) => {
    if (projectB.score !== projectA.score) {
      return projectB.score - projectA.score
    }

    return projectA.index - projectB.index
  })

  return rankedProjects.map((entry) => entry.project)
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

function TopRightMenu({
  theme,
  onThemeChange,
  profileMode,
  onProfileModeChange,
}: {
  theme: ThemeMode
  onThemeChange: (value: ThemeMode) => void
  profileMode: ProfileMode
  onProfileModeChange: (value: ProfileMode) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

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

  return (
    <div className="top-right-menu">
      <button
        ref={triggerRef}
        className="top-right-menu-trigger"
        type="button"
        aria-label="Open appearance and mode settings"
        aria-expanded={isOpen}
        aria-controls="top-right-menu-popover"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        ⋯
      </button>

      {isOpen ? (
        <div
          id="top-right-menu-popover"
          ref={popoverRef}
          className="top-right-menu-popover"
          role="dialog"
          aria-label="Appearance and mode settings"
        >
          <ToggleGroup
            label="theme"
            value={theme}
            onChange={(value) => {
              onThemeChange(value)
              setIsOpen(false)
            }}
            options={[
              { value: 'dark', label: 'dark' },
              { value: 'light', label: 'light' },
            ]}
          />
          <ToggleGroup
            label="mode"
            value={profileMode}
            onChange={(value) => {
              onProfileModeChange(value)
              setIsOpen(false)
            }}
            options={[
              { value: 'professional', label: 'overview' },
              { value: 'explore', label: 'workspace' },
            ]}
          />
        </div>
      ) : null}
    </div>
  )
}

function TerminalNav() {
  return (
    <nav className="terminal-nav" aria-label="Section navigation">
      <span className="terminal-nav-label">jump:</span>
      <a href="#about">about</a>
      <a href="#projects">projects</a>
      <a href="#terminal-project">terminal-project</a>
      <a href="#contact">contact</a>
    </nav>
  )
}

function AboutSection({
  profileMode,
  isOpen,
  isCollapsible,
  onToggle,
}: {
  profileMode: ProfileMode
  isOpen: boolean
  isCollapsible: boolean
  onToggle: () => void
}) {
  const visibleParagraphs =
    profileMode === 'professional' ? ABOUT_PARAGRAPHS.slice(0, 3) : ABOUT_PARAGRAPHS

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

function ProjectsSection({
  projects,
  showProjectTags,
  isOpen,
  isCollapsible,
  onToggle,
}: {
  projects: ProjectItem[]
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
      <ul className="project-list">
        {projects.map((project) => (
          <li
            id={project.name === 'terminal-portfolio' ? 'terminal-project' : undefined}
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
              <p className="project-tags">
                {project.tags.map((tag) => `#${tag}`).join(' ')}
              </p>
            ) : null}
            <div className="project-links">
              {project.links.map((link) => (
                <a key={`${project.name}-${link.label}`} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
            </div>
          </li>
        ))}
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

function App() {
  const initialProfileMode = readStoredProfileMode()
  const initialLensMode = readStoredExploreLens()

  const [theme, setTheme] = useState<ThemeMode>(() => readStoredTheme())
  const [profileMode, setProfileMode] = useState<ProfileMode>(initialProfileMode)
  const [exploreLensMode, setExploreLensMode] =
    useState<ExploreLensMode>(initialLensMode)
  const [isTerminalOpen, setIsTerminalOpen] = useState(
    initialProfileMode === 'explore'
      ? LENS_CONFIG[initialLensMode].terminalDefaultOpen
      : false,
  )
  const [terminalFocusSignal, setTerminalFocusSignal] = useState(0)
  const [isLensPopoverOpen, setIsLensPopoverOpen] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (!hasWindow()) {
      return false
    }

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  const [exploreSectionOpenState, setExploreSectionOpenState] =
    useState<ExploreSectionOpenState>(() =>
      initialProfileMode === 'explore'
        ? LENS_CONFIG[initialLensMode].sectionDefaults
        : LENS_CONFIG.standard.sectionDefaults,
    )

  const sectionInteractionRef = useRef<Record<ExploreSectionId, boolean>>({
    about: false,
    experience: false,
    projects: false,
    posts: false,
  })
  const lensPopoverRef = useRef<HTMLDivElement>(null)
  const lensToggleRef = useRef<HTMLButtonElement>(null)

  const activeLensConfig = LENS_CONFIG[exploreLensMode]

  const orderedProjects = useMemo(
    () =>
      profileMode === 'explore'
        ? getOrderedProjects(PROJECTS, exploreLensMode)
        : PROJECTS,
    [profileMode, exploreLensMode],
  )

  const sectionOrder =
    profileMode === 'explore'
      ? activeLensConfig.sectionOrder
      : (['about', 'experience', 'projects'] as const)

  const setExploreDefaultsForLens = (lensMode: ExploreLensMode) => {
    const defaults = LENS_CONFIG[lensMode].sectionDefaults

    setExploreSectionOpenState((previousState) => {
      let hasChanges = false
      const nextState: ExploreSectionOpenState = { ...previousState }

      for (const sectionId of EXPLORE_SECTION_IDS) {
        if (sectionInteractionRef.current[sectionId]) {
          continue
        }

        if (nextState[sectionId] !== defaults[sectionId]) {
          hasChanges = true
          nextState[sectionId] = defaults[sectionId]
        }
      }

      return hasChanges ? nextState : previousState
    })
  }

  const openTerminalAndFocus = () => {
    setIsTerminalOpen(true)
    setTerminalFocusSignal((currentSignal) => currentSignal + 1)
  }

  const handleProfileModeChange = (value: ProfileMode) => {
    setProfileMode(value)

    if (value === 'explore') {
      setExploreDefaultsForLens(exploreLensMode)
      setIsTerminalOpen(LENS_CONFIG[exploreLensMode].terminalDefaultOpen)
      return
    }

    setIsTerminalOpen(false)
    setIsLensPopoverOpen(false)
  }

  const handleExploreLensChange = (lensMode: ExploreLensMode) => {
    setExploreLensMode(lensMode)
    setIsLensPopoverOpen(false)

    if (profileMode !== 'explore') {
      return
    }

    setExploreDefaultsForLens(lensMode)
    setIsTerminalOpen(LENS_CONFIG[lensMode].terminalDefaultOpen)
  }

  const handleToggleSection = (sectionId: ExploreSectionId) => {
    sectionInteractionRef.current[sectionId] = true

    setExploreSectionOpenState((previousState) => ({
      ...previousState,
      [sectionId]: !previousState[sectionId],
    }))
  }

  useEffect(() => {
    safeLocalStorageSet(THEME_STORAGE_KEY, theme)
    document.documentElement.style.colorScheme = theme
  }, [theme])

  useEffect(() => {
    safeLocalStorageSet(PROFILE_STORAGE_KEY, profileMode)
  }, [profileMode])

  useEffect(() => {
    safeLocalStorageSet(EXPLORE_LENS_STORAGE_KEY, exploreLensMode)
  }, [exploreLensMode])

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

    const selectedOption = lensPopoverRef.current?.querySelector<HTMLButtonElement>(
      'button[aria-checked="true"]',
    )

    if (selectedOption) {
      const focusFrame = window.requestAnimationFrame(() => {
        try {
          selectedOption.focus({ preventScroll: true })
        } catch {
          selectedOption.focus()
        }
      })

      return () => {
        window.cancelAnimationFrame(focusFrame)
      }
    }

    return undefined
  }, [isLensPopoverOpen])

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
    const onKeyDown = (event: KeyboardEvent) => {
      if (profileMode !== 'explore') {
        return
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'j') {
        event.preventDefault()
        setIsTerminalOpen((currentValue) => !currentValue)
        return
      }

      if (exploreLensMode !== 'developer') {
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
  }, [profileMode, exploreLensMode])

  const isExploreMode = profileMode === 'explore'

  const sectionIsOpen = (sectionId: ExploreSectionId): boolean =>
    isExploreMode ? exploreSectionOpenState[sectionId] : true

  const sectionIsCollapsible = isExploreMode

  const renderedSections: Record<ExploreSectionId, ReactNode> = {
    about: (
      <AboutSection
        profileMode={profileMode}
        isOpen={sectionIsOpen('about')}
        isCollapsible={sectionIsCollapsible}
        onToggle={() => handleToggleSection('about')}
      />
    ),
    experience: (
      <ExperienceSection
        isOpen={sectionIsOpen('experience')}
        isCollapsible={sectionIsCollapsible}
        onToggle={() => handleToggleSection('experience')}
      />
    ),
    projects: (
      <ProjectsSection
        projects={orderedProjects}
        showProjectTags={isExploreMode ? activeLensConfig.showProjectTags : false}
        isOpen={sectionIsOpen('projects')}
        isCollapsible={sectionIsCollapsible}
        onToggle={() => handleToggleSection('projects')}
      />
    ),
    posts: (
      <PostsSection
        isOpen={sectionIsOpen('posts')}
        isCollapsible={sectionIsCollapsible}
        onToggle={() => handleToggleSection('posts')}
      />
    ),
  }

  return (
    <main className={`app-shell theme-${theme} mode-${profileMode}`}>
      <div className="terminal-landing">
        <TopRightMenu
          theme={theme}
          onThemeChange={setTheme}
          profileMode={profileMode}
          onProfileModeChange={handleProfileModeChange}
        />
        <TerminalNav />

        {sectionOrder.map((sectionId) => (
          <div key={sectionId}>{renderedSections[sectionId]}</div>
        ))}
      </div>

      {isExploreMode ? (
        <div className="terminal-dock" data-open={isTerminalOpen}>
          {isLensPopoverOpen ? (
            <div
              id="lens-mode-popover"
              className="lens-popover"
              ref={lensPopoverRef}
              role="dialog"
              aria-label="Mode selector"
            >
              <div className="lens-popover-list" role="radiogroup" aria-label="Explore lens mode">
                {LENS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    className="lens-option"
                    type="button"
                    role="radio"
                    aria-checked={option.value === exploreLensMode}
                    onClick={() => handleExploreLensChange(option.value)}
                  >
                    <span className="lens-option-check" aria-hidden="true">
                      {option.value === exploreLensMode ? '✓' : ''}
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

          <div id="explore-terminal-panel" className="terminal-dock-panel" hidden={!isTerminalOpen}>
            <ExploreTerminal
              isOpen={isTerminalOpen}
              focusSignal={terminalFocusSignal}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>

          <div
            className={`terminal-dock-bar ${
              activeLensConfig.terminalProminent ? 'terminal-dock-bar--developer' : ''
            }`}
          >
            <div className="terminal-dock-bar-left">
              <button
                className={`terminal-dock-toggle ${
                  activeLensConfig.terminalProminent ? 'terminal-dock-toggle--prominent' : ''
                }`}
                type="button"
                onClick={() => setIsTerminalOpen((currentValue) => !currentValue)}
                aria-expanded={isTerminalOpen}
                aria-controls="explore-terminal-panel"
              >
                <span className="terminal-dock-icon" aria-hidden="true">
                  &gt;_
                </span>
                <span>{isTerminalOpen ? 'close terminal' : 'open terminal'}</span>
              </button>
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
                <span>Mode: {LENS_LABELS[exploreLensMode]}</span>
                <span aria-hidden="true">▾</span>
              </button>
              <span className="terminal-dock-shortcut">
                {exploreLensMode === 'developer' ? 'cmd/ctrl + k' : 'cmd/ctrl + j'}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}

export default App
