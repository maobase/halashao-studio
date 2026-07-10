/// <reference types="vite/client" />
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import { site } from '~/data/site'
import appCss from '~/styles/app.css?url'
import { seo } from '~/utils/seo'

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: `${site.name}设计工作室`,
  alternateName: site.nameEn,
  description: site.description,
  email: site.email,
  founder: { '@type': 'Person', name: site.principal },
  areaServed: 'CN',
  knowsAbout: ['品牌设计', '产品体验', '动态影像', '土酷视觉'],
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ...seo({
        title: `${site.name} · 专业设计工作室 · 主理人${site.principal}`,
        description: site.description,
        path: '/',
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+SC:wght@400;700;900&family=Syne:wght@700;800&display=swap',
      },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body>
        {children}
        {import.meta.env.DEV ? (
          <TanStackRouterDevtools position="bottom-right" />
        ) : null}
        <Scripts />
      </body>
    </html>
  )
}
