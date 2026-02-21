import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react'

type SectionId = 'about' | 'projects' | 'contact'
type CommandName = 'help' | 'about' | 'projects' | 'contact' | 'open' | 'clear'

type CommandResult =
  | { kind: 'lines'; lines: string[] }
  | { kind: 'section'; sectionId: SectionId }
  | { kind: 'clear' }

type HistoryItem =
  | { id: number; kind: 'command'; command: string }
  | { id: number; kind: 'lines'; lines: string[] }

type Project = {
  name: string
  description: string
  links: { label: string; href: string }[]
}

type ContactLink = {
  label: string
  value: string
  href: string
}

const INTRO_LINES = [
  'Welcome to kolton.dev.',
  "Type 'help' to see available commands.",
]

const HELP_LINES = [
  'Available commands:',
  'about      open background section',
  'projects   open project highlights',
  'contact    open contact links',
  'open       open <about|projects|contact>',
  'clear      reset terminal output',
]

const OPEN_USAGE_LINES = ['Usage: open <about|projects|contact>']

const COMMAND_MAP: Record<CommandName, CommandResult> = {
  help: { kind: 'lines', lines: HELP_LINES },
  about: { kind: 'section', sectionId: 'about' },
  projects: { kind: 'section', sectionId: 'projects' },
  contact: { kind: 'section', sectionId: 'contact' },
  open: { kind: 'lines', lines: OPEN_USAGE_LINES },
  clear: { kind: 'clear' },
}

const COMMAND_SUGGESTIONS = Object.keys(COMMAND_MAP).sort()

const COMMAND_ALIASES: Record<string, CommandName> = {
  '?': 'help',
  ls: 'help',
}

const PROJECTS: Project[] = [
  {
    name: 'kt.dev portfolio',
    description:
      'Terminal-style portfolio built with React, TypeScript, and Vite. Focused on clean interactions and fast load times.',
    links: [
      { label: 'live', href: 'https://kolton.dev' },
      {
        label: 'source',
        href: 'https://github.com/misterkolton/kt.dev.portfolio',
      },
    ],
  },
  {
    name: 'open-source sandbox',
    description:
      'Collection of active experiments and archived prototypes used to test interface and tooling ideas.',
    links: [{ label: 'github', href: 'https://github.com/misterkolton' }],
  },
]

const CONTACT_LINKS: ContactLink[] = [
  {
    label: 'website',
    value: 'kolton.dev',
    href: 'https://kolton.dev',
  },
  {
    label: 'github',
    value: 'github.com/misterkolton',
    href: 'https://github.com/misterkolton',
  },
  {
    label: 'source',
    value: 'kt.dev.portfolio',
    href: 'https://github.com/misterkolton/kt.dev.portfolio',
  },
]

const ABOUT_PARAGRAPHS = [
  'I build software that users interact with directly, and I take responsibility for how those systems behave in production.',
  'Much of my work begins before implementation. I spend time in design and discovery, working through flows, constraints, and tradeoffs with product early so problems are well understood before they turn into code. From there I own solutions end to end, from architecture and implementation through iteration, scaling, and long term maintenance.',
  'I have led large scale redesigns and foundational changes in production systems, making decisions that balanced delivery pressure with the need to improve reliability, performance, and extensibility. I have designed and maintained shared systems used across teams, worked across application and service layers, and owned interfaces and data contracts that had to remain stable as products evolved.',
  'I operate comfortably in environments where things break and timelines move. I have handled production incidents, resolved regressions under pressure, and made tradeoffs with incomplete information while keeping systems stable and teams unblocked.',
  'I value clarity in systems and in decisions. I think about how software is understood months or years later, not just how it works at launch. I am looking for teams building complex products, tackling ambiguous problems, and valuing engineers who can move from uncertainty to execution with sound judgment.',
] as const

const DEFAULT_VISIBLE_SECTIONS: SectionId[] = ['about']

let historyId = 0

const nextHistoryId = () => {
  historyId += 1
  return historyId
}

const buildInitialHistory = (): HistoryItem[] => [
  { id: nextHistoryId(), kind: 'lines', lines: INTRO_LINES },
]

const isCommandName = (value: string): value is CommandName => value in COMMAND_MAP

const isSectionId = (value: string): value is SectionId =>
  value === 'about' || value === 'projects' || value === 'contact'

