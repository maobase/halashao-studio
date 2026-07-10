import { Link, createFileRoute } from '@tanstack/react-router'
import { Shell } from '~/components/Shell'
import { labLinks } from '~/data/site'
import { pageTitle, seo } from '~/utils/seo'

export const Route = createFileRoute('/lab')({
  head: () => ({
    meta: [
      ...seo({
        title: pageTitle('实验室'),
        description: '哈拉少实验室：语录、片源、叙事、系统地图与互动入口。',
        path: '/lab',
      }),
    ],
  }),
  component: LabPage,
})

function LabPage() {
  return (
    <Shell footerMega="LAB" footerNote="精选模块 · SSR 系统可演示">
      <main id="main" className="page">
        <p className="kicker">LAB</p>
        <h1 className="page-h">
          实验室
          <br />
          <em>系统支线</em>
        </h1>
        <p className="lead">
          TanStack Start 版主站聚焦可索引内容与核心体验。以下入口把工作室叙事、片源与硬话气氛组串成可走查系统。
        </p>

        <div className="grid-3" style={{ marginTop: '1.75rem' }}>
          {labLinks.map((m) => (
            <Link key={m.href} to={m.href} className="card">
              <span className="tag">{m.tag}</span>
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
              <span className="go">ENTER →</span>
            </Link>
          ))}
        </div>

        <div className="band">
          <p>标杆不是页数。是主路径清晰、支线够狠、气质统一、SSR 可抓取。</p>
          <footer>HALASHAO · TanStack Start</footer>
        </div>
      </main>
    </Shell>
  )
}
