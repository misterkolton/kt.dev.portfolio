import * as React from 'react'

import './index.css'

import { ComponentExample } from '@/components/docs/component-example'
import { DocsSidebar } from '@/components/docs/sidebar'
import { ThemeToggle } from '@/components/docs/theme-toggle'
import { ComingSoon } from '@/components/docs/coming-soon'
import { ALL_COMPONENT_ITEMS, SIDEBAR_SECTIONS } from '@/components/docs/sidebar-data'
import { Button } from '@/components/ui/button'
import { Anchor } from '@/components/ui/anchor'
import { Avatar } from '@/components/ui/avatar'
import { AnimatedCheckmark } from '@/components/ui/animated-checkmark'
import { Badge } from '@/components/ui/badge'
import { Bar } from '@/components/ui/bar'
import { Capsule } from '@/components/ui/capsule'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ColorsDocs } from '@/components/docs/colors'
import { IconsCatalog } from '@/components/docs/icons'
import { Icon } from '@/components/ui/icon'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Prose } from '@/components/ui/prose'
import { Items, Item, ItemGroup } from '@/components/ui/items'
import { ArticleCard } from '@/components/article-card/ArticleCard'
import { ToastProvider } from '@/components/ui/toast'
import Section from '@/components/ui/section'

const buttonVariantsPreview = (
  <div className="flex flex-wrap gap-3">
    <Button>Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="accent">Accent</Button>
    <Button variant="success">Success</Button>
    <Button variant="warning">Warning</Button>
    <Button variant="danger">Danger</Button>
    <Button variant="smoke">Smoke</Button>
    <Button variant="shadow">Shadow</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="subtle">Subtle</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="link">Link</Button>
  </div>
)

const buttonVariantsCode = `import { Button } from "@/components/ui/button"

export function ButtonVariants() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="success">Success</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="smoke">Smoke</Button>
      <Button variant="shadow">Shadow</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="subtle">Subtle</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  )
}`

const buttonLayoutPreview = (
  <div className="flex flex-wrap gap-3">
    <Button size="sm">Small</Button>
    <Button>Default</Button>
    <Button size="lg">Large</Button>
    <Button size="xl">Extra Large</Button>
    <Button variant="secondary" fullWidth>
      Full Width
    </Button>
    <Button variant="shadow" elevated>
      Elevated Shadow
    </Button>
    <Button size="icon" aria-label="Search">
      <span className="sr-only">Search</span>🔍
    </Button>
  </div>
)

const buttonLayoutCode = `import { Button } from "@/components/ui/button"

export function ButtonLayout() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
      <Button variant="secondary" fullWidth>
        Full Width
      </Button>
      <Button variant="shadow" elevated>
        Elevated Shadow
      </Button>
      <Button size="icon" aria-label="Search">
        <span className="sr-only">Search</span>🔍
      </Button>
    </div>
  )
}`

const buttonCompositionPreview = (
  <div className="flex flex-wrap gap-3">
    <Button asChild>
      <a href="#cta">Link as Button</a>
    </Button>
    <Button disabled>Disabled</Button>
  </div>
)

const buttonCompositionCode = `import { Button } from "@/components/ui/button"

export function ButtonComposition() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button asChild>
        <a href="#cta">Link as Button</a>
      </Button>
      <Button disabled>Disabled</Button>
    </div>
  )
}`

const anchorPreview = (
  <div className="flex flex-wrap items-center gap-4">
    <Anchor href="#">Default Link</Anchor>
    <Anchor href="#" decorated>
      Decorated
    </Anchor>
    <Anchor href="#" tone="muted">
      Muted
    </Anchor>
    <Anchor href="#" tone="primary" target="_blank">
      External Target
    </Anchor>
  </div>
)

const anchorCode = `import { Anchor } from "@/components/ui/anchor"

export function AnchorExamples() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Anchor href="#">Default Link</Anchor>
      <Anchor href="#" decorated>Decorated</Anchor>
      <Anchor href="#" tone="muted">Muted</Anchor>
      <Anchor href="#" tone="primary" target="_blank">External Target</Anchor>
    </div>
  )
}`

const animatedCheckmarkPreview = (
  <div className="flex flex-wrap items-center gap-6">
    <AnimatedCheckmark />
    <AnimatedCheckmark filled />
    <AnimatedCheckmark tone="success" />
    <AnimatedCheckmark tone="warning" />
    <AnimatedCheckmark tone="danger" />
    <AnimatedCheckmark size="large" replayOnHover />
  </div>
)

const animatedCheckmarkCode = `import { AnimatedCheckmark } from "@/components/ui/animated-checkmark"\n\nexport function AnimatedCheckmarkExamples() {\n  return (\n    <div className=\"flex flex-wrap items-center gap-6\">\n      <AnimatedCheckmark />\n      <AnimatedCheckmark filled />\n      <AnimatedCheckmark tone=\"success\" />\n      <AnimatedCheckmark tone=\"warning\" />\n      <AnimatedCheckmark tone=\"danger\" />\n      <AnimatedCheckmark size=\"large\" replayOnHover />\n    </div>\n  )\n}`

const badgePreview = (
  <div className="flex flex-wrap items-center gap-4">
    <Badge item={1} />
    <Badge item={9} />
    <Badge item={12} />
    <Badge>New</Badge>
    <Badge tone="secondary">Beta</Badge>
    <Badge tone="success">Live</Badge>
    <Badge tone="warning">Warn</Badge>
    <Badge tone="danger">Fail</Badge>
    <Badge icon={<Icon name="bell" size="xSmall" decorative />}>Alert</Badge>
  </div>
)

const badgeCode = `import { Badge } from \"@/components/ui/badge\"\nimport { Icon } from \"@/components/ui/icon\"\n\nexport function BadgeExamples() {\n  return (\n    <div className=\"flex flex-wrap items-center gap-4\">\n      <Badge item={1} />\n      <Badge item={9} />\n      <Badge item={12} />\n      <Badge>New</Badge>\n      <Badge tone=\"secondary\">Beta</Badge>\n      <Badge tone=\"success\">Live</Badge>\n      <Badge tone=\"warning\">Warn</Badge>\n      <Badge tone=\"danger\">Fail</Badge>\n      <Badge icon={<Icon name=\"bell\" size=\"xSmall\" decorative />} >Alert</Badge>\n    </div>\n  )\n}`

const barPreview = (
  <div className="flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <Bar width={64} height={8} tone="muted" />
      <Bar width={128} height={8} tone="primary" />
      <Bar width={192} height={8} tone="success" />
    </div>
    <div className="flex items-end gap-3" style={{ height: 80 }}>
      <Bar width={8} height={24} tone="danger" />
      <Bar width={8} height={40} tone="warning" />
      <Bar width={8} height={64} tone="accent" />
    </div>
  </div>
)

