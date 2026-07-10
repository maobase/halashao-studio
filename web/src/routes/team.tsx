import { Link, createFileRoute } from '@tanstack/react-router'
import { Shell } from '~/components/Shell'
import { team } from '~/data/site'
import { pageTitle, seo } from '~/utils/seo'

export const Route = createFileRoute('/team')({
  head: () => ({
    meta: [
      ...seo({
        title: pageTitle('团队班底'),
        description:
          '哈拉少班底：主理人范德彪，伙计新二、雨姐、老蒯、小阿giao，办公室主任吴总，食堂主管马大帅。',
        path: '/team',
      }),
    ],
  }),
  component: TeamPage,
})

function TeamPage() {
  return (
    <Shell footerMega="团队" footerNote="主理人范德彪 · 伙计齐刃 · 吴总 / 马大帅托底">
      <main id="main" className="page">
        <p className="kicker">TEAM · 东北班底</p>
        <h1 className="page-h">
          班底
          <br />
          <em>人少，刃齐</em>
        </h1>
        <p className="lead">
          主理人定调，伙计出刀，行政与后勤托底。东北原生班底，全国协作交付。
        </p>

        <div className="team-grid" style={{ marginTop: '2rem' }}>
          {team.map((p) => (
            <article key={p.name} className={`person ${p.wide ? 'wide' : ''}`}>
              <div className="person-visual">
                <img src={p.image} alt={p.name} width={800} height={800} />
                <span className="chip">{p.chip}</span>
              </div>
              <div className="person-body">
                <h2>{p.name}</h2>
                <p className="title">{p.role}</p>
                <p>{p.bio}</p>
                <p className="said">「{p.quote}」</p>
              </div>
            </article>
          ))}
        </div>

        <div className="band">
          <p>班底定调，项目制补刀。摄影、字体、三维与工程协作按需拉起——标准不稀释。</p>
          <footer>哈拉少 · 范德彪工作室</footer>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          <Link className="btn btn-led" to="/contact">
            一起做项目
          </Link>
          <Link className="btn btn-ghost" to="/about">
            关于工作室
          </Link>
        </div>
      </main>
    </Shell>
  )
}
