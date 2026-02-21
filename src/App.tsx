import {
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
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
type TerminalSectionId = 'about' | 'projects' | 'contact'
type TerminalCommand =
  | 'help'
  | 'about'
  | 'projects'
  | 'contact'
  | 'open'
  | 'modules'
  | 'effects'
  | 'clear'
type ModuleId = 'console' | 'navigator' | 'explorer'
type TerminalModuleEvent = Extract<ModuleId, 'console' | 'navigator'>
type EffectsSubcommand = 'celebrate'

type TerminalHistoryItem =
  | { id: number; kind: 'command'; command: string }
  | { id: number; kind: 'lines'; lines: string[] }

type ToggleGroupProps<T extends string> = {
  label: string
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

type ModuleDefinition = {
  id: ModuleId
  label: string
  hint: string
}

type ModulesProgressState = Record<ModuleId, boolean>

type TerminalNotice = {
  id: number
  lines: string[]
}

const THEME_STORAGE_KEY = 'kt-theme'
const PROFILE_STORAGE_KEY = 'kt-profile-mode'
const EXPLORE_FRE_SEEN_STORAGE_KEY = 'kt-explore-fre-seen'
const EXPLORE_FRE_DISMISSED_STORAGE_KEY = 'kt-explore-fre-dismissed'
const MODULES_PROGRESS_STORAGE_KEY = 'kt-explore-modules-v1'

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

const MODULE_DEFINITIONS: ModuleDefinition[] = [
  {
    id: 'console',
    label: 'Console Key',
    hint: "Run 'help' in the terminal.",
  },
  {
    id: 'navigator',
    label: 'Navigator Key',
    hint: "Use terminal navigation (about/projects/contact/open).",
  },
  {
    id: 'explorer',
    label: 'Explorer Key',
    hint: 'Open a project link from the projects list.',
  },
]

const MODULE_LOOKUP: Record<ModuleId, ModuleDefinition> = {
  console: MODULE_DEFINITIONS[0],
  navigator: MODULE_DEFINITIONS[1],
  explorer: MODULE_DEFINITIONS[2],
}

const DEFAULT_MODULES_PROGRESS: ModulesProgressState = {
  console: false,
  navigator: false,
  explorer: false,
}

const EFFECTS_SUBCOMMANDS: EffectsSubcommand[] = ['celebrate']

const TERMINAL_COMMANDS: TerminalCommand[] = [
  'help',
  'about',
  'projects',
  'contact',
  'open',
  'modules',
  'effects',
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

const OPEN_USAGE_LINES = ['Usage: open <about|projects|contact>']
const EFFECTS_USAGE_LINES = ['Usage: effects <celebrate>']

const countUnlockedModules = (modulesProgress: ModulesProgressState): number =>
  MODULE_DEFINITIONS.reduce(
    (count, moduleDefinition) =>
      modulesProgress[moduleDefinition.id] ? count + 1 : count,
    0,
  )

const areEffectsUnlocked = (modulesProgress: ModulesProgressState): boolean =>
  countUnlockedModules(modulesProgress) === MODULE_DEFINITIONS.length

const nextModuleDefinition = (
  modulesProgress: ModulesProgressState,
): ModuleDefinition | null =>
  MODULE_DEFINITIONS.find((moduleDefinition) => !modulesProgress[moduleDefinition.id]) ??
  null

const readStoredBoolean = (storageKey: string): boolean => {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(storageKey) === '1'
}

const readStoredModulesProgress = (): ModulesProgressState => {
  if (typeof window === 'undefined') {
    return DEFAULT_MODULES_PROGRESS
  }

  const storedValue = window.localStorage.getItem(MODULES_PROGRESS_STORAGE_KEY)
  if (!storedValue) {
    return DEFAULT_MODULES_PROGRESS
  }

  try {
    const parsedValue = JSON.parse(storedValue) as Partial<ModulesProgressState>

    return {
      console: parsedValue.console === true,
      navigator: parsedValue.navigator === true,
      explorer: parsedValue.explorer === true,
    }
  } catch {
    return DEFAULT_MODULES_PROGRESS
  }
}

const buildHelpLines = (modulesProgress: ModulesProgressState): string[] => {
  const moduleCount = countUnlockedModules(modulesProgress)
  const effectsUnlocked = areEffectsUnlocked(modulesProgress)

  return [
    'Available commands:',
    'about      jump to about section',
    'projects   jump to projects section',
    'contact    jump to contact links',
    'open       open <about|projects|contact>',
    `modules    show module progress (${moduleCount}/${MODULE_DEFINITIONS.length})`,
    `effects    effect controls (${effectsUnlocked ? 'unlocked' : 'locked'})`,
    'clear      clear terminal output',
  ]
}

const buildModulesLines = (modulesProgress: ModulesProgressState): string[] => {
  const unlockedCount = countUnlockedModules(modulesProgress)
  const effectsUnlocked = areEffectsUnlocked(modulesProgress)
  const nextModule = nextModuleDefinition(modulesProgress)

  return [
    `Modules: ${unlockedCount}/${MODULE_DEFINITIONS.length}`,
    ...MODULE_DEFINITIONS.map((moduleDefinition) => {
      const statusLabel = modulesProgress[moduleDefinition.id] ? '[x]' : '[ ]'
      return `${statusLabel} ${moduleDefinition.label} - ${moduleDefinition.hint}`
    }),
    effectsUnlocked
      ? "Effects module is unlocked. Try: effects celebrate"
      : `Next unlock: ${nextModule?.label ?? 'n/a'}`,
  ]
}

const isTerminalSectionId = (value: string): value is TerminalSectionId =>
  TERMINAL_SECTIONS.includes(value as TerminalSectionId)

const isTerminalCommand = (value: string): value is TerminalCommand =>
  TERMINAL_COMMANDS.includes(value as TerminalCommand)

const isEffectsSubcommand = (value: string): value is EffectsSubcommand =>
  EFFECTS_SUBCOMMANDS.includes(value as EffectsSubcommand)

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

function CommandHeading({ command }: { command: string }) {
  return (
    <p className="command-heading">
      <span className="prompt-marker">&gt;</span>
      <span>{command}</span>
    </p>
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

function ControlBar({
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
  return (
    <div className="control-bar">
      <ToggleGroup
        label="theme"
        value={theme}
        onChange={onThemeChange}
        options={[
          { value: 'dark', label: 'dark' },
          { value: 'light', label: 'light' },
        ]}
      />
      <ToggleGroup
        label="mode"
        value={profileMode}
        onChange={onProfileModeChange}
        options={[
          { value: 'professional', label: 'professional' },
          { value: 'explore', label: 'explore' },
        ]}
      />
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

function AboutSection({ profileMode }: { profileMode: ProfileMode }) {
  const visibleParagraphs =
    profileMode === 'professional' ? ABOUT_PARAGRAPHS.slice(0, 3) : ABOUT_PARAGRAPHS

  return (
    <section id="about" className="section-block" aria-label="About">
      <CommandHeading command="cat about.txt" />
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
    </section>
  )
}

function ExperienceSection() {
  return (
    <section className="section-block" aria-label="Experience">
      <CommandHeading command="ls experience/" />
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
    </section>
  )
}

function ProjectsSection({
  profileMode,
  onProjectLinkOpen,
}: {
  profileMode: ProfileMode
  onProjectLinkOpen?: (projectName: string, linkLabel: string) => void
}) {
  return (
    <section id="projects" className="section-block" aria-label="Projects">
      <CommandHeading command="ls projects/" />
      <ul className="project-list">
        {PROJECTS.map((project) => (
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
            {profileMode === 'explore' ? (
              <p className="project-tags">
                {project.tags.map((tag) => `#${tag}`).join(' ')}
              </p>
            ) : null}
            <div className="project-links">
              {project.links.map((link) => (
                <a
                  key={`${project.name}-${link.label}`}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => onProjectLinkOpen?.(project.name, link.label)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function PostsSection() {
  return (
    <section className="section-block" aria-label="Posts">
      <CommandHeading command="ls posts/" />
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
    </section>
  )
}

function ExploreTerminal({
  isOpen,
  modulesProgress,
  effectsUnlocked,
  externalNotice,
  prefersReducedMotion,
  onModuleEvent,
  onCelebrate,
}: {
  isOpen: boolean
  modulesProgress: ModulesProgressState
  effectsUnlocked: boolean
  externalNotice: TerminalNotice | null
  prefersReducedMotion: boolean
  onModuleEvent: (moduleId: TerminalModuleEvent) => void
  onCelebrate: () => void
}) {
  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const historyIdRef = useRef(1)
  const lastNoticeIdRef = useRef(0)

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
  }, [isOpen])

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

  useEffect(() => {
    if (!externalNotice || externalNotice.id === lastNoticeIdRef.current) {
      return
    }

    lastNoticeIdRef.current = externalNotice.id

    const frameId = window.requestAnimationFrame(() => {
      setHistory((previousHistory) => [
        ...previousHistory,
        { id: nextHistoryId(), kind: 'lines', lines: externalNotice.lines },
      ])
    })

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [externalNotice])

  const appendCommand = (command: string) => {
    setHistory((previousHistory) => [
      ...previousHistory,
      { id: nextHistoryId(), kind: 'command', command },
    ])
  }

  const jumpToSection = (sectionId: TerminalSectionId, trackNavigatorModule = false) => {
    const targetElement = document.getElementById(sectionId)
    if (!targetElement) {
      appendOutputLines([`Section not found: ${sectionId}`])
      return
    }

    targetElement.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })

    if (trackNavigatorModule) {
      onModuleEvent('navigator')
    }

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

    if (firstToken === 'effects') {
      const effectPrefix = hasTrailingSpace ? '' : secondToken
      const effectMatches = EFFECTS_SUBCOMMANDS.filter((subcommand) =>
        subcommand.startsWith(effectPrefix),
      )

      if (effectMatches.length === 0) {
        appendOutputLines([`No completions for: ${normalizedInput}`])
        return
      }

      if (effectMatches.length === 1) {
        const [match] = effectMatches
        if (match) {
          setCommandInput(`effects ${match}`)
        }
        return
      }

      const commonPrefix = sharedPrefix(effectMatches)
      if (commonPrefix.length > effectPrefix.length) {
        setCommandInput(`effects ${commonPrefix}`)
        return
      }

      appendOutputLines([
        `Completions: ${effectMatches.map((match) => `effects ${match}`).join(', ')}`,
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
      appendOutputLines(buildHelpLines(modulesProgress))
      onModuleEvent('console')
      return
    }

    if (resolvedCommand === 'modules') {
      appendOutputLines(buildModulesLines(modulesProgress))
      return
    }

    if (resolvedCommand === 'effects') {
      if (!commandArg) {
        if (!effectsUnlocked) {
          appendOutputLines([
            'Effects module is locked.',
            `Module progress: ${countUnlockedModules(modulesProgress)}/${MODULE_DEFINITIONS.length}`,
          ])
          return
        }

        appendOutputLines([
          'Effects module is available.',
          'Run: effects celebrate',
        ])
        return
      }

      if (!isEffectsSubcommand(commandArg)) {
        appendOutputLines(EFFECTS_USAGE_LINES)
        return
      }

      if (!effectsUnlocked) {
        appendOutputLines([
          'Effects module is locked.',
          "Finish all modules first. Try 'modules'.",
        ])
        return
      }

      if (prefersReducedMotion) {
        appendOutputLines([
          'Effects celebrate is disabled because reduced motion is enabled.',
        ])
        return
      }

      onCelebrate()
      appendOutputLines(['Effect triggered: celebrate'])
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

      jumpToSection(commandArg, true)
      return
    }

    jumpToSection(resolvedCommand, true)
  }

  return (
    <section className="explore-terminal" aria-label="Interactive terminal">
      <div
        className="explore-terminal-output"
        ref={outputRef}
        onClick={focusInput}
      >
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

function ConfettiLayer({ burstToken }: { burstToken: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (burstToken === 0) {
      return
    }

    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')
    if (!context) {
      return
    }

    type ConfettiParticle = {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string
      life: number
      rotation: number
      spin: number
    }

    const colors = ['#30d0d9', '#39e9a3', '#9ab8ff', '#ffd166', '#f28482', '#cdb4ff']
    const particles: ConfettiParticle[] = []
    const particleCount = 100

    const random = (min: number, max: number) => Math.random() * (max - min) + min

    for (let index = 0; index < particleCount; index += 1) {
      particles.push({
        x: window.innerWidth * 0.5 + random(-40, 40),
        y: window.innerHeight - 40,
        vx: random(-4.3, 4.3),
        vy: random(-11.5, -4.8),
        size: random(4, 8),
        color: colors[index % colors.length] ?? colors[0],
        life: random(850, 1700),
        rotation: random(0, Math.PI * 2),
        spin: random(-0.2, 0.2),
      })
    }

    const resize = () => {
      const ratio = Math.max(1, window.devicePixelRatio || 1)
      const width = window.innerWidth
      const height = window.innerHeight

      canvas.width = Math.floor(width * ratio)
      canvas.height = Math.floor(height * ratio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    resize()

    const startAt = performance.now()
    let frameId = 0

    const renderFrame = (now: number) => {
      const elapsed = now - startAt
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)

      for (const particle of particles) {
        const lifeRatio = 1 - elapsed / particle.life
        if (lifeRatio <= 0) {
          continue
        }

        particle.vy += 0.12
        particle.x += particle.vx
        particle.y += particle.vy
        particle.rotation += particle.spin

        context.save()
        context.globalAlpha = lifeRatio
        context.fillStyle = particle.color
        context.translate(particle.x, particle.y)
        context.rotate(particle.rotation)
        context.fillRect(-particle.size * 0.5, -particle.size * 0.5, particle.size, particle.size * 0.62)
        context.restore()
      }

      if (elapsed < 1900) {
        frameId = window.requestAnimationFrame(renderFrame)
      } else {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight)
      }
    }

    frameId = window.requestAnimationFrame(renderFrame)
    window.addEventListener('resize', resize)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)
    }
  }, [burstToken])

  return <canvas className="confetti-layer" ref={canvasRef} aria-hidden="true" />
}

function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const storedTheme =
      typeof window !== 'undefined'
        ? window.localStorage.getItem(THEME_STORAGE_KEY)
        : null

    return storedTheme === 'light' ? 'light' : 'dark'
  })
  const [profileMode, setProfileMode] = useState<ProfileMode>(() => {
    const storedProfileMode =
      typeof window !== 'undefined'
        ? window.localStorage.getItem(PROFILE_STORAGE_KEY)
        : null

    return storedProfileMode === 'explore' ? 'explore' : 'professional'
  })
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)
  const [hasSeenExploreFRE, setHasSeenExploreFRE] = useState(() =>
    readStoredBoolean(EXPLORE_FRE_SEEN_STORAGE_KEY),
  )
  const [isExploreFreDismissed, setIsExploreFreDismissed] = useState(() =>
    readStoredBoolean(EXPLORE_FRE_DISMISSED_STORAGE_KEY),
  )
  const [modulesProgress, setModulesProgress] = useState<ModulesProgressState>(() =>
    readStoredModulesProgress(),
  )
  const [isModulesPopoverOpen, setIsModulesPopoverOpen] = useState(false)
  const [terminalNotice, setTerminalNotice] = useState<TerminalNotice | null>(null)
  const [confettiBurstToken, setConfettiBurstToken] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  const modulesProgressRef = useRef(modulesProgress)
  const terminalNoticeIdRef = useRef(0)
  const modulesPopoverRef = useRef<HTMLDivElement>(null)
  const modulesToggleRef = useRef<HTMLButtonElement>(null)

  const unlockedModuleCount = countUnlockedModules(modulesProgress)
  const effectsUnlocked = areEffectsUnlocked(modulesProgress)
  const nextModule = nextModuleDefinition(modulesProgress)

  const pushTerminalNotice = (lines: string[]) => {
    terminalNoticeIdRef.current += 1
    setTerminalNotice({
      id: terminalNoticeIdRef.current,
      lines,
    })
  }

  const unlockModule = (moduleId: ModuleId) => {
    const currentProgress = modulesProgressRef.current
    if (currentProgress[moduleId]) {
      return
    }

    const nextProgress: ModulesProgressState = {
      ...currentProgress,
      [moduleId]: true,
    }

    modulesProgressRef.current = nextProgress
    setModulesProgress(nextProgress)

    const unlockedCount = countUnlockedModules(nextProgress)
    const moduleLabel = MODULE_LOOKUP[moduleId].label
    const noticeLines = [
      `Module progress: ${unlockedCount}/${MODULE_DEFINITIONS.length} (${moduleLabel} acquired).`,
    ]

    if (unlockedCount === MODULE_DEFINITIONS.length) {
      noticeLines.push("Effects module available. Type 'effects'.")
    }

    pushTerminalNotice(noticeLines)
  }

  const handleProfileModeChange = (value: ProfileMode) => {
    setProfileMode(value)

    if (value === 'explore' && !hasSeenExploreFRE) {
      setHasSeenExploreFRE(true)
    }

    if (value !== 'explore') {
      setIsTerminalOpen(false)
      setIsModulesPopoverOpen(false)
      setTerminalNotice(null)
    }
  }

  useEffect(() => {
    modulesProgressRef.current = modulesProgress
  }, [modulesProgress])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    document.documentElement.style.colorScheme = theme
  }, [theme])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(PROFILE_STORAGE_KEY, profileMode)
  }, [profileMode])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(
      EXPLORE_FRE_SEEN_STORAGE_KEY,
      hasSeenExploreFRE ? '1' : '0',
    )
  }, [hasSeenExploreFRE])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(
      EXPLORE_FRE_DISMISSED_STORAGE_KEY,
      isExploreFreDismissed ? '1' : '0',
    )
  }, [isExploreFreDismissed])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(
      MODULES_PROGRESS_STORAGE_KEY,
      JSON.stringify(modulesProgress),
    )
  }, [modulesProgress])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches)
    }

    updatePreference()

    mediaQuery.addEventListener('change', updatePreference)

    return () => {
      mediaQuery.removeEventListener('change', updatePreference)
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (profileMode !== 'explore') {
        return
      }

      if ((!event.metaKey && !event.ctrlKey) || event.key.toLowerCase() !== 'j') {
        return
      }

      event.preventDefault()
      setIsTerminalOpen((currentValue) => !currentValue)
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [profileMode])

  useEffect(() => {
    if (!isModulesPopoverOpen) {
      return
    }

    const onPointerDown = (event: PointerEvent) => {
      const targetNode = event.target as Node | null
      if (!targetNode) {
        return
      }

      if (modulesPopoverRef.current?.contains(targetNode)) {
        return
      }

      if (modulesToggleRef.current?.contains(targetNode)) {
        return
      }

      setIsModulesPopoverOpen(false)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModulesPopoverOpen(false)
      }
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isModulesPopoverOpen])

  const shouldShowExploreTip =
    profileMode === 'explore' && !isExploreFreDismissed && !isModulesPopoverOpen

  return (
    <main className={`app-shell theme-${theme} mode-${profileMode}`}>
      <div className="terminal-landing">
        <ControlBar
          theme={theme}
          onThemeChange={setTheme}
          profileMode={profileMode}
          onProfileModeChange={handleProfileModeChange}
        />
        <TerminalNav />
        <AboutSection profileMode={profileMode} />
        <ExperienceSection />
        <ProjectsSection
          profileMode={profileMode}
          onProjectLinkOpen={
            profileMode === 'explore'
              ? () => {
                  unlockModule('explorer')
                }
              : undefined
          }
        />
        {profileMode === 'explore' ? <PostsSection /> : null}
      </div>

      {profileMode === 'explore' ? (
        <>
          {!prefersReducedMotion ? <ConfettiLayer burstToken={confettiBurstToken} /> : null}

          <div className="terminal-dock" data-open={isTerminalOpen}>
            {shouldShowExploreTip ? (
              <div className="fre-tip" role="note" aria-live="polite">
                <p className="fre-tip-copy">
                  This is your command bar. Type <code>help</code>.
                </p>
                <div className="fre-tip-actions">
                  {!isTerminalOpen ? (
                    <button
                      className="fre-tip-button"
                      type="button"
                      onClick={() => setIsTerminalOpen(true)}
                    >
                      open terminal
                    </button>
                  ) : null}
                  <button
                    className="fre-tip-button"
                    type="button"
                    onClick={() => setIsExploreFreDismissed(true)}
                  >
                    dismiss
                  </button>
                </div>
              </div>
            ) : null}

            {isModulesPopoverOpen ? (
              <div
                id="modules-popover"
                className="modules-popover"
                ref={modulesPopoverRef}
                role="dialog"
                aria-label="Modules progress"
              >
                <p className="modules-popover-title">modules</p>
                <p className="modules-popover-progress">
                  {unlockedModuleCount}/{MODULE_DEFINITIONS.length} unlocked
                </p>
                <ul className="modules-popover-list">
                  {MODULE_DEFINITIONS.map((moduleDefinition) => (
                    <li key={moduleDefinition.id} className="modules-popover-item">
                      <span
                        className="modules-popover-state"
                        data-active={modulesProgress[moduleDefinition.id]}
                      >
                        {modulesProgress[moduleDefinition.id] ? '[x]' : '[ ]'}
                      </span>
                      <span className="modules-popover-label">
                        {moduleDefinition.label}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="modules-popover-footnote">
                  {effectsUnlocked
                    ? "effects unlocked. try 'effects celebrate'."
                    : `next: ${nextModule?.label ?? 'n/a'}`}
                </p>
              </div>
            ) : null}

            <div
              id="explore-terminal-panel"
              className="terminal-dock-panel"
              hidden={!isTerminalOpen}
            >
              <ExploreTerminal
                isOpen={isTerminalOpen}
                modulesProgress={modulesProgress}
                effectsUnlocked={effectsUnlocked}
                externalNotice={terminalNotice}
                prefersReducedMotion={prefersReducedMotion}
                onModuleEvent={unlockModule}
                onCelebrate={() => setConfettiBurstToken((currentValue) => currentValue + 1)}
              />
            </div>

            <div className="terminal-dock-bar">
              <div className="terminal-dock-bar-left">
                <button
                  className="terminal-dock-toggle"
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
                  ref={modulesToggleRef}
                  className="terminal-modules-pill"
                  type="button"
                  data-unlocked={effectsUnlocked}
                  onClick={() =>
                    setIsModulesPopoverOpen((currentValue) => !currentValue)
                  }
                  aria-expanded={isModulesPopoverOpen}
                  aria-controls="modules-popover"
                >
                  <span>modules {unlockedModuleCount}/{MODULE_DEFINITIONS.length}</span>
                  {effectsUnlocked ? <span> - effects</span> : null}
                </button>
                <span className="terminal-dock-shortcut">cmd/ctrl + j</span>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </main>
  )
}

export default App
