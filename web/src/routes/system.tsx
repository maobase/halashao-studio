import { Link, createFileRoute } from '@tanstack/react-router'
import { Shell } from '~/components/Shell'
import { pageTitle, seo } from '~/utils/seo'

export const Route = createFileRoute('/system')({
  head: () => ({
    meta: [
      ...seo({
        title: pageTitle('系统地图'),
        description: '哈拉少完整系统地图：工作室主站、作品、片源、语录、叙事与实验室。',
        path: '/system',
      }),
    ],
  }),
  component: SystemPage,
})

const blocks = [
  {
    tag: '01 · STUDIO',
    title: '工作室主站',
    links: [
      { to: '/', label: '首页', k: 'HOME' },
      { to: '/about', label: '关于', k: 'ABOUT' },
      { to: '/team', label: '团队', k: 'TEAM' },
      { to: '/services', label: '服务', k: 'SERVICES' },
      { to: '/process', label: '流程', k: 'PROCESS' },
      { to: '/contact', label: '开干', k: 'CONTACT' },
    ],
  },
  {
    tag: '02 · WORK / FILM',
    title: '作品与片源',
    links: [
      { to: '/work', label: '硬仗作品', k: 'WORK' },
      { to: '/film', label: '放映厅', k: 'FILM' },
    ],
  },
  {
    tag: '03 · CULTURE',
    title: '土酷叙事',
    links: [
      { to: '/quotes', label: '彪哥语录墙', k: 'QUOTES' },
      { to: '/stories', label: '滚动叙事', k: 'STORIES' },
    ],
  },
  {
    tag: '04 · LAB',
    title: '实验室',
    links: [
      { to: '/lab', label: '实验室入口', k: 'LAB' },
      { to: '/system', label: '系统地图', k: 'SYSTEM' },
    ],
  },
]

function SystemPage() {
  return (
    <Shell footerMega="系统" footerNote="主站 · 片源 · 文化 · 实验室 · SEO SSR">
      <main id="main" className="page">
        <p className="kicker">SYSTEM MAP</p>
        <h1 className="page-h">
          一整套
          <br />
          <em>不是单页</em>
        </h1>
        <p className="lead">
          TanStack Start SSR 主站：工作室路径 + 作品 + 片源 + 语录 + 叙事。每个路由带独立 head meta，利于 SEO。
        </p>

        <div className="sys-map" style={{ marginTop: '1.75rem' }}>
          {blocks.map((b) => (
            <div key={b.tag} className="sys-block">
              <p className="kicker">{b.tag}</p>
              <h3>{b.title}</h3>
              <ul>
                {b.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to}>
                      {l.label}
                      <span>{l.k}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="band">
          <p>标杆 = 主路径清晰 + 内容可抓取 + 气质统一。</p>
          <footer>HALASHAO SYSTEM · TanStack Start</footer>
        </div>
      </main>
    </Shell>
  )
}
