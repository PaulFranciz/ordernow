'use client'

import { ReactNode } from 'react'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { Toaster } from "@/components/ui/toaster"

interface ProvidersProps {
  children: ReactNode
}

function PostHogProvider({ children }: ProvidersProps) {
  useEffect(() => {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

    if (posthogKey && posthogHost) {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        person_profiles: 'identified_only',
      })
    } else {
      console.error('PostHog environment variables are missing.')
    }
  }, [])

  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  )
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        retry: 3,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <PostHogProvider>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster />
      </PostHogProvider>
    </QueryClientProvider>
  )
}
