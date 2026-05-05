import * as React from 'react'

import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SIDEBAR_SECTIONS, type SidebarItem } from './sidebar-data'
import { Menu } from 'lucide-react'

interface DocsSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  activeSlug?: string
  onNavigate?: (slug: string) => void
  inDrawer?: boolean
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export const DocsSidebar: React.FC<DocsSidebarProps> = ({
  className,
  activeSlug,
  onNavigate,
  inDrawer = false,
  collapsed = false,
  onToggleCollapse,
  ...props
}) => {
  return (
    <div
      className={cn(
        'border-r border-border/60 bg-background/40 backdrop-blur supports-[backdrop-filter]:bg-background/40',
        inDrawer
          ? 'block h-full w-[260px]'
          : collapsed
            ? 'hidden h-[100svh] w-[64px] lg:sticky lg:top-0 lg:block'
            : 'hidden h-[100svh] w-[260px] lg:sticky lg:top-0 lg:block',
        className,
      )}
      {...props}
    >
      <div className={cn('px-4 pb-3 pt-6')}>
        <div className={cn('flex items-center gap-2')}>
          {!inDrawer && onToggleCollapse ? (
            <button
              type="button"
              aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
              onClick={onToggleCollapse}
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground',
              )}
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
          <div
            className={cn(
              'text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground',
              collapsed && 'hidden',
            )}
          >
            Components
          </div>
        </div>
      </div>
      {!collapsed && (
        <ScrollArea className={cn('px-2 pb-6', inDrawer ? 'h-[calc(100svh-3.25rem)]' : 'h-[calc(100svh-3.25rem)]')}>
          <nav className="space-y-6">
            {SIDEBAR_SECTIONS.map((section) => (
              <div key={section.title} className="relative">
                {/* Sticky section header */}
                <div className={cn(
                  'sticky top-0 z-10 border-b border-border/60 bg-background px-0',
                )}>
                  <div className="px-2 py-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {section.title}
                  </div>
                </div>
                {/* Section links */}
                <div className="space-y-1 px-0 py-2">
                  {section.items.map((item) => (
                    <SidebarLink
                      key={item.slug}
                      item={item}
                      isActive={activeSlug === item.slug}
                      onClick={() => onNavigate?.(item.slug)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>
      )}
    </div>
  )
}

function SidebarLink({
  item,
  isActive,
  onClick,
}: {
  item: SidebarItem
  isActive?: boolean
  onClick?: () => void
}) {
  const Comp: any = 'a'
  return (
    <Comp
      href={`#${item.slug}`}
      onClick={onClick}
      className={cn(
        'group flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors',
        'text-muted-foreground hover:text-foreground',
        isActive && 'bg-muted text-foreground',
      )}
    >
      <span className="truncate">{item.label}</span>
    </Comp>
  )
}
