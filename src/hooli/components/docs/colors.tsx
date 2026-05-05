import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'

type ViewMode = 'none' | 'tw' | 'vars' | 'both'
type ContrastView = 'all' | 'fails' | 'off'

type TokenTileProps = {
  name: string
  className: string
  subtitle?: string
  view: ViewMode
}

function CopyChip({ value, label, variant = 'default' }: { value: string; label?: string; variant?: 'default' | 'overlay' }) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 1200)
    return () => clearTimeout(id)
  }, [copied])

  return (
    <button
      type="button"
      className={cn(
        'relative inline-flex h-6 items-center rounded border px-1.5 text-[11px] font-mono transition-colors max-w-[22ch] sm:max-w-[26ch] md:max-w-[32ch] truncate whitespace-nowrap',
        variant === 'overlay'
          ? 'border-white/25 bg-black/55 text-white shadow-sm backdrop-blur hover:bg-black/65'
          : copied
            ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700/60 dark:bg-emerald-900/20 dark:text-emerald-300'
            : 'border-border/70 bg-muted/50 text-muted-foreground hover:bg-muted/70',
      )}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setCopied(true)
          toast({ title: 'Copied', description: value })
        } catch {
          /* no-op */
        }
      }}
      aria-label={`Copy ${value}`}
      title={value}
      aria-live="polite"
    >
      {label ?? value}
      {copied ? (
        <span className="pointer-events-none absolute inset-0 grid place-items-center rounded bg-emerald-600/95 px-1 text-[10px] font-semibold text-white">
          Copied
        </span>
      ) : null}
    </button>
  )
}

function useContrast(ref: React.RefObject<HTMLElement | null>) {
  const [ratio, setRatio] = useState<number | null>(null)

  useEffect(() => {
    if (!ref.current || typeof window === 'undefined') return

    const compute = () => {
      const el = ref.current
      if (!el) return
      const styles = window.getComputedStyle(el)
      const bg = styles.backgroundColor
      const color = styles.color
      function parseRGB(str: string): [number, number, number] {
        const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/i)
        if (!m) return [0, 0, 0] as [number, number, number]
        return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)] as [number, number, number]
      }
      function luminance([r, g, b]: [number, number, number]) {
        const srgb = [r, g, b]
          .map(v => v / 255)
          .map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)))
        return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2]
      }
      const L1 = luminance(parseRGB(bg))
      const L2 = luminance(parseRGB(color))
      const r = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
      setRatio(Number.isFinite(r) ? Math.round(r * 10) / 10 : null)
    }

    // initial compute
    compute()

    // Re-compute when root theme class changes (e.g., toggling 'dark')
    const mo = new MutationObserver(compute)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    // Also recompute when the element resizes (fonts/zoom/layout)
    const ro = new ResizeObserver(compute)
    ro.observe(ref.current)

    // Recompute on window resize as a fallback
    window.addEventListener('resize', compute)

    return () => {
      mo.disconnect()
      ro.disconnect()
      window.removeEventListener('resize', compute)
    }
  }, [ref])

  return ratio
}

function ContrastBadge({ targetRef, mode = 'all' as ContrastView }: { targetRef: React.RefObject<HTMLDivElement | null>; mode?: ContrastView }) {
  const ratio = useContrast(targetRef)
  if (!ratio) return null
  if (mode === 'off') return null
  if (mode === 'fails' && ratio >= 4.5) return null
  const level = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : '⚠︎'
  const cls = ratio >= 7
    ? 'bg-emerald-600 text-emerald-50'
    : ratio >= 4.5
      ? 'bg-amber-500 text-amber-950'
      : 'bg-red-600 text-red-50'
  return (
    <span
      className={cn('pointer-events-none absolute right-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-semibold', cls)}
      title={`Contrast ${ratio}:1 • ${level === '⚠︎' ? 'Below AA' : level}`}
    >
      {typeof level === 'string' ? `${level} ${ratio}:1` : `${ratio}:1`}
    </span>
  )
}

