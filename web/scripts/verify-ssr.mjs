/**
 * Live SSR verification against a running `npm run dev` server.
 * Usage: node scripts/verify-ssr.mjs [baseUrl] [outDir]
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const base = process.argv[2] || 'http://localhost:3000'
const outDir =
  process.argv[3] ||
  process.env.SCRATCH ||
  join(process.cwd(), '.verify-out')

async function fetchText(path) {
  const res = await fetch(`${base}${path}`)
  const body = await res.text()
  return { status: res.status, body }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

const requiredNames = ['范德彪', '新二', '雨姐', '老蒯', '小阿giao', '吴总', '马大帅']
const homeSections = [
  'data-home-section="hero"',
  'data-home-section="practice"',
  'data-home-section="work-rail"',
  'data-home-section="quotes"',
  'data-home-section="team-strip"',
  'data-home-section="system-modules"',
  'data-home-section="cta"',
]

await mkdir(outDir, { recursive: true })

const home = await fetchText('/')
const work = await fetchText('/work')
const team = await fetchText('/team')
const about = await fetchText('/about')

await writeFile(join(outDir, 'home.html'), home.body)
await writeFile(join(outDir, 'work.html'), work.body)
await writeFile(join(outDir, 'team-or-about.html'), team.body + '\n<!-- ABOUT -->\n' + about.body)

assert(home.status === 200, `home status ${home.status}`)
assert(work.status === 200, `work status ${work.status}`)
assert(team.status === 200, `team status ${team.status}`)
assert(about.status === 200, `about status ${about.status}`)

assert(home.body.includes('<title>'), 'home missing title')
assert(home.body.includes('name="description"'), 'home missing description meta')
assert(home.body.includes('哈拉少'), 'home missing studio name')
assert(!home.body.includes('磨豆腐买早点'), 'forbidden raw slogan in home')

const sectionHits = homeSections.filter((s) => home.body.includes(s))
assert(
  sectionHits.length >= 5,
  `home sections insufficient: ${sectionHits.length} ${JSON.stringify(sectionHits)}`,
)

assert(work.body.includes('熔光') || work.body.includes('硬仗'), 'work missing case content')
assert(work.body.includes('name="description"'), 'work missing description')

const identityHits = {}
for (const name of requiredNames) {
  identityHits[name] = team.body.includes(name) || about.body.includes(name) || home.body.includes(name)
  assert(identityHits[name], `missing identity name: ${name}`)
}

assert(about.body.includes('东北') || home.body.includes('东北'), 'missing Northeast framing')
assert(about.body.includes('专业') || home.body.includes('专业'), 'missing professional framing')

const report = {
  base,
  statuses: { home: home.status, work: work.status, team: team.status, about: about.status },
  homeSectionsFound: sectionHits,
  identityHits,
  ok: true,
}
await writeFile(join(outDir, 'verify-report.json'), JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
