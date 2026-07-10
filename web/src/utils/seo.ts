import { site } from '~/data/site'

export const seo = ({
  title,
  description,
  keywords,
  image,
  path = '',
}: {
  title: string
  description?: string
  image?: string
  keywords?: string
  path?: string
}) => {
  const desc = description ?? site.description
  const keys = keywords ?? site.keywords
  const img = image ?? '/media/hero-still.jpg'
  const url = path ? `https://localhost:3000${path}` : undefined

  return [
    { title },
    { name: 'description', content: desc },
    { name: 'keywords', content: keys },
    { name: 'author', content: `${site.name} · ${site.principal}` },
    { name: 'theme-color', content: '#070706' },
    { name: 'robots', content: 'index,follow' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: desc },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: img },
    { name: 'og:type', content: 'website' },
    { name: 'og:locale', content: 'zh_CN' },
    { name: 'og:site_name', content: site.name },
    { name: 'og:title', content: title },
    { name: 'og:description', content: desc },
    { name: 'og:image', content: img },
    ...(url ? [{ name: 'og:url', content: url }] : []),
  ]
}

export const pageTitle = (page: string) => `${page} · ${site.name}设计工作室`
