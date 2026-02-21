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

function CommandHeading({ command }: { command: string }) {
  return (
    <p className="command-heading">
      <span className="prompt-marker">&gt;</span>
      <span>{command}</span>
    </p>
  )
}

function AboutSection() {
  return (
    <section id="about" className="section-block" aria-label="About">
      <CommandHeading command="cat about.txt" />
      <h1 className="hero-name">Kolton Thompson</h1>
      <p className="hero-lead">{ABOUT_LEAD}</p>
      <div className="about-copy">
        {ABOUT_PARAGRAPHS.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div id="contact" className="quick-links" aria-label="Contact links">
        {QUICK_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
          >
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

function ProjectsSection() {
  return (
    <section id="projects" className="section-block" aria-label="Projects">
      <CommandHeading command="ls projects/" />
      <ul className="project-list">
        {PROJECTS.map((project) => (
          <li className="project-item" key={project.name}>
            <div className="project-heading">
              <p className="project-name">{project.name}</p>
              <span className={`project-status project-status--${project.status}`}>
                [{project.status}]
              </span>
            </div>
            <p className="project-summary">{project.summary}</p>
            <p className="project-tags">
              {project.tags.map((tag) => `#${tag}`).join(' ')}
            </p>
            <div className="project-links">
              {project.links.map((link) => (
                <a
                  key={`${project.name}-${link.label}`}
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

function App() {
  return (
    <main className="app-shell">
      <div className="terminal-landing">
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <PostsSection />
      </div>
    </main>
  )
}

export default App