function TokenTile({ name, className, subtitle, view }: TokenTileProps) {
  return (
    <div className={cn('overflow-hidden rounded-lg border border-border/60')}>
      <div className={cn('group relative flex h-12 items-center justify-between px-3 text-sm', className)}>
        <span className="font-medium">{name}</span>
        {subtitle ? <span className="text-xs opacity-80">{subtitle}</span> : null}
      </div>
      {view !== 'none' && (
        view === 'both' ? (
          <div className="mt-auto divide-y border-t border-border/60 bg-background/60 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 px-3 py-2">
              <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground/80">Tailwind</span>
              <div className="min-w-0 flex-1 overflow-hidden">
                <CopyChip value={`bg-${name.toLowerCase()}`} />
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2">
              <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground/80">CSS</span>
              <div className="min-w-0 flex-1 overflow-hidden">
                <CopyChip value={`var(--${name.toLowerCase()})`} />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-auto flex items-center gap-2 border-t border-border/60 bg-background/60 px-3 py-2 text-xs text-muted-foreground">
            {(view === 'tw') && (
              <div className="min-w-0 flex-1 overflow-hidden"><CopyChip value={`bg-${name.toLowerCase()}`} /></div>
            )}
            {(view === 'vars') && (
              <div className="min-w-0 flex-1 overflow-hidden"><CopyChip value={`var(--${name.toLowerCase()})`} /></div>
            )}
          </div>
        )
      )}
    </div>
  )
}

type PairTileProps = {
  name: string
  baseClass: string
  fgClass: string
  view: ViewMode
  contrastMode: ContrastView
}

function PairTile({ name, baseClass, fgClass, view, contrastMode }: PairTileProps) {
  const baseRef = useRef<HTMLDivElement>(null)
  const fgRef = useRef<HTMLDivElement>(null)
  return (
    <div className={cn('overflow-hidden rounded-lg border border-border/60 transition-shadow hover:shadow-md')}>
      {/* Base band */}
      <div ref={baseRef} className={cn('group relative flex h-12 items-center gap-2 pl-3 pr-16 text-sm', baseClass)}>
        <ContrastBadge targetRef={baseRef} mode={contrastMode} />
        <span className="font-medium">{name}</span>
      </div>
      {/* Foreground band */}
      <div ref={fgRef} className={cn('group relative flex h-12 items-center gap-2 pl-3 pr-16 text-sm', fgClass)}>
        <ContrastBadge targetRef={fgRef} mode={contrastMode} />
        <span className="font-medium">{name} Foreground</span>
      </div>
      {/* Chips */}
      {view !== 'none' && (
        view === 'both' ? (
          <div className="mt-auto divide-y border-t border-border/60 bg-background/60 text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center gap-2 px-3 py-2">
              <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground/80">Tailwind</span>
              <div className="min-w-0 flex-1 overflow-hidden flex items-center gap-2">
                <CopyChip value={`bg-${name.toLowerCase()}`} />
                <CopyChip value={`text-${name.toLowerCase()}-foreground`} />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 px-3 py-2">
              <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground/80">CSS</span>
              <div className="min-w-0 flex-1 overflow-hidden flex items-center gap-2">
                <CopyChip value={`var(--${name.toLowerCase()})`} />
                <CopyChip value={`var(--${name.toLowerCase()}-foreground)`} />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border/60 bg-background/60 px-3 py-2 text-xs text-muted-foreground">
            {(view === 'tw') && (
              <div className="min-w-0 flex-1 overflow-hidden flex items-center gap-2">
                <CopyChip value={`bg-${name.toLowerCase()}`} />
                <CopyChip value={`text-${name.toLowerCase()}-foreground`} />
              </div>
            )}
            {(view === 'vars') && (
              <div className="min-w-0 flex-1 overflow-hidden flex items-center gap-2">
                <CopyChip value={`var(--${name.toLowerCase()})`} />
                <CopyChip value={`var(--${name.toLowerCase()}-foreground)`} />
              </div>
            )}
          </div>
        )
      )}
    </div>
  )
}

