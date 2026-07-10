import { Link, createFileRoute } from '@tanstack/react-router'
import { Shell } from '~/components/Shell'
import { services, spectrum } from '~/data/site'
import { pageTitle, seo } from '~/utils/seo'

export const Route = createFileRoute('/services')({
  head: () => ({
    meta: [
      ...seo({
        title: pageTitle('服务'),
        description:
          '哈拉少服务：品牌识别、产品体验、动态影像、空间体验、内容系统与全案。',
        path: '/services',
      }),
    ],
  }),
  component: ServicesPage,
})

function ServicesPage() {
  return (
    <Shell footerMega="服务" footerNote="Brand · Product · Motion · Space · Content">
      <main id="main" className="page">
        <p className="kicker">SERVICES</p>
        <h1 className="page-h">
          服务
          <br />
          <em>跨尺度出刀</em>
        </h1>
        <p className="lead">
          从地方风味与市井零售，到数字产品、影像发布与未来叙事。可单点委托，也可全案。
        </p>

        <div className="spec-grid" style={{ margin: '2rem 0' }}>
          {spectrum.slice(0, 3).map((s) => (
            <div key={s.lv} className={`spec-card ${s.tone === 'mid' ? '' : s.tone}`}>
              <div className="lv">{s.lv}</div>
              <strong>{s.title}</strong>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="svc-grid">
          {services.map((s) => (
            <article key={s.tag} className={`svc ${s.featured ? 'featured' : ''}`}>
              <span className="tag">{s.tag}</span>
              <h2>{s.title}</h2>
              <p>{s.desc}</p>
              <ul>
                {s.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          <Link className="btn btn-led" to="/contact">
            谈一个项目
          </Link>
          <Link className="btn btn-ghost" to="/process">
            看流程
          </Link>
          <Link className="btn btn-ghost" to="/work">
            看作品
          </Link>
        </div>
      </main>
    </Shell>
  )
}