const barCode = `import { Bar } from "@/components/ui/bar"\n\nexport function BarExamples() {\n  return (\n    <div className=\"flex flex-col gap-4\">\n      <div className=\"flex items-center gap-3\">\n        <Bar width={64} height={8} tone=\"muted\" />\n        <Bar width={128} height={8} tone=\"primary\" />\n        <Bar width={192} height={8} tone=\"success\" />\n      </div>\n      <div className=\"flex items-end gap-3\" style={{ height: 80 }}>\n        <Bar width={8} height={24} tone=\"danger\" />\n        <Bar width={8} height={40} tone=\"warning\" />\n        <Bar width={8} height={64} tone=\"accent\" />\n      </div>\n    </div>\n  )\n}`

const capsulePreview = (
  <div className="flex flex-wrap items-center gap-4">
    <Capsule>Success</Capsule>
    <Capsule tone="primary">Primary</Capsule>
    <Capsule tone="secondary">Secondary</Capsule>
    <Capsule tone="accent">Accent</Capsule>
    <Capsule tone="warning">Warning</Capsule>
    <Capsule tone="danger" shadow="sm">
      Danger
    </Capsule>
    <Capsule size="xSmall">XS</Capsule>
    <Capsule size="large">Large</Capsule>
  </div>
)

const capsuleCode = `import { Capsule } from "@/components/ui/capsule"\n\nexport function CapsuleExamples() {\n  return (\n    <div className=\"flex flex-wrap items-center gap-4\">\n      <Capsule>Success</Capsule>\n      <Capsule tone=\"primary\">Primary</Capsule>\n      <Capsule tone=\"secondary\">Secondary</Capsule>\n      <Capsule tone=\"accent\">Accent</Capsule>\n      <Capsule tone=\"warning\">Warning</Capsule>\n      <Capsule tone=\"danger\" shadow=\"sm\">Danger</Capsule>\n      <Capsule size=\"xSmall\">XS</Capsule>\n      <Capsule size=\"large\">Large</Capsule>\n    </div>\n  )\n}`

const cardPreview = (
  <div className="grid gap-6 md:grid-cols-2">
    <Card>
      <CardHeader>
        <CardTitle>Basic Card</CardTitle>
        <CardDescription>Header, content, and footer slots.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Use CardHeader, CardContent, and CardFooter to organize content.
        </p>
      </CardContent>
      <CardFooter>
        <Badge>New</Badge>
      </CardFooter>
    </Card>

    <Card elevated hoverable>
      <CardHeader>
        <CardTitle>Elevated + Hoverable</CardTitle>
        <CardDescription>Shadow increases on hover.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-20 rounded-md bg-muted" />
      </CardContent>
      <CardFooter>
        <Anchor href="#">Learn more</Anchor>
      </CardFooter>
    </Card>

    <Card center className="h-32">
      <div className="text-sm text-muted-foreground">Centered content</div>
    </Card>

    <Card className="overflow-hidden">
      <div className="h-24 w-full bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20" />
      <CardContent className="pt-4">
        <CardTitle className="text-base">Media Card</CardTitle>
        <CardDescription>Combine with images or charts.</CardDescription>
      </CardContent>
    </Card>
  </div>
)

const cardCode = `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"\nimport { Anchor } from "@/components/ui/anchor"\nimport { Badge } from "@/components/ui/badge"\n\nexport function CardExamples() {\n  return (\n    <div className=\"grid gap-6 md:grid-cols-2\">\n      <Card>\n        <CardHeader>\n          <CardTitle>Basic Card</CardTitle>\n          <CardDescription>Header, content, and footer slots.</CardDescription>\n        </CardHeader>\n        <CardContent>\n          <p className=\"text-sm text-muted-foreground\">Use CardHeader, CardContent, and CardFooter to organize content.</p>\n        </CardContent>\n        <CardFooter>\n          <Badge>New</Badge>\n        </CardFooter>\n      </Card>\n\n      <Card elevated hoverable>\n        <CardHeader>\n          <CardTitle>Elevated + Hoverable</CardTitle>\n          <CardDescription>Shadow increases on hover.</CardDescription>\n        </CardHeader>\n        <CardContent>\n          <div className=\"h-20 rounded-md bg-muted\" />\n        </CardContent>\n        <CardFooter>\n          <Anchor href=\"#\">Learn more</Anchor>\n        </CardFooter>\n      </Card>\n\n      <Card center className=\"h-32\">\n        <div className=\"text-sm text-muted-foreground\">Centered content</div>\n      </Card>\n\n      <Card className=\"overflow-hidden\">\n        <div className=\"h-24 w-full bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20\" />\n        <CardContent className=\"pt-4\">\n          <CardTitle className=\"text-base\">Media Card</CardTitle>\n          <CardDescription>Combine with images or charts.</CardDescription>\n        </CardContent>\n      </Card>\n    </div>\n  )\n}`

