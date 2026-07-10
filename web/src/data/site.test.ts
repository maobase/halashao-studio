import { describe, expect, it } from 'vitest'
import {
  coreNavPaths,
  homeSectionIds,
  requiredRoster,
  rosterIsComplete,
  site,
  team,
} from './site'

describe('site identity data (shipped SSR content source)', () => {
  it('describes a professional Northeast-native studio with principal 范德彪', () => {
    expect(site.name).toBe('哈拉少')
    expect(site.principal).toBe('范德彪')
    expect(site.origin).toBe('东北')
    expect(site.description).toContain('专业')
    expect(site.description).toContain('东北')
    expect(site.description).toContain('范德彪')
    expect(site.description).not.toContain('磨豆腐')
    expect(site.tagline).not.toMatch(/什么都干/)
  })

  it('includes the full required roster on the team data used by /team and homepage', () => {
    expect(rosterIsComplete(team)).toBe(true)
    for (const name of requiredRoster) {
      expect(team.some((m) => m.name === name)).toBe(true)
    }
  })

  it('exposes multi-page IA paths for core studio outcomes', () => {
    const paths = coreNavPaths()
    for (const need of [
      '/',
      '/work',
      '/film',
      '/team',
      '/services',
      '/about',
      '/quotes',
      '/stories',
      '/contact',
      '/lab',
      '/system',
      '/process',
    ]) {
      expect(paths).toContain(need)
    }
  })

  it('defines enough homepage SSR section ids for density (≥5)', () => {
    expect(homeSectionIds.length).toBeGreaterThanOrEqual(5)
    expect(homeSectionIds).toContain('hero')
    expect(homeSectionIds).toContain('work-rail')
    expect(homeSectionIds).toContain('quotes')
    expect(homeSectionIds).toContain('system-modules')
    expect(homeSectionIds).toContain('cta')
  })
})
