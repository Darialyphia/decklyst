import { AppShellContext } from '@/context/useAppShell'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import type { FC, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { PageLoader } from '../PageLoader'
import { AppHeader } from './AppHeader'
import { AppLogo } from './AppLogo'
import { AppNav } from './AppNav'

export const AppShell: FC<{ children: ReactNode }> = ({ children }) => {
  const [isNavExpanded, setNavExpanded] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    const handleRouteChanged = (url: string, { shallow }: { shallow: boolean }) => {
      if (!shallow) {
        setShowFilters(url.startsWith('/decks'))
      }
    }

    router.events.on('routeChangeComplete', handleRouteChanged)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChanged)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AppShellContext.Provider
      value={[
        { isNavExpanded, showFilters },
        {
          toggleNav: () => setNavExpanded((value) => !value),
          toggleFilters: () => setShowFilters((value) => !value),
        },
      ]}
    >
      <div className="grid h-screen w-screen grid-cols-desktop grid-rows-desktop overflow-hidden bg-gray-1000 grid-areas-desktop">
        <AppLogo />
        <AppHeader />
        <AppNav />
        {status === 'loading' ? <PageLoader /> : children}
      </div>
    </AppShellContext.Provider>
  )
}