const sectionPreview = (
  <div className="space-y-6">
    <Section
      padding="lg"
      divider="bottom"
      title="Composable Section"
      subtitle="Use tokens for background, spacing, and typography. Slots keep markup flexible."
      actions={
        <>
          <Button>Primary</Button>
          <Button variant="outline">Secondary</Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-4 text-sm text-muted-foreground">Content A</CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-sm text-muted-foreground">Content B</CardContent>
        </Card>
      </div>

      {/* Footer (with top divider) */}
      <div className="mt-8 border-t border-border pt-6">
        <Text className="text-sm text-muted-foreground">Footer area</Text>
      </div>
    </Section>

    <Section
      tone="muted"
      padding="md"
      style={{borderRadius: '8px'}}
      title="Muted variant"
      subtitle="Background adapts to theme. Great for contrast blocks."
    />
  </div>
)
const sectionCode = `import { Section } from "@/components/ui/section"\nimport { Card, CardContent } from "@/components/ui/card"\nimport { Button } from "@/components/ui/button"\n\nexport function SectionExamples(){\n  return (\n    <>\n      <Section padding=\"lg\" divider=\"bottom\" title=\"Composable Section\" subtitle=\"Use tokens for background, spacing, and typography.\" actions={(\n        <>\n          <Button>Primary</Button>\n          <Button variant=\"outline\">Secondary</Button>\n        </>\n      )}>\n        <Section.Content>\n          <div className=\"grid gap-4 sm:grid-cols-2\">\n            <Card><CardContent className=\"p-4\">Content A</CardContent></Card>\n            <Card><CardContent className=\"p-4\">Content B</CardContent></Card>\n          </div>\n        </Section.Content>\n        <Section.Footer divider>Footer area</Section.Footer>\n      </Section>\n\n      <Section tone=\"muted\">\n        <Section.Header>\n          <h3 className=\"text-lg font-semibold\">Muted variant</h3>\n          <p className=\"text-sm text-muted-foreground\">Background adapts to theme.</p>\n        </Section.Header>\n      </Section>\n    </>\n  )\n}`

const sectionPropsPreview = (
  <div className="overflow-x-auto rounded-lg border border-border/60">
    <table className="w-full text-left text-sm">
      <thead className="bg-muted/50 text-muted-foreground">
        <tr>
          <th className="px-3 py-2">Element</th>
          <th className="px-3 py-2">Prop</th>
          <th className="px-3 py-2">Type</th>
          <th className="px-3 py-2">Default</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-t"><td className="px-3 py-2">Section</td><td className="px-3 py-2">tone</td><td className="px-3 py-2">"default"|"muted"|"card"|"primary"|"secondary"|"accent"</td><td className="px-3 py-2">"default"</td></tr>
        <tr className="border-t"><td className="px-3 py-2">Section</td><td className="px-3 py-2">padding</td><td className="px-3 py-2">"none"|"xs"|"sm"|"md"|"lg"|"xl"</td><td className="px-3 py-2">"md"</td></tr>
        <tr className="border-t"><td className="px-3 py-2">Section</td><td className="px-3 py-2">divider</td><td className="px-3 py-2">"none"|"top"|"bottom"|"both"</td><td className="px-3 py-2">"none"</td></tr>
        <tr className="border-t"><td className="px-3 py-2">Section</td><td className="px-3 py-2">contained</td><td className="px-3 py-2">boolean</td><td className="px-3 py-2">true</td></tr>
        <tr className="border-t"><td className="px-3 py-2">Section</td><td className="px-3 py-2">align</td><td className="px-3 py-2">"start"|"center"|"end"</td><td className="px-3 py-2">"start"</td></tr>
        <tr className="border-t"><td className="px-3 py-2">Section</td><td className="px-3 py-2">containerClassName</td><td className="px-3 py-2">string</td><td className="px-3 py-2">—</td></tr>
        <tr className="border-t"><td className="px-3 py-2">Section.Header</td><td className="px-3 py-2">compact</td><td className="px-3 py-2">boolean</td><td className="px-3 py-2">false</td></tr>
        <tr className="border-t"><td className="px-3 py-2">Section</td><td className="px-3 py-2">title</td><td className="px-3 py-2">ReactNode</td><td className="px-3 py-2">—</td></tr>
        <tr className="border-t"><td className="px-3 py-2">Section</td><td className="px-3 py-2">subtitle</td><td className="px-3 py-2">ReactNode</td><td className="px-3 py-2">—</td></tr>
        <tr className="border-t"><td className="px-3 py-2">Section</td><td className="px-3 py-2">actions</td><td className="px-3 py-2">ReactNode</td><td className="px-3 py-2">—</td></tr>
        <tr className="border-t"><td className="px-3 py-2">Section.Footer</td><td className="px-3 py-2">divider</td><td className="px-3 py-2">boolean</td><td className="px-3 py-2">false</td></tr>
      </tbody>
    </table>
  </div>
)

const sectionPropsCode = `// Key props\n\n// Section root\nexport type Tone = 'default' | 'muted' | 'card' | 'primary' | 'secondary' | 'accent'\nexport type Padding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'\nexport type Divider = 'none' | 'top' | 'bottom' | 'both'\nexport type Align = 'start' | 'center' | 'end'\n\n// Optional slots\n// Section.Header: { compact?: boolean; align?: Align }\n// Section.Content: React.HTMLAttributes<HTMLDivElement>\n// Section.Footer: { divider?: boolean }`

type ThemeMode = 'light' | 'dark'
const THEME_STORAGE_KEY = 'token-theme'

export default function App() {
  const [theme, setTheme] = React.useState<ThemeMode>('light')
  const [activeSlug, setActiveSlug] = React.useState<string | undefined>('button')
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [typoBalance, setTypoBalance] = React.useState(true)
  const [typoClamp, setTypoClamp] = React.useState<0|1|2|3|4|5>(0)

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') {
      setTheme(stored)
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setTheme(mediaQuery.matches ? 'dark' : 'light')

    const listener = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? 'dark' : 'light')
    }

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', listener)
      return () => mediaQuery.removeEventListener('change', listener)
    }

    if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(listener)
      return () => mediaQuery.removeListener(listener)
    }

    return undefined
  }, [])

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.setAttribute('data-theme', theme)
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = React.useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  React.useEffect(() => {
    const setFromHash = () => {
      const hash = typeof window !== 'undefined' ? window.location.hash : ''
      setActiveSlug(hash ? hash.replace('#', '') : 'button')
    }
    setFromHash()
    window.addEventListener('hashchange', setFromHash)
    return () => window.removeEventListener('hashchange', setFromHash)
  }, [])

  // Prevent body scroll when the mobile sidebar is open
  React.useEffect(() => {
    if (typeof document === 'undefined') return
    const body = document.body
    if (sidebarOpen) {
      body.style.overflow = 'hidden'
    } else {
      body.style.overflow = ''
    }
    return () => {
      body.style.overflow = ''
    }
  }, [sidebarOpen])

  // Alphabetical ordering for sections (page order)
  const sortedItems = React.useMemo(() => [...ALL_COMPONENT_ITEMS].sort((a, b) => a.label.localeCompare(b.label)), [])
  const orderMap = React.useMemo(() => Object.fromEntries(sortedItems.map((i, idx) => [i.slug, idx])), [sortedItems])
  const customSlugs = React.useMemo(
    () => new Set([
      'anchor',
      'animatedCheckMark',
      'avatar',
      'badge',
      'bar',
      'button',
      'articleCard',
      'section',
      'capsule',
      'card',
      'colors',
      'iconography',
      'loadingSpinner',
      'typography',
      'prose',
      'typographyMigration',
      'typeScale',
      'typographyDosDonts',
      'items',
    ]),
    [],
  )
  const plannedSections = React.useMemo(
    () =>
      SIDEBAR_SECTIONS.map((section) => ({
        ...section,
        items: section.items
          .filter((item) => !customSlugs.has(item.slug))
          .sort((a, b) => a.label.localeCompare(b.label)),
      })).filter((section) => section.items.length > 0),
    [customSlugs],
  )

  return (
    <ToastProvider>
    <main className="min-h-screen bg-background transition-colors">
      <div
        className={`mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 pb-24 pt-6 ${sidebarCollapsed ? 'lg:grid-cols-[64px_1fr]' : 'lg:grid-cols-[260px_1fr]'}`}
      >
        <DocsSidebar
          activeSlug={activeSlug}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        />

        <div className="flex flex-col gap-10 pt-10">
          <header className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-600 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-200">
                Token Design System
              </span>
              <div className="flex items-center gap-2">
                <ThemeToggle mode={theme} onToggle={toggleTheme} />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
                  Components
                </h1>
              </div>
              <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
                A simple design system for clean portfolio interfaces. Each section highlights
                reusable components, their variants, and practical usage patterns.
              </p>
            </div>
          </header>

          {/* Colors */}
          <section className="space-y-10" id="colors" style={{ order: orderMap['colors'] }}>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Colors</h2>
              <p className="text-sm text-muted-foreground md:text-base">
                Theme tokens are exposed as CSS variables and Tailwind color keys. They adapt to
                light/dark mode and power semantic variants. Utility scales cover success, warning,
                danger, and grays for components.
              </p>
            </div>

            {/* Preview only; code sample focuses on usage */}
            <ComponentExample
              title="Palette"
              description="Semantic tokens and functional scales used across the system."
              preview={<ColorsDocs />}
              code={`// Use semantic tokens for surfaces and text\n<div className=\"bg-card text-card-foreground\">Card</div>\n<button className=\"bg-primary text-primary-foreground hover:bg-primary/90\">Primary</button>\n\n// Utility palettes for states\n<button className=\"bg-emerald-600 text-emerald-50\">Success</button>\n<button className=\"bg-amber-500 text-amber-950\">Warning</button>\n<button className=\"bg-red-600 text-red-50\">Danger</button>`}
            />
          </section>

          {/* Article Card */}
          <section className="space-y-10" id="articleCard" style={{ order: orderMap['articleCard'] }}>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Article Card</h2>
              <p className="text-sm text-muted-foreground md:text-base">
                Compact card for articles with optional image, kicker, title, meta, excerpt, and actions. When
                an href is provided, the card becomes a single accessible link with a stretched target.
              </p>
            </div>

            <ComponentExample
              title="Examples"
              description="Default and muted variants; hoverable elevation and underline affordances."
              preview={(
                <div className="grid items-start gap-6 md:grid-cols-2">
                  <ArticleCard
                    href="/blog/introducing-token"
                    kicker="Design System"
                    title="Introducing Token"
                    meta="By Ada · 5 min read"
                    excerpt="A quick overview of how we rethought tokens, components, and docs."
                    imageSrc="/images/color-blur-dark-hero.png"
                    imageAlt="color blur hero dark"
                    hoverable
                  />

                  <ArticleCard
                    tone="muted"
                    size="sm"
                    title="Smaller muted card"
                    meta="By Lin · 3 min read"
                    excerpt="Muted background tone for low-contrast contexts."
                  />
                </div>
              )}
              code={`import { ArticleCard } from "@/components/article-card/ArticleCard"\n\n<ArticleCard\n  href="/blog/introducing-token"\n  kicker="Design System"\n  title="Introducing Token"\n  meta="By Ada · 5 min read"\n  excerpt="A quick overview of how tokens, components, and docs work together."\n  imageSrc="/images/anime-chick.png"\n  imageAlt="Token hero"\n/>`}
            />

            <ComponentExample
              title="Props"
              description="Key props with defaults; keep the API small and string-first for content fields."
              preview={(
                <div className="overflow-x-auto rounded-lg border border-border/60">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2">Prop</th>
                        <th className="px-3 py-2">Type</th>
                        <th className="px-3 py-2">Default</th>
                        <th className="px-3 py-2">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t"><td className="px-3 py-2">href</td><td className="px-3 py-2">string</td><td className="px-3 py-2">—</td><td className="px-3 py-2">If set, card renders as a single accessible link</td></tr>
                      <tr className="border-t"><td className="px-3 py-2">title</td><td className="px-3 py-2">string</td><td className="px-3 py-2">—</td><td className="px-3 py-2">Heading text</td></tr>
                      <tr className="border-t"><td className="px-3 py-2">imageSrc</td><td className="px-3 py-2">string</td><td className="px-3 py-2">—</td><td className="px-3 py-2">Optional cover/thumbnail</td></tr>
                      <tr className="border-t"><td className="px-3 py-2">imageAlt</td><td className="px-3 py-2">string</td><td className="px-3 py-2">—</td><td className="px-3 py-2">Alt text for image</td></tr>
                      <tr className="border-t"><td className="px-3 py-2">kicker</td><td className="px-3 py-2">string</td><td className="px-3 py-2">—</td><td className="px-3 py-2">Small category/tag above title</td></tr>
                      <tr className="border-t"><td className="px-3 py-2">meta</td><td className="px-3 py-2">string</td><td className="px-3 py-2">—</td><td className="px-3 py-2">Byline or read-time info</td></tr>
                      <tr className="border-t"><td className="px-3 py-2">excerpt</td><td className="px-3 py-2">string</td><td className="px-3 py-2">—</td><td className="px-3 py-2">Short description</td></tr>
                      <tr className="border-t"><td className="px-3 py-2">badge</td><td className="px-3 py-2">ReactNode</td><td className="px-3 py-2">—</td><td className="px-3 py-2">Optional status label</td></tr>
                      <tr className="border-t"><td className="px-3 py-2">actions</td><td className="px-3 py-2">ReactNode</td><td className="px-3 py-2">—</td><td className="px-3 py-2">Optional non-link actions</td></tr>
                      <tr className="border-t"><td className="px-3 py-2">tone</td><td className="px-3 py-2">"default" | "muted" | "card"</td><td className="px-3 py-2">"default"</td><td className="px-3 py-2">Visual tone</td></tr>
                      <tr className="border-t"><td className="px-3 py-2">size</td><td className="px-3 py-2">"sm" | "md" | "lg"</td><td className="px-3 py-2">"md"</td><td className="px-3 py-2">Scale paddings/typography</td></tr>
                      <tr className="border-t"><td className="px-3 py-2">hoverable</td><td className="px-3 py-2">boolean</td><td className="px-3 py-2">false</td><td className="px-3 py-2">Adds hover elevation/underline</td></tr>
                      <tr className="border-t"><td className="px-3 py-2">className</td><td className="px-3 py-2">string</td><td className="px-3 py-2">—</td><td className="px-3 py-2">Additional classes</td></tr>
                    </tbody>
                  </table>
                </div>
              )}
              code={`export type ArticleCardProps = {\n  href?: string\n  title: string\n  imageSrc?: string\n  imageAlt?: string\n  kicker?: string\n  meta?: string\n  excerpt?: string\n  badge?: React.ReactNode\n  actions?: React.ReactNode\n  tone?: 'default' | 'muted' | 'card'\n  size?: 'sm' | 'md' | 'lg'\n  hoverable?: boolean\n}\n`}
            />
          </section>

          {/* Section */}
          <section className="space-y-10" id="section" style={{ order: orderMap['section'] }}>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Section</h2>
              <p className="text-sm text-muted-foreground md:text-base">
                Page or block-level layout primitive with tokenized backgrounds, spacing, and
                composable header/content/actions/footer slots. Accessible by default via region
                semantics and auto-wired titles.
              </p>
            </div>

            <ComponentExample
              title="Examples"
              description="Composable slots with spacing, dividers, and variants."
              preview={sectionPreview}
              code={sectionCode}
            />

            <ComponentExample
              title="Props"
              description="Key root and slot props for layout and alignment."
              preview={sectionPropsPreview}
              code={sectionPropsCode}
            />
          </section>

          {/* Items (List replacement) */}
          <section className="space-y-10" id="items" style={{ order: orderMap['items'] }}>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Items</h2>
              <p className="text-sm text-muted-foreground md:text-base">Interactive list primitives with search, selection, and grouping. Use for command pallets, pickers, and action menus. Prefer Prose ul/ol for static content.</p>
            </div>

            <ComponentExample
              title="Searchable List"
              preview={(
                <Items className="max-w-md" placeholder="Search settings…">
                  <Item value="Profile" leadingIcon={<Icon name="user" size="xSmall" decorative />} />
                  <Item value="Notifications" leadingIcon={<Icon name="bell" size="xSmall" decorative />} />
                  <Item value="Security" leadingIcon={<Icon name="lock" size="xSmall" decorative />} />
                  <Item value="Billing" leadingIcon={<Icon name="creditCard" size="xSmall" decorative />} />
                </Items>
              )}
              code={`import { Items, Item } from "@/components/ui/items"\n\n<Items placeholder=\"Search settings…\">\n  <Item value=\"Profile\" />\n  <Item value=\"Notifications\" />\n  <Item value=\"Security\" />\n  <Item value=\"Billing\" />\n</Items>`}
            />

            <ComponentExample
              title="Grouped"
              preview={(
                <Items className="max-w-md">
                  <ItemGroup label="General">
                    <Item value="Home" leadingIcon={<Icon name="home" size="xSmall" decorative />} />
                    <Item value="Search" leadingIcon={<Icon name="search" size="xSmall" decorative />} />
                    <Item value="Downloads" leadingIcon={<Icon name="download" size="xSmall" decorative />} />
                  </ItemGroup>
                  <ItemGroup label="Danger Zone">
                    <Item value="Delete account" tone="danger" leadingIcon={<Icon name="trash" size="xSmall" decorative />} />
                  </ItemGroup>
                </Items>
              )}
              code={`import { Items, Item, ItemGroup } from "@/components/ui/items"\n\n<Items>\n  <ItemGroup label=\"General\">\n    <Item value=\"Home\" />\n    <Item value=\"Search\" />\n    <Item value=\"Downloads\" />\n  </ItemGroup>\n  <ItemGroup label=\"Danger Zone\">\n    <Item value=\"Delete account\" tone=\"danger\" />\n  </ItemGroup>\n</Items>`}
            />

            <ComponentExample
              title="When to use / not use"
              description="Use Items for interactive, keyboardable lists (commands, actions). Use Prose lists for static content; use DropdownMenu/Select/ContextMenu for anchored menus."
              preview={(
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-emerald-300/60 bg-emerald-50/40 p-4 dark:border-emerald-500/40 dark:bg-emerald-500/10">
                    <h4 className="mb-2 font-semibold text-emerald-700 dark:text-emerald-300">Use Items for:</h4>
                    <ul className="list-disc pl-5 text-sm text-emerald-900 dark:text-emerald-200">
                      <li>Command palettes and pickers</li>
                      <li>Searchable action menus</li>
                      <li>Selectable lists with icons</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-amber-300/60 bg-amber-50/40 p-4 dark:border-amber-500/40 dark:bg-amber-500/10">
                    <h4 className="mb-2 font-semibold text-amber-700 dark:text-amber-300">Don’t use for:</h4>
                    <ul className="list-disc pl-5 text-sm text-amber-900 dark:text-amber-200">
                      <li>Static documentation (use Prose ul/ol)</li>
                      <li>Context menus (use Dropdown/ContextMenu)</li>
                      <li>Tabular data (use Table)</li>
                    </ul>
                  </div>
                </div>
              )}
              code={`// Use Items for interactive lists; prefer native lists for static content.`}
            />
          </section>

          {/* Typography Do's & Don'ts */}
          <section className="space-y-10" id="typographyDosDonts" style={{ order: orderMap['typographyDosDonts'] }}>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Typography Do's & Don'ts</h2>
              <p className="text-sm text-muted-foreground md:text-base">Quick, opinionated guidance to keep type consistent and readable.</p>
            </div>
            <ComponentExample
              title="Examples"
              preview={(
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-emerald-300/60 bg-emerald-50/40 p-4 dark:border-emerald-500/40 dark:bg-emerald-500/10">
                    <h4 className="mb-2 font-semibold text-emerald-700 dark:text-emerald-300">Do</h4>
                    <ul className="list-disc pl-5 text-sm text-emerald-900 dark:text-emerald-200">
                      <li><span className="font-medium">Use balanced H1–H2</span> for long titles.</li>
                      <li>Clamp body in tight cards (<code>clamp=2</code>).</li>
                      <li>Keep line length ~60–75ch for paragraphs.</li>
                      <li>Use semantic tones; keep contrast high.</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-red-300/60 bg-red-50/40 p-4 dark:border-red-500/40 dark:bg-red-500/10">
                    <h4 className="mb-2 font-semibold text-red-700 dark:text-red-300">Don't</h4>
                    <ul className="list-disc pl-5 text-sm text-red-900 dark:text-red-200">
                      <li>Clamp headings H1–H3.</li>
                      <li>Use color alone for emphasis.</li>
                      <li>Skip heading levels (e.g., H1 → H3).</li>
                      <li>Overuse all caps or tight tracking.</li>
                    </ul>
                  </div>
                </div>
              )}
              code={`// Do: balance H1–H2, clamp body, maintain contrast\n// Don't: clamp headings, rely on color alone, skip levels`}
            />
          </section>

          {/* Prose */}
          <section className="space-y-10" id="prose" style={{ order: orderMap['prose'] }}>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Prose</h2>
              <p className="text-sm text-muted-foreground md:text-base">Editorial wrapper for articles and docs. Provides rhythm, list spacing, and sensible defaults.</p>
            </div>
            <ComponentExample
              title="Full Example"
              description="Headings, paragraphs, lists, blockquote, code, and links."
              preview={(
                <div className="space-y-6">
                  <Prose className="rounded-lg border border-border/60 bg-background/60 p-6">
                    <h1>Prose defaults</h1>
                    <p>
                      Use <a href="#">Prose</a> for rich text like documentation. It sets a comfortable measure and spaced
                      headings, lists, and code. Inline <code>code</code> and <strong>strong</strong> text are styled.
                    </p>
                    <h2>Blockquote</h2>
                    <blockquote>
                      Typography rules should be consistent, predictable, and easy to scan.
                    </blockquote>
                    <h3>Lists</h3>
                    <ul>
                      <li>Consistent spacing</li>
                      <li>Readable measure (~70ch)</li>
                      <li>Themed links and <code>code</code></li>
                    </ul>
                    <h3>Code block</h3>
                    <pre><code>{`function greet(name){\n  return \`Hello, ${'${name}'}!\`\n}`}</code></pre>
                  </Prose>
                  <Prose invert className="rounded-lg border border-border/60 bg-foreground/5 p-6">
                    <h3>Inverted</h3>
                    <p>Use <code>invert</code> for dark cards on light backgrounds or vice versa.</p>
                  </Prose>
                </div>
              )}
              code={`import { Prose } from "@/components/ui/prose"\n\n<Prose>\n  <h1>Prose defaults</h1>\n  <p>Use <a href="#">Prose</a>…</p>\n  <blockquote>…</blockquote>\n  <ul><li>…</li></ul>\n  <pre><code>…</code></pre>\n</Prose>`}
            />
          </section>

          {/* Typography Guidelines */}
          <section className="space-y-10" id="typographyMigration" style={{ order: orderMap['typographyMigration'] }}>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Typography Guidelines</h2>
              <p className="text-sm text-muted-foreground md:text-base">Use Heading for page structure and Text for body copy. Prefer semantic tones, clear alignment, and line clamping for constrained layouts.</p>
            </div>
            <ComponentExample
              title="Usage Patterns"
              preview={(
                <div className="overflow-x-auto rounded-lg border border-border/60">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2">Need</th>
                        <th className="px-3 py-2">Component</th>
                        <th className="px-3 py-2">Pattern</th>
                        <th className="px-3 py-2">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t"><td className="px-3 py-2">Hero title</td><td className="px-3 py-2">Heading</td><td className="px-3 py-2">level=1</td><td className="px-3 py-2">Use balance for long titles</td></tr>
                      <tr className="border-t"><td className="px-3 py-2">Section title</td><td className="px-3 py-2">Heading</td><td className="px-3 py-2">level=2</td><td className="px-3 py-2">Keep semantic order</td></tr>
                      <tr className="border-t"><td className="px-3 py-2">Card title</td><td className="px-3 py-2">Heading</td><td className="px-3 py-2">level=3</td><td className="px-3 py-2">Use for nested content</td></tr>
                      <tr className="border-t"><td className="px-3 py-2">Lead copy</td><td className="px-3 py-2">Text</td><td className="px-3 py-2">size="lg"</td><td className="px-3 py-2">Best for summaries</td></tr>
                      <tr className="border-t"><td className="px-3 py-2">Body copy</td><td className="px-3 py-2">Text</td><td className="px-3 py-2">size="base"</td><td className="px-3 py-2">Default reading size</td></tr>
                      <tr className="border-t"><td className="px-3 py-2">Metadata</td><td className="px-3 py-2">Text</td><td className="px-3 py-2">size="caption"</td><td className="px-3 py-2">Use with muted tone</td></tr>
                      <tr className="border-t"><td className="px-3 py-2">Status text</td><td className="px-3 py-2">Text</td><td className="px-3 py-2">tone="muted|danger|..."</td><td className="px-3 py-2">Use semantic tokens</td></tr>
                      <tr className="border-t"><td className="px-3 py-2">Single-line label</td><td className="px-3 py-2">Text</td><td className="px-3 py-2">nowrap</td><td className="px-3 py-2">Avoid wrapping controls</td></tr>
                      <tr className="border-t"><td className="px-3 py-2">Aligned copy</td><td className="px-3 py-2">Text</td><td className="px-3 py-2">align="start|center|end"</td><td className="px-3 py-2">Use logical alignment</td></tr>
                      <tr className="border-t"><td className="px-3 py-2">Truncated content</td><td className="px-3 py-2">Text</td><td className="px-3 py-2">clamp=1|2|3</td><td className="px-3 py-2">Prefer clamp over manual CSS</td></tr>
                    </tbody>
                  </table>
                </div>
              )}
              code={`<Heading level={1} balance>Page title</Heading>\n<Heading level={2}>Section title</Heading>\n<Text size=\"base\">Body copy</Text>\n<Text size=\"caption\" tone=\"muted\">Metadata</Text>\n<Text clamp={2}>Truncated body copy</Text>`}
            />
          </section>

          {/* Loading Spinner */}
          <section className="space-y-10" id="loadingSpinner" style={{ order: orderMap['loadingSpinner'] }}>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Loading Spinner</h2>
              <p className="text-sm text-muted-foreground md:text-base">Minimal 180° ring spinner with a faint track. Supports size, tone, and speed presets.</p>
              <p className="text-sm text-muted-foreground md:text-base">A minimal SVG spinner inspired by the 180° ring with background. Supports size, tone, and speed presets.</p>
            </div>

            <ComponentExample
              title="Sizes"
              preview={(
                <div className="flex flex-wrap items-center gap-6">
                  <LoadingSpinner size="xSmall" />
                  <LoadingSpinner size="small" />
                  <LoadingSpinner size="medium" />
                  <LoadingSpinner size="large" />
                  <LoadingSpinner size="xLarge" />
                </div>
              )}
              code={`import { LoadingSpinner } from "@/components/ui/loading-spinner"\n\nexport function SpinnerSizes(){\n  return (\n    <div className=\"flex items-center gap-6\">\n      <LoadingSpinner size=\"xSmall\" />\n      <LoadingSpinner size=\"small\" />\n      <LoadingSpinner size=\"medium\" />\n      <LoadingSpinner size=\"large\" />\n      <LoadingSpinner size=\"xLarge\" />\n    </div>\n  )\n}`}
            />

            <ComponentExample
              title="Tones"
              preview={(
                <div className="flex flex-wrap items-center gap-6">
                  <LoadingSpinner tone="primary" />
                  <LoadingSpinner tone="secondary" />
                  <LoadingSpinner tone="accent" />
                  <LoadingSpinner tone="success" />
                  <LoadingSpinner tone="warning" />
                  <LoadingSpinner tone="danger" />
                </div>
              )}
              code={`export function SpinnerTones(){\n  return (\n    <div className=\"flex items-center gap-6\">\n      <LoadingSpinner tone=\"primary\" />\n      <LoadingSpinner tone=\"secondary\" />\n      <LoadingSpinner tone=\"accent\" />\n      <LoadingSpinner tone=\"success\" />\n      <LoadingSpinner tone=\"warning\" />\n      <LoadingSpinner tone=\"danger\" />\n    </div>\n  )\n}`}
            />

            <ComponentExample
              title="Speed"
              preview={(
                <div className="flex flex-wrap items-center gap-6">
                  <LoadingSpinner speed="slow" />
                  <LoadingSpinner speed="normal" />
                  <LoadingSpinner speed="fast" />
                </div>
              )}
              code={`export function SpinnerSpeed(){\n  return (\n    <div className=\"flex items-center gap-6\">\n      <LoadingSpinner speed=\"slow\" />\n      <LoadingSpinner speed=\"normal\" />\n      <LoadingSpinner speed=\"fast\" />\n    </div>\n  )\n}`}
            />
          </section>

          {/* Typography */}
          <section className="space-y-10" id="typography" style={{ order: orderMap['typography'] }}>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Typography</h2>
              <p className="text-sm text-muted-foreground md:text-base">Inter variable for UI. Balanced H1–H2, clamp support for Text, RTL-friendly alignment, and a Prose wrapper for editorial content.</p>
            </div>

            {/* Playground */}
            <ComponentExample
              title="Playground"
              description="Toggle heading balance and body clamp."
              preview={(
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" checked={typoBalance} onChange={(e)=>setTypoBalance(e.target.checked)} />
                      <span>Balance H1</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <span>Clamp:</span>
                      <select className="rounded border bg-background px-2 py-1" value={typoClamp} onChange={(e)=>setTypoClamp(Number(e.target.value) as any)}>
                        {[0,1,2,3,4,5].map(n=> <option key={n} value={n}>{n}</option>)}
                      </select>
                    </label>
                  </div>
                  <Heading level={1} balance={typoBalance}>Design delightful, accessible interfaces at scale</Heading>
                  <Text clamp={typoClamp}>A strict token system keeps typography consistent across surfaces. Clamp text to avoid overflow in tight spaces; prefer balance for H1–H2 to prevent awkward breaks.</Text>
                </div>
              )}
              code={`import { Heading } from "@/components/ui/heading"\nimport { Text } from "@/components/ui/text"\n\n<Heading level={1} balance>Design delightful, accessible interfaces at scale</Heading>\n<Text clamp={2}>…body copy…</Text>`}
            />

            <ComponentExample
              title="Prose"
              description="Editorial wrapper with sensible defaults."
              preview={(
                <Prose className="rounded-lg border border-border/60 bg-background/60 p-4">
                  <h2>Typography in practice</h2>
                  <p>Use balanced headings for single-column layouts and clamp body in tight cards. Keep contrast high and avoid relying on color alone for emphasis.</p>
                  <ul>
                    <li>Headings: levels 1–4</li>
                    <li>Body sizes: sm, md, lg</li>
                    <li>Clamp lines for truncation</li>
                  </ul>
                </Prose>
              )}
              code={`import { Prose } from "@/components/ui/prose"\n\n<Prose>\n  <h2>Typography in practice</h2>\n  <p>…</p>\n</Prose>`}
            />
          </section>

          {/* Type Scale */}
          <section className="space-y-10" id="typeScale" style={{ order: orderMap['typeScale'] }}>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Type Scale</h2>
              <p className="text-sm text-muted-foreground md:text-base">All sizes at a glance — headings and text.</p>
            </div>
            <ComponentExample
              title="Headings"
              preview={(
                <div className="space-y-3">
                  <Heading level={1}>Heading 1 — level={1}</Heading>
                  <Heading level={2}>Heading 2 — level={2}</Heading>
                  <Heading level={3}>Heading 3 — level={3}</Heading>
                  <Heading level={4}>Heading 4 — level={4}</Heading>
                </div>
              )}
              code={`import { Heading } from "@/components/ui/heading"\n\n<Heading level={1}>Heading 1</Heading>\n<Heading level={2}>Heading 2</Heading>\n<Heading level={3}>Heading 3</Heading>\n<Heading level={4}>Heading 4</Heading>`}
            />
            <ComponentExample
              title="Text"
              preview={(
                <div className="space-y-1.5">
                  <Text size="lg">Text lg — size="lg"</Text>
                  <Text size="base">Text base — size="base"</Text>
                  <Text size="sm">Text sm — size="sm"</Text>
                  <Text size="caption">Text caption — size="caption"</Text>
                  <Text size="footnote">Text footnote — size="footnote"</Text>
                </div>
              )}
              code={`import { Text } from "@/components/ui/text"\n\n<Text size=\"lg\">Text lg</Text>\n<Text size=\"base\">Text base</Text>\n<Text size=\"sm\">Text sm</Text>\n<Text size=\"caption\">Text caption</Text>\n<Text size=\"footnote\">Text footnote</Text>`}
            />
          </section>

          <section className="space-y-10" id="button" style={{ order: orderMap['button'] }}>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Button</h2>
              <p className="text-sm text-muted-foreground md:text-base">
                Button variants cover primary actions, secondary choices, destructive states, and
                subtle interface controls with consistent sizing and focus treatment.
              </p>
            </div>

            <ComponentExample
              title="Variants"
              description="Semantic variants cover common product actions while preserving consistent interaction states."
              preview={buttonVariantsPreview}
              code={buttonVariantsCode}
            />

            <ComponentExample
              title="Sizes & Layout"
              description="Size tokens support compact controls, prominent calls to action, full-width layouts, and elevated treatments."
              preview={buttonLayoutPreview}
              code={buttonLayoutCode}
            />

            <ComponentExample
              title="Composition"
              description="Buttons support composition via the asChild prop and standard disabled states."
              preview={buttonCompositionPreview}
              code={buttonCompositionCode}
            />
          </section>

          <section className="space-y-10" id="anchor" style={{ order: orderMap['anchor'] }}>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Anchor</h2>
              <p className="text-sm text-muted-foreground md:text-base">
                A refined link component for inline navigation, external links, muted actions, and
                decorated text links with accessible focus states.
              </p>
            </div>

            <ComponentExample
              title="Examples"
              description="Decoration, tones, and target behavior are designed for clear affordance and keyboard navigation."
              preview={anchorPreview}
              code={anchorCode}
            />
          </section>

          <section className="space-y-10" id="avatar" style={{ order: orderMap['avatar'] }}>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Avatar</h2>
              <p className="text-sm text-muted-foreground md:text-base">
                Image or initials with optional active status, selected state, and shape controls for
                people, teams, and profile surfaces.
              </p>
            </div>

            <ComponentExample
              title="Examples"
              description="Sizes, initials fallback, active bubble, and selected state with an animated checkmark."
              preview={(
                <div className="space-y-6">
                  {/* Row 1: 4 square + 4 circle (initials/no image) */}
                  <div className="flex flex-wrap items-center gap-6">
                    {/* Square */}
                    <Avatar size="xSmall" initials="KT" />
                    <Avatar size="small" initials="KT" isActive />
                    <Avatar size="medium" initials="KT" />
                    <Avatar size="large" initials="KT" isSelected />
                    {/* Circle versions */}
                    <Avatar size="xSmall" shape="circle" initials="KT" />
                    <Avatar size="small" shape="circle" initials="KT" isActive />
                    <Avatar size="medium" shape="circle" initials="KT" />
                    <Avatar size="large" shape="circle" initials="KT" isSelected />
                  </div>

                  {/* Row 2: image avatars (rounded + circular) */}
                  <div className="flex flex-wrap items-center gap-6">
                    {/* Rounded */}
                    <Avatar size="xLarge" src="/images/spiderman.png" alt="Example" />
                    <Avatar size="xLarge" src="/images/kt-avatar.png" alt="Example" />
                    <Avatar size="xLarge" src="/images/anime-chick.png" alt="Example" />
                    {/* Circular */}
                    <Avatar size="xLarge" shape="circle" src="/images/spiderman.png" alt="Example" />
                    <Avatar size="xLarge" shape="circle" src="/images/kt-avatar.png" alt="Example" />
                    <Avatar size="xLarge" shape="circle" src="/images/anime-chick.png" alt="Example" />
                  </div>

                  {/* Row 3: ring-style active status on images */}
                  <div className="flex flex-wrap items-center gap-6">
                    <Avatar size="xLarge" src="/images/spiderman.png" alt="Example" isActive activeAppearance="ring" />
                    <Avatar size="xLarge" src="/images/kt-avatar.png" alt="Example" isActive activeAppearance="ring" />
                    <Avatar size="xLarge" src="/images/anime-chick.png" alt="Example" isActive activeAppearance="ring" />
                  </div>
                </div>
              )}
              code={`import { Avatar } from "@/components/ui/avatar"\n\nexport function AvatarExamples() {\n  return (\n    <div className=\"flex flex-wrap items-center gap-6\">\n      <Avatar size=\"xSmall\" initials=\"NW\" />\n      <Avatar size=\"small\" initials=\"NW\" isActive />\n      <Avatar size=\"medium\" initials=\"NW\" />\n      <Avatar size=\"large\" initials=\"NW\" isSelected />\n      <Avatar size=\"xLarge\" src=\"/images/spiderman.png\" alt=\"Example\" />\n    </div>\n  )\n}`}
            />
          </section>

          <section className="space-y-10" id="animatedCheckMark" style={{ order: orderMap['animatedCheckMark'] }}>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Animated Checkmark</h2>
              <p className="text-sm text-muted-foreground md:text-base">
                A dependency-free animated checkmark for confirmations, selected states, and success
                feedback. It supports filled or outline treatments, tones, sizes, and reduced motion.
              </p>
            </div>

            <ComponentExample
              title="Examples"
              description="Outline and filled variants, tones, and sizes. Hover the large example to replay."
              preview={animatedCheckmarkPreview}
              code={animatedCheckmarkCode}
            />
          </section>

          <section className="space-y-10" id="badge" style={{ order: orderMap['badge'] }}>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Badge</h2>
              <p className="text-sm text-muted-foreground md:text-base">
                Numeric counters and pill labels with tone variants. Use badges for notification
                counts, statuses, short labels, and icon-supported emphasis.
              </p>
            </div>

            <ComponentExample
              title="Examples"
              description="Numeric count vs text pills, with tone variants and optional icons."
              preview={badgePreview}
              code={badgeCode}
            />
          </section>

          {plannedSections.map((section) => {
            const sectionOrder = Math.min(...section.items.map((item) => orderMap[item.slug] ?? 0))

            return (
              <section key={section.title} style={{ order: sectionOrder }}>
                <details className="group rounded-2xl border border-border/70 bg-card/70 shadow-sm transition-colors open:bg-card">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-6 marker:hidden">
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        Coming Soon
                      </p>
                      <h2 className="text-2xl font-semibold text-foreground">Planned {section.title}</h2>
                      <p className="text-sm text-muted-foreground md:text-base">
                        {section.items.length} {section.items.length === 1 ? 'component is' : 'components are'} being defined for Token. Expand to review current status.
                      </p>
                    </div>
                    <span className="mt-1 shrink-0 rounded-full border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground transition-transform group-open:rotate-180">
                      ↓
                    </span>
                  </summary>
                  <div className="grid gap-4 border-t border-border/60 p-6 pt-5">
                    {section.items.map((item) => (
                      <details
                        id={item.slug}
                        key={item.slug}
                        className="group/item rounded-xl border border-border/70 bg-background/80 shadow-sm transition-colors open:bg-background"
                      >
                        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 marker:hidden">
                          <div className="space-y-1.5">
                            <h3 className="text-xl font-semibold text-foreground">{item.label}</h3>
                            <p className="text-sm text-muted-foreground md:text-base">
                              {item.label} is planned for the Token component library. Expand for current status.
                            </p>
                          </div>
                          <span className="mt-0.5 shrink-0 rounded-full border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground transition-transform group-open/item:rotate-180">
                            ↓
                          </span>
                        </summary>
                        <div className="border-t border-border/60 p-5 pt-4">
                          <ComingSoon
                            title={`${item.label} — planned component`}
                            description="This component is being defined for the Token API, variants, and theme tokens. Docs and examples will appear here when ready."
                          />
                        </div>
                      </details>
                    ))}
                  </div>
                </details>
              </section>
            )
          })}
          
          <section className="space-y-10" id="bar" style={{ order: orderMap['bar'] }}>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Bar</h2>
              <p className="text-sm text-muted-foreground md:text-base">
                Simple rectangular blocks useful for charts and separators. Accepts width/height in
                px or CSS units and supports tone or custom background colors.
              </p>
            </div>

            <ComponentExample
              title="Examples"
              description="Horizontal and vertical bars with tone variants."
              preview={barPreview}
              code={barCode}
            />
          </section>

          <section className="space-y-10" id="iconography" style={{ order: orderMap['iconography'] }}>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Iconography</h2>
              <p className="text-sm text-muted-foreground md:text-base">
                A Lucide-based icon component with consistent sizing, tone, orientation, and stroke
                width controls for product interfaces.
              </p>
            </div>

            <ComponentExample
              title="Examples"
              description="Searchable icon registry with copy-ready usage examples."
              preview={<IconsCatalog />}
              code={`import { Icon } from "@/components/ui/icon"\n\nexport function IconExamples() {\n  return (\n    <>\n      {/* Size tokens or pixels */}\n      <Icon name="close" size="small" />\n      <Icon name="close" size={20} />\n\n      {/* Tone mapping */}\n      <Icon name="check" tone="success" />\n      <Icon name="closeCircle" primaryColor="danger" />\n\n      {/* Orientation for directional glyphs */}\n      <Icon name="chevron" orientation="left" />\n\n      {/* Loading uses a spin animation */}\n      <Icon name="loading" />\n    </>\n  )\n}`}
            />
          </section>

          <section className="space-y-10" id="capsule" style={{ order: orderMap['capsule'] }}>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Capsule</h2>
              <p className="text-sm text-muted-foreground md:text-base">
                Small, rounded labels for statuses, tags, filters, and compact metadata. Supports
                tone, size, and shadow variants.
              </p>
            </div>

            <ComponentExample
              title="Examples"
              description="Tone, size, and optional shadow."
              preview={capsulePreview}
              code={capsuleCode}
            />
          </section>

          <section className="space-y-10" id="card" style={{ order: orderMap['card'] }}>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Card</h2>
              <p className="text-sm text-muted-foreground md:text-base">
                Flexible container with header/content/footer slots. Supports elevated, hoverable,
                and centered variants for quick layouts.
              </p>
            </div>

            <ComponentExample
              title="Examples"
              description="Basic, elevated/hoverable, centered, and media variants."
              preview={cardPreview}
              code={cardCode}
            />
          </section>
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-50 grid grid-cols-[minmax(0,1fr)] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Components navigation"
          onKeyDown={(e) => {
            if ((e as React.KeyboardEvent).key === 'Escape') setSidebarOpen(false)
          }}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Drawer panel */}
          <div className="absolute inset-y-0 left-0 w-[280px] overflow-hidden rounded-r-xl border-r bg-background shadow-xl">
            <DocsSidebar
              inDrawer
              activeSlug={activeSlug}
              onNavigate={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </main>
    </ToastProvider>
  )
}
