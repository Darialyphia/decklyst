import { AppShell } from '@/components/AppShell/AppShell'
import { SpriteLoaderProvider } from '@/context/useSpriteLoader'
import { trpc } from '@/utils/trpc'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import type { AppType } from 'next/app'
import Head from 'next/head'
// @ts-ignore
import '../styles/globals.css'

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => (
  <>
    <Head>
      <title>Redecklyst | Duelyst 2 deck companion</title>
      <meta name="description" content="Share or create Duelyst 2 decks" />
      <meta
        name="keywords"
        content="Decklyst, Duelyst, Duelyst 2, database, deck, decklist, deckcode, deckbuilder, meta, tournament, starter decks"
      />
      <meta property="og:site_name" content="Redecklyst" />
      <meta name="google-site-verification" content="todbfz-oykJnt7ZTWmfVp8J6TyL1pnYoPMo6tZtkz-o" />
      <link rel="icon" href="/favicon.ico" />
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': 'https://redecklyst-zeta.vercel.app/#website',
          url: 'https://redecklyst-zeta.vercel.app/',
          name: 'Decklyst',
          description: 'Duelyst 2 deck companion',
          image: 'https://redecklyst-zeta.vercel.app/favicon.png',
          potentialAction: [
            {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://redecklyst-zeta.vercel.app/decks/{deckcode_string}',
              },
              'query-input': 'required name=deckcode_string',
            },
          ],
          inLanguage: 'en-US',
        })}
      </script>
    </Head>
    <SessionProvider session={session}>
      <AppShell>
        <SpriteLoaderProvider>
          <Component {...pageProps} />
        </SpriteLoaderProvider>
      </AppShell>
    </SessionProvider>
    <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
  </>
)

export default trpc.withTRPC(App)
