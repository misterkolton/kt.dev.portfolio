export type SidebarItem = {
  label: string
  slug: string
}

export type SidebarSection = {
  title: string
  items: SidebarItem[]
}

// Core building blocks.
export const ATOMS: SidebarItem[] = [
  { label: 'Anchor', slug: 'anchor' },
  { label: 'Animated Check Mark', slug: 'animatedCheckMark' },
  { label: 'Aside', slug: 'aside' },
  { label: 'Avatar', slug: 'avatar' },
  { label: 'Badge', slug: 'badge' },
  { label: 'Bar', slug: 'bar' },
  { label: 'Capsule', slug: 'capsule' },
  { label: 'Card', slug: 'card' },
  { label: 'Colors', slug: 'colors' },
  { label: 'Color Thumbnail', slug: 'colorThumbnail' },
  { label: 'Div', slug: 'div' },
  { label: 'H Stack', slug: 'hStack' },
  { label: 'Iconography', slug: 'iconography' },
  { label: 'List', slug: 'list' },
  { label: 'List Item', slug: 'listItem' },
  { label: 'Items', slug: 'items' },
  { label: 'Loading Spinner', slug: 'loadingSpinner' },
  { label: 'Portal', slug: 'portal' },
  { label: 'Section', slug: 'section' },
  { label: 'Spacer', slug: 'spacer' },
  { label: 'Span', slug: 'span' },
  { label: 'Typography', slug: 'typography' },
  { label: 'Prose', slug: 'prose' },
  { label: 'Typography Guidelines', slug: 'typographyMigration' },
  { label: 'Type Scale', slug: 'typeScale' },
  { label: "Typography Do's & Don'ts", slug: 'typographyDosDonts' },
  { label: 'V Stack', slug: 'vStack' },
]

// Composed interface patterns.
export const MOLECULES: SidebarItem[] = [
  { label: 'Article Card', slug: 'articleCard' },
  { label: 'Block Quote', slug: 'blockQuote' },
  { label: 'Button', slug: 'button' },
  { label: 'Checkbox', slug: 'checkbox' },
  { label: 'Circle', slug: 'circle' },
  { label: 'Clipboard', slug: 'clipboard' },
  { label: 'Close Button', slug: 'closeButton' },
  { label: 'Comparison Item', slug: 'comparisonItem' },
  { label: 'Context Bar', slug: 'contextBar' },
  { label: 'Countdown Timer', slug: 'countdownTimer' },
  { label: 'Dialog', slug: 'dialog' },
  { label: 'Display Card', slug: 'displayCard' },
  { label: 'Download Button', slug: 'downloadButton' },
  { label: 'Drag Bar', slug: 'dragBar' },
  { label: 'Drag Box', slug: 'dragBox' },
  { label: 'Drawer', slug: 'drawer' },
  { label: 'Dropdown Menu', slug: 'dropDownMenu' },
  { label: 'Feature Badge', slug: 'featureBadge' },
  { label: 'Grid', slug: 'grid' },
  { label: 'Icon Link', slug: 'iconLink' },
  { label: 'Image', slug: 'image' },
  { label: 'Image Thumbnail', slug: 'imageThumbnail' },
  { label: 'Infinite Scroller', slug: 'infiniteScroller' },
  { label: 'Info Block', slug: 'infoBlock' },
  { label: 'Input', slug: 'input' },
  { label: 'Link Column', slug: 'linkColumn' },
  { label: 'Loader', slug: 'loader' },
  { label: 'Logo', slug: 'logo' },
  { label: 'Masonry Grid', slug: 'masonryGrid' },
  { label: 'Menu', slug: 'menu' },
  { label: 'Navigation', slug: 'navigation' },
  { label: 'Overlay', slug: 'overlay' },
  { label: 'Progress', slug: 'progress' },
  { label: 'Quantity Slider', slug: 'quantitySlider' },
  { label: 'Quick Link', slug: 'quickLink' },
  { label: 'Release Note', slug: 'releaseNote' },
  { label: 'Scrollable', slug: 'scrollable' },
  { label: 'Scrolling Indicator', slug: 'scrollingIndicator' },
  { label: 'Select', slug: 'select' },
  { label: 'Separator', slug: 'separator' },
  { label: 'Sheet', slug: 'sheet' },
  { label: 'Sidebar', slug: 'sidebar' },
  { label: 'Slider', slug: 'slider' },
  { label: 'Sphere', slug: 'sphere' },
  { label: 'Stacked Cards', slug: 'stackedCards' },
  { label: 'Stoplight', slug: 'stoplight' },
  { label: 'Tab', slug: 'tab' },
  { label: 'Table', slug: 'table' },
  { label: 'Titled List', slug: 'titledList' },
  { label: 'Todo', slug: 'todo' },
  { label: 'Toggle', slug: 'toggle' },
  { label: 'Tooltip', slug: 'tooltip' },
  { label: 'Transition', slug: 'transition' },
  { label: 'Upload Button', slug: 'uploadButton' },
]

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  { title: 'Atoms', items: ATOMS },
  { title: 'Molecules', items: MOLECULES },
]

// Convenience: flattened list of all items
export const ALL_COMPONENT_ITEMS: SidebarItem[] = [...ATOMS, ...MOLECULES]