function ScaleRow({ title, scale, labels }: { title: string; scale: string[]; labels?: string[] }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const { toast } = useToast()
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-foreground">{title}</div>
      <div className="overflow-hidden rounded-lg border border-border/60">
        <div className="grid grid-cols-10">
          {scale.map((cls, i) => (
            <button
              key={i}
              type="button"
              title={`Copy ${cls}`}
              className={cn('relative h-14 transition-transform hover:scale-[1.02] focus:outline-none', cls)}
              onClick={async () => {
                await navigator.clipboard.writeText(cls)
                setCopiedIndex(i)
                toast({ title: 'Copied', description: cls })
                setTimeout(() => setCopiedIndex((v) => (v === i ? null : v)), 1000)
              }}
            >
              {copiedIndex === i ? (
                <span className="pointer-events-none absolute bottom-1 right-1 rounded bg-black/40 px-1 text-[10px] text-white backdrop-blur-sm dark:bg-white/20">Copied</span>
              ) : null}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-10 border-t border-border/60 bg-background/60 text-center text-[11px] text-muted-foreground">
          {(labels ?? ['100','200','300','400','500','600','700','800','900','950']).map((l, i) => (
            <div key={i} className="px-1 py-1">
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ColorsDocs() {
  const storageKey = 'hds-color-code-view'
  const contrastKey = 'hds-color-contrast-view'
  const [view, setView] = useState<ViewMode>(() => {
    if (typeof window === 'undefined') return 'none'
    const v = window.localStorage.getItem(storageKey) as ViewMode | null
    return v ?? 'none'
  })
  const [contrastView, setContrastView] = useState<ContrastView>(() => {
    if (typeof window === 'undefined') return 'all'
    const v = window.localStorage.getItem(contrastKey) as ContrastView | null
    return v ?? 'all'
  })

  useEffect(() => {
    if (typeof window !== 'undefined') window.localStorage.setItem(storageKey, view)
  }, [view])
  useEffect(() => {
    if (typeof window !== 'undefined') window.localStorage.setItem(contrastKey, contrastView)
  }, [contrastView])

  return (
    <div className="space-y-8">
      {/* Theme tokens */}
      <Card className="border-border/70 bg-card/80 backdrop-blur">
        <CardHeader className="border-b border-border/60">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Theme Tokens</CardTitle>
              <CardDescription>Semantic CSS variables that adapt to light and dark themes.</CardDescription>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="block text-xs text-muted-foreground whitespace-nowrap">Show code</span>
              <div className="inline-flex overflow-hidden rounded-md border">
              {([
                { key: 'none', label: 'None' },
                { key: 'tw', label: 'Tailwind' },
                { key: 'vars', label: 'CSS' },
                { key: 'both', label: 'Both' },
              ] as const).map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setView(opt.key)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium transition-colors',
                    view === opt.key ? 'bg-foreground text-background' : 'bg-background text-muted-foreground hover:text-foreground',
                  )}
                  aria-pressed={view === opt.key}
                >
                  {opt.label}
                </button>
              ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-2 items-stretch">
            <PairTile contrastMode={contrastView} view={view} name="Primary" baseClass="bg-primary text-primary-foreground" fgClass="bg-primary-foreground text-primary" />
            <PairTile contrastMode={contrastView} view={view} name="Secondary" baseClass="bg-secondary text-secondary-foreground" fgClass="bg-secondary-foreground text-secondary" />
            <PairTile contrastMode={contrastView} view={view} name="Accent" baseClass="bg-accent text-accent-foreground" fgClass="bg-accent-foreground text-accent" />
            <PairTile contrastMode={contrastView} view={view} name="Muted" baseClass="bg-muted text-muted-foreground" fgClass="bg-muted-foreground text-muted" />
            <PairTile contrastMode={contrastView} view={view} name="Destructive" baseClass="bg-destructive text-destructive-foreground" fgClass="bg-destructive-foreground text-destructive" />
            <PairTile contrastMode={contrastView} view={view} name="Card" baseClass="bg-card text-card-foreground" fgClass="bg-card-foreground text-card" />
            <PairTile contrastMode={contrastView} view={view} name="Popover" baseClass="bg-popover text-popover-foreground" fgClass="bg-popover-foreground text-popover" />
            <PairTile contrastMode={contrastView} view={view} name="Background" baseClass="bg-background text-foreground" fgClass="bg-foreground text-background" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-3 items-stretch">
            <TokenTile view={view} name="Border" className="bg-border text-foreground" subtitle="outline/separators" />
            <TokenTile view={view} name="Input" className="bg-input text-foreground" subtitle="form borders" />
            <TokenTile view={view} name="Ring" className="bg-ring text-background" subtitle="focus ring" />
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Accessibility: The badges (AA/AAA/⚠︎) show the WCAG contrast ratio between text and its background.
            AA ≥ 4.5:1, AAA ≥ 7:1; ⚠︎ indicates below AA. Values update automatically with theme changes.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Contrast badges:</span>
            <div className="inline-flex overflow-hidden rounded-md border">
              {([
                { key: 'all', label: 'All' },
                { key: 'fails', label: 'Fails only' },
                { key: 'off', label: 'Off' },
              ] as const).map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setContrastView(opt.key)}
                  className={cn(
                    'px-2.5 py-1 text-[11px] font-medium transition-colors',
                    contrastView === opt.key ? 'bg-foreground text-background' : 'bg-background text-muted-foreground hover:text-foreground',
                  )}
                  aria-pressed={contrastView === opt.key}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Functional scales */}
      <Card className="border-border/70 bg-card/80 backdrop-blur">
        <CardHeader className="border-b border-border/60">
          <CardTitle>Functional Scales</CardTitle>
          <CardDescription>Utility palettes used by variants (success, warning, danger, gray).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 p-6">
          <ScaleRow
            title="Success (emerald)"
            scale={['bg-emerald-100','bg-emerald-200','bg-emerald-300','bg-emerald-400','bg-emerald-500','bg-emerald-600','bg-emerald-700','bg-emerald-800','bg-emerald-900','bg-emerald-950']}
          />
          <ScaleRow
            title="Warning (amber)"
            scale={['bg-amber-100','bg-amber-200','bg-amber-300','bg-amber-400','bg-amber-500','bg-amber-600','bg-amber-700','bg-amber-800','bg-amber-900','bg-amber-950']}
          />
          <ScaleRow
            title="Danger (red)"
            scale={['bg-red-100','bg-red-200','bg-red-300','bg-red-400','bg-red-500','bg-red-600','bg-red-700','bg-red-800','bg-red-900','bg-red-950']}
          />
          <ScaleRow
            title="Gray (slate)"
            scale={['bg-slate-100','bg-slate-200','bg-slate-300','bg-slate-400','bg-slate-500','bg-slate-600','bg-slate-700','bg-slate-800','bg-slate-900','bg-slate-950']}
          />
        </CardContent>
      </Card>

      {/* Chart tokens */}
      <Card className="border-border/70 bg-card/80 backdrop-blur">
        <CardHeader className="border-b border-border/60">
          <CardTitle>Chart Tokens</CardTitle>
          <CardDescription>Brand-agnostic categorical colors exposed as CSS vars and Tailwind keys.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5 p-6">
          {[1,2,3,4,5].map((n) => (
            <div key={n} className="space-y-2">
              <div
                className="flex h-16 items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm"
                style={{ backgroundColor: `hsl(var(--chart-${n}))`, color: 'hsl(var(--foreground))' }}
              >
                <span className="font-medium">Chart {n}</span>
                <span className="text-xs opacity-80">--chart-{n}</span>
              </div>
              <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <CopyChip value={`bg-chart-${n}`} />
                <CopyChip value={`var(--chart-${n})`} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
