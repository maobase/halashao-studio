import { Link, createFileRoute } from '@tanstack/react-router'
import { Shell } from '~/components/Shell'
import { processSteps } from '~/data/site'
import { pageTitle, seo } from '~/utils/seo'

export const Route = createFileRoute('/process')({
  head: () => ({
    meta: [
      ...seo({
        title: pageTitle('合作流程'),
        description: '哈拉少项目流程：对齐、锻造、淬火、上线。',
        path: '/process',
      }),
    ],
  }),
  component: ProcessPage,
})

function ProcessPage() {
  return (
    <Shell footerMega="流程" footerNote="四步出刃 · 说话算话">
      <main id="main" className="page">
        <p className="kicker">PROCESS</p>
        <h1 className="page-h">
          怎么推进
          <br />
          <em>四步出刃</em>
        </h1>
        <p className="lead">
          流程短、节点清。异步为主，关键决策同步。你永远知道现在打到哪一刀。
        </p>

        <div className="steps">
          {processSteps.map((s) => (
            <article key={s.n} className="step">
              <div className="n">{s.n}</div>
              <div>
                <h2>{s.title}</h2>
                <p>{s.body}</p>
                <p className="said">「{s.said}」</p>
              </div>
            </article>
          ))}
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          <Link className="btn btn-led" to="/contact">
            开干
          </Link>
          <Link className="btn btn-ghost" to="/services">
            服务范围
          </Link>
        </div>
      </main>
    </Shell>
  )
}
