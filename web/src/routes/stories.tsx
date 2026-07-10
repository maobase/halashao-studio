import { Link, createFileRoute } from '@tanstack/react-router'
import { Shell } from '~/components/Shell'
import { storyChapters } from '~/data/site'
import { pageTitle, seo } from '~/utils/seo'

export const Route = createFileRoute('/stories')({
  head: () => ({
    meta: [
      ...seo({
        title: pageTitle('工作室叙事'),
        description: '哈拉少滚动叙事：从东北烟火到系统出刀，范德彪语录章节。',
        path: '/stories',
      }),
    ],
  }),
  component: StoriesPage,
})

function StoriesPage() {
  return (
    <Shell footerMega="叙事" footerNote="五章滚动 · 硬话埋点 · 影像穿插">
      <main id="main" className="page">
        <p className="kicker">STORIES · SCROLL</p>
        <h1 className="page-h">
          工作室叙事
          <br />
          <em>往下滚</em>
        </h1>
        <p className="lead">五章滚动叙事。酷炫外壳，土味芯子——章节里埋着范德彪的硬话。</p>

        <div style={{ marginTop: '1rem' }}>
          {storyChapters.map((ch) => (
            <section key={ch.num} className="story-ch">
              <p className="kicker">{ch.num}</p>
              <h2>
                {ch.title.includes('，') ? (
                  <>
                    {ch.title.split('，')[0]}
                    <br />
                    <em>{ch.title.split('，')[1]}</em>
                  </>
                ) : (
                  ch.title
                )}
              </h2>
              <p className="ch-body">{ch.body}</p>
              <p className="said">「{ch.biao}」</p>
              {ch.media?.type === 'img' ? (
                <div className="ch-media">
                  <img src={ch.media.src} alt={ch.media.alt || ''} />
                </div>
              ) : null}
              {ch.media?.type === 'video' ? (
                <div className="ch-media">
                  <video autoPlay muted loop playsInline poster={ch.media.poster}>
                    <source src={ch.media.src} type="video/mp4" />
                  </video>
                </div>
              ) : null}
              {ch.num.startsWith('05') ? (
                <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                  <Link className="btn btn-seal" to="/contact">
                    开始项目
                  </Link>
                  <Link className="btn btn-ghost" to="/work">
                    看作品
                  </Link>
                  <Link className="btn btn-ghost" to="/film">
                    放片源
                  </Link>
                </div>
              ) : null}
            </section>
          ))}
        </div>
      </main>
    </Shell>
  )
}