const resolveCommandName = (value: string): CommandName | null => {
  const mappedValue = COMMAND_ALIASES[value] ?? value
  if (!isCommandName(mappedValue)) {
    return null
  }

  return mappedValue
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

function AboutSection() {
  return (
    <section id="about" className="terminal-section" aria-label="About section">
      <h2 className="section-title">about</h2>
      {ABOUT_PARAGRAPHS.map((paragraph) => (
        <p className="section-copy" key={paragraph}>
          {paragraph}
        </p>
      ))}
    </section>
  )
}

function ProjectsSection() {
  return (
    <section
      id="projects"
      className="terminal-section"
      aria-label="Projects section"
    >
      <h2 className="section-title">projects</h2>
      <ul className="resource-list">
        {PROJECTS.map((project) => (
          <li className="resource-item" key={project.name}>
            <div className="resource-row">
              <p className="resource-label">name</p>
              <p className="resource-value">{project.name}</p>
            </div>
            <p className="resource-description">{project.description}</p>
            <div className="link-row">
              {project.links.map((link) => (
                <a
                  className="link-pill"
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
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

function ContactSection() {
  return (
    <section id="contact" className="terminal-section" aria-label="Contact section">
      <h2 className="section-title">contact</h2>
      <ul className="resource-list">
        {CONTACT_LINKS.map((item) => (
          <li className="resource-item" key={item.label}>
            <div className="resource-row">
              <p className="resource-label">{item.label}</p>
              <a
                className="resource-link"
                href={item.href}
                target="_blank"
                rel="noreferrer"
              >
                {item.value}
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function renderSection(sectionId: SectionId) {
  switch (sectionId) {
    case 'about':
      return <AboutSection />
    case 'projects':
      return <ProjectsSection />
    case 'contact':
      return <ContactSection />
    default:
      return null
  }
}

function App() {
  const [history, setHistory] = useState<HistoryItem[]>(() => buildInitialHistory())
  const [visibleSections, setVisibleSections] = useState<SectionId[]>(
    DEFAULT_VISIBLE_SECTIONS,
  )
  const [commandInput, setCommandInput] = useState('')

  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const outputElement = outputRef.current
    if (!outputElement) {
      return
    }

    outputElement.scrollTop = outputElement.scrollHeight
  }, [history, visibleSections])

  const appendOutputLines = (lines: string[]) => {
    setHistory((previousHistory) => [
      ...previousHistory,
      { id: nextHistoryId(), kind: 'lines', lines },
    ])
  }

  const handleCommandAutocomplete = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Tab') {
      return
    }

    event.preventDefault()

    const normalizedInput = commandInput.trim().toLowerCase()

    if (!normalizedInput) {
      appendOutputLines([`Available commands: ${COMMAND_SUGGESTIONS.join(', ')}`])
      return
    }

    if (normalizedInput.startsWith('open')) {
      const hasTrailingSpace = commandInput.endsWith(' ')
      const [, partialSection = ''] = normalizedInput.split(/\s+/, 2)
      const sectionPrefix =
        hasTrailingSpace && normalizedInput === 'open'
          ? ''
          : partialSection

      const sectionMatches = (
        ['about', 'projects', 'contact'] as const
      ).filter((section) => section.startsWith(sectionPrefix))

      if (sectionMatches.length === 0) {
        appendOutputLines([`No completions for: ${normalizedInput}`])
        return
      }

      if (sectionMatches.length === 1) {
        const [match] = sectionMatches
        setCommandInput(`open ${match}`)
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

    if (COMMAND_SUGGESTIONS.includes(normalizedInput)) {
      return
    }

    const matches = COMMAND_SUGGESTIONS.filter((command) =>
      command.startsWith(normalizedInput),
    )

    if (matches.length === 0) {
      appendOutputLines([`No completions for: ${normalizedInput}`])
      return
    }

    if (matches.length === 1) {
      setCommandInput(matches[0] ?? normalizedInput)
      return
    }

    const commonPrefix = sharedPrefix(matches)
    if (commonPrefix.length > normalizedInput.length) {
      setCommandInput(commonPrefix)
      return
    }

    appendOutputLines([`Completions: ${matches.join(', ')}`])
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const rawCommand = commandInput.trim()
    if (!rawCommand) {
      return
    }

    setCommandInput('')

    const normalizedCommand = rawCommand.toLowerCase()
    const [commandName, commandArg = ''] = normalizedCommand.split(/\s+/, 2)
    const resolvedCommand = resolveCommandName(commandName ?? '')

    if (!resolvedCommand) {
      setHistory((previousHistory) => [
        ...previousHistory,
        { id: nextHistoryId(), kind: 'command', command: rawCommand },
        {
          id: nextHistoryId(),
          kind: 'lines',
          lines: [
            `Command not found: ${rawCommand}`,
            "Type 'help' to list available commands.",
          ],
        },
      ])
      return
    }

    if (resolvedCommand === 'open') {
      if (!commandArg) {
        setHistory((previousHistory) => [
          ...previousHistory,
          { id: nextHistoryId(), kind: 'command', command: rawCommand },
          { id: nextHistoryId(), kind: 'lines', lines: OPEN_USAGE_LINES },
        ])
        return
      }

      if (!isSectionId(commandArg)) {
        setHistory((previousHistory) => [
          ...previousHistory,
          { id: nextHistoryId(), kind: 'command', command: rawCommand },
          {
            id: nextHistoryId(),
            kind: 'lines',
            lines: [
              `Unknown open target: ${commandArg}`,
              'Try: open about, open projects, or open contact',
            ],
          },
        ])
        return
      }

      setVisibleSections((previousSections) => {
        if (previousSections.includes(commandArg)) {
          return previousSections
        }

        return [...previousSections, commandArg]
      })

      setHistory((previousHistory) => [
        ...previousHistory,
        { id: nextHistoryId(), kind: 'command', command: rawCommand },
        {
          id: nextHistoryId(),
          kind: 'lines',
          lines: [`Showing ${commandArg}.`],
        },
      ])
      return
    }

    const commandResult = COMMAND_MAP[resolvedCommand]

    if (commandResult.kind === 'clear') {
      setHistory(buildInitialHistory())
      setVisibleSections(DEFAULT_VISIBLE_SECTIONS)
      return
    }

    if (commandResult.kind === 'section') {
      setVisibleSections((previousSections) => {
        if (previousSections.includes(commandResult.sectionId)) {
          return previousSections
        }

        return [...previousSections, commandResult.sectionId]
      })

      setHistory((previousHistory) => [
        ...previousHistory,
        { id: nextHistoryId(), kind: 'command', command: rawCommand },
        {
          id: nextHistoryId(),
          kind: 'lines',
          lines: [`Showing ${commandResult.sectionId}.`],
        },
      ])
      return
    }

    setHistory((previousHistory) => [
      ...previousHistory,
      { id: nextHistoryId(), kind: 'command', command: rawCommand },
      { id: nextHistoryId(), kind: 'lines', lines: commandResult.lines },
    ])
  }

  return (
    <main className="app-shell">
      <section className="terminal-window" aria-label="Terminal portfolio interface">
        <header className="terminal-topbar">
          <div className="window-controls" aria-hidden="true">
            <span className="window-dot window-dot--red" />
            <span className="window-dot window-dot--yellow" />
            <span className="window-dot window-dot--green" />
          </div>
          <p className="terminal-title">kolton.dev :: portfolio</p>
        </header>

        <div
          className="terminal-body"
          ref={outputRef}
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((item) => {
            if (item.kind === 'command') {
              return (
                <p className="command-line" key={item.id}>
                  <span className="prompt">kolton@dev:~$</span>
                  <span className="command-text">{item.command}</span>
                </p>
              )
            }

            return (
              <div className="terminal-block" key={item.id}>
                {item.lines.map((line, index) => (
                  <p className="terminal-line" key={`${item.id}-${index}`}>
                    {line}
                  </p>
                ))}
              </div>
            )
          })}

          {visibleSections.map((sectionId) => (
            <div className="terminal-block" key={sectionId}>
              {renderSection(sectionId)}
            </div>
          ))}
        </div>

        <form className="terminal-input-row" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="terminal-command">
            Terminal command
          </label>
          <span className="prompt" aria-hidden="true">
            kolton@dev:~$
          </span>
          <input
            id="terminal-command"
            className="terminal-input"
            value={commandInput}
            onChange={(event) => setCommandInput(event.target.value)}
            onKeyDown={handleCommandAutocomplete}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="type a command (help)"
            ref={inputRef}
          />
          <span className="cursor" aria-hidden="true" />
        </form>
      </section>
    </main>
  )
}

export default App
