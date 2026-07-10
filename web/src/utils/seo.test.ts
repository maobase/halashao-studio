import { describe, expect, it } from 'vitest'
import { site } from '../data/site'
import { pageTitle, seo } from './seo'

describe('seo helpers (shipped head metadata)', () => {
  it('pageTitle appends studio brand for SEO-readable titles', () => {
    const t = pageTitle('作品硬仗')
    expect(t).toContain('作品硬仗')
    expect(t).toContain(site.name)
    expect(t).toContain('设计工作室')
  })

  it('seo() emits title and description tags from real site defaults', () => {
    const tags = seo({ title: '测试页 · 哈拉少设计工作室', path: '/work' })
    const titleTag = tags.find((t) => 'title' in t && (t as { title?: string }).title)
    const desc = tags.find(
      (t) => 'name' in t && (t as { name?: string }).name === 'description',
    ) as { content?: string } | undefined
    const ogTitle = tags.find(
      (t) => 'name' in t && (t as { name?: string }).name === 'og:title',
    ) as { content?: string } | undefined

    expect(titleTag).toBeTruthy()
    expect((titleTag as { title: string }).title).toBe('测试页 · 哈拉少设计工作室')
    expect(desc?.content).toBe(site.description)
    expect(desc?.content).toContain('哈拉少')
    expect(ogTitle?.content).toBe('测试页 · 哈拉少设计工作室')
  })

  it('seo() prefers explicit description over default when provided', () => {
    const tags = seo({
      title: '片源',
      description: '哈拉少片源放映厅：多轨视频。',
      path: '/film',
    })
    const desc = tags.find(
      (t) => 'name' in t && (t as { name?: string }).name === 'description',
    ) as { content?: string }
    expect(desc.content).toBe('哈拉少片源放映厅：多轨视频。')
  })
})
