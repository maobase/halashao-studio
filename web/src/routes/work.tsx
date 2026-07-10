import { Link, createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { Shell } from '~/components/Shell'
import { works } from '~/data/site'
import { pageTitle, seo } from '~/utils/seo'

export const Route = createFileRoute('/work')({
  head: () => ({
    meta: [
      ...seo({
        title: pageTitle('作品硬仗'),
        description: '哈拉少作品：品牌、产品、动效与空间硬仗。悬停放出影像。',
        path: '/work',
      }),
    ],
  }),
  component: WorkPage,
})

function WorkPage() {
  return (
    <Shell footerMega="作品" footerNote="WORK · 硬仗档案">
      <main id="main" className="page">
        <p className="kicker">WORK</p>
        <h1 className="page-h">
          硬仗
          <br />
          <em>不是样板间</em>
        </h1>
        <p className="lead">悬停放出影像。每条都是打完的仗，不是灵感板截图。</p>

        <div className="work-list" style={{ marginTop: '2rem' }}>
          {works.map((w) => (
            <WorkCard key={w.slug} work={w} />
          ))}
        </div>

        <div className="band">
          <p>档案不是橱窗。是打完还能复盘的硬仗目录。</p>
          <footer>完整过程 · 洽谈展开</footer>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          <Link className="btn btn-led" to="/contact">
            预约档期
          </Link>
          <Link className="btn btn-ghost" to="/film">
            放映厅
          </Link>
          <Link className="btn btn-ghost" to="/services">
            服务范围
          </Link>
        </div>
      </main>
    </Shell>
  )
}

function WorkCard({ work }: { work: (typeof works)[0] }) {
  const ref = React.useRef<HTMLElement>(null)
  const vidRef = React.useRef<HTMLVideoElement>(null)

  return (
    <article
      ref={ref as React.RefObject<HTMLElement>}
      className="work-item"
      onPointerEnter={() => {
        ref.current?.classList.add('is-hot')
        vidRef.current?.play().catch(() => {})
      }}
      onPointerLeave={() => {
        ref.current?.classList.remove('is-hot')
        const v = vidRef.current
        if (!v) return
        v.pause()
        try {
          v.currentTime = 0
        } catch {
          /* */
        }
      }}
    >
      <div className="work-media">
        <img src={work.image} alt={work.title} />
        <video ref={vidRef} muted loop playsInline preload="none" poster={work.image}>
          <source src={work.video} type="video/mp4" />
        </video>
      </div>
      <div className="work-body">
        <span className="tag">{work.tag}</span>
        <h2>{work.title}</h2>
        <p>{work.blurb}</p>
        <p className="said">「{work.quote}」</p>
      </div>
    </article>
  )
}
