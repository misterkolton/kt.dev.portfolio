import { lazy, Suspense } from 'react'

import PortfolioApp from './App'

const TokenDesignSystemApp = lazy(() => import('./hooli/App'))

export default function Root() {
  const isDesignSystem = window.location.pathname.startsWith('/design-system')

  if (isDesignSystem) {
    return (
      <Suspense fallback={null}>
        <TokenDesignSystemApp />
      </Suspense>
    )
  }

  return <PortfolioApp />
}
