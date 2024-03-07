import type { AppRouter } from '@/server'
import { QueryClient } from '@tanstack/react-query'
import { httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { NextPageContext } from 'next'
import { devtoolsLink } from 'trpc-client-devtools-link'
import { transformer } from '../common/transformer'
import { trpcUrl } from '../common/urls'

export interface SSRContext extends NextPageContext {
  status?: number
}

export const trpc = createTRPCNext<AppRouter, SSRContext>({
  config({ ctx }) {
    return {
      queryClient: new QueryClient({
        defaultOptions: {
          queries: { retry: false, refetchOnWindowFocus: process.env.NODE_ENV === 'production' },
        },
      }),

      transformer,

      links: [
        devtoolsLink({
          enabled: process.env.NODE_ENV === 'development',
        }),
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: trpcUrl,

          headers() {
            if (ctx?.req) {
              const {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                connection: _connection,
                ...headers
              } = ctx.req.headers
              return {
                ...headers,
                'x-ssr': '1',
              }
            }
            return {}
          },
        }),
      ],
    }
  },
  ssr: false,
})

export type RouterInputs = inferRouterInputs<AppRouter>

export type RouterOutputs = inferRouterOutputs<AppRouter>
