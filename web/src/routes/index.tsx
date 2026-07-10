import { Link, createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { Shell } from '~/components/Shell'
import {
  biaoQuotes,
  clients,
  homeSectionIds,
  modules,
  site,
  spectrum,
  team,
  works,
} from '~/data/site'
import { pageTitle, seo } from '~/utils/seo'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      ...seo({
        title: pageTitle('专业设计工作室 · 主理人范德彪'),
        description: site.description,
        path: '/',
        image: '/media/hero-still.jpg',
      }),
    ],
  }),
  component: HomePage,
})

function HomePage() {
  const voiceRef = React.useRef<HTMLAudioElement>(null)
  const featured = works.slice(0, 4)

  return (
    <Shell footerMega={site.name}>
      <main id="main">
        {/* HERO — full bleed video + copy */}
        <section className="home-hero" id={homeSectionIds[0]} data-home-section="hero">
          <div className="hero-film">
            <video
              autoPlay
              muted
              loop
              playsInline
              poster="/media/hero-still.jpg"
              aria-label="哈拉少工作室片源"
            >
              <source src="/media/hero-cinematic.mp4" type="video/mp4" />
            </video>
            <span className="hero-film-tag">REC · FILM / 01</span>
          </div>
          <div className="hero-copy">
            <p className="kicker">
              {site.nameEn} · 东北原生设计工作室 · SSR
            </p>
            <h1 className="hero-title">
              <span>哈拉</span>
              <br />
              <span className="line-2">少</span>
            </h1>
            <p className="hero-sub">{site.tagline} · 少是刃。</p>
            <p className="hero-biao">
              <strong>主理人{site.principal}</strong>
              小树不倒我就不倒。跨尺度出刀，不生产模板。酷是壳，土是芯。
            </p>
            <div className="hero-actions">
              <Link className="btn btn-led" to="/work">
                看作品
              </Link>
              <Link className="btn btn-ghost" to="/film">
                放片源
              </Link>
              <Link className="btn btn-ghost" to="/lab">
                实验室
              </Link>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  const a = voiceRef.current
                  if (!a) return
                  if (a.paused) a.play().catch(() => {})
                  else a.pause()
                }}
              >
                听介绍
              </button>
            </div>
            <audio ref={voiceRef} src="/media/voice-intro.mp3" preload="metadata" />
            <div className="hero-meta">
              <div>
                <b>Brand</b>
                <span>识别系统</span>
              </div>
              <div>
                <b>Product</b>
                <span>界面锻造</span>
              </div>
              <div>
                <b>Motion</b>
                <span>影像动效</span>
              </div>
            </div>
          </div>
        </section>

        {/* marquee */}
        <div className="strip" aria-hidden>
          <div className="strip-track">
            {[
              '酷是壳',
              '土是芯',
              '少是刃',
              '东北原生',
              '跨尺度出刀',
              '不生产模板',
              '范德彪主理',
              '新二气质',
              '酷是壳',
              '土是芯',
              '少是刃',
              '东北原生',
              '跨尺度出刀',
              '不生产模板',
              '范德彪主理',
              '新二气质',
            ].map((t, i) => (
              <span key={`${t}-${i}`}>{t}</span>
            ))}
          </div>
        </div>

        {/* dual 土酷 */}
        <section className="dual" aria-label="土酷双面" id="dual-tuku" data-home-section="dual-tuku">
          <div className="dual-block dual-tu">
            <p className="kicker">TU · 土</p>
            <h2>人间烟火</h2>
            <p className="quote">「那长相就是证据。」</p>
            <p>
              地方品牌、餐饮零售、市集触点。直球语气与可传播的记忆点——土是芯，不是粗糙。新二气质的字幕条与红章，写进专业交付。
            </p>
          </div>
          <div className="dual-block dual-ku">
            <p className="kicker">KU · 酷</p>
            <h2>系统与锋利</h2>
            <p className="quote">「少，是刃。」</p>
            <p>
              产品界面、影像发布、空间叙事。层级、节奏、分寸——酷是壳，删到只剩必要。SSR
              站点也要站得住 SEO 与体验。
            </p>
          </div>
        </section>

        {/* 业务光谱 — 首页要满 */}
        <section className="section" id="practice" data-home-section="practice">
          <p className="kicker">PRACTICE · 业务光谱</p>
          <div className="section-head">
            <h2>
              跨尺度出刀
              <br />
              从市井到系统
            </h2>
            <Link className="btn btn-ghost" to="/services">
              全部服务
            </Link>
          </div>
          <p className="lead" style={{ marginBottom: '1.5rem' }}>
            不是空壳 landing。地方零售、消费品牌、产品体验、影像、内容、空间——尺度可变，交付标准不变。
          </p>
          <div className="spec-grid">
            {spectrum.map((s) => (
              <div key={s.lv} className={`spec-card ${s.tone === 'mid' ? '' : s.tone}`}>
                <div className="lv">{s.lv}</div>
                <strong>{s.title}</strong>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 精选硬仗 */}
        <section className="section" style={{ paddingTop: 0 }} id="work-rail" data-home-section="work-rail">
          <div className="section-head">
            <div>
              <p className="kicker">WORK</p>
              <h2>精选硬仗</h2>
            </div>
            <Link className="btn btn-ghost" to="/work">
              全部作品
            </Link>
          </div>
          <div className="rail" data-rail>
            {featured.map((w) => (
              <Link key={w.slug} to="/work" className="rail-card" data-work>
                <img src={w.image} alt={w.title} />
                <video muted loop playsInline preload="none" poster={w.image}>
                  <source src={w.video} type="video/mp4" />
                </video>
                <figcaption>
                  <span>{w.tag}</span>
                  <strong>{w.title}</strong>
                </figcaption>
              </Link>
            ))}
            <Link
              to="/film"
              className="rail-card"
              style={{
                display: 'grid',
                placeContent: 'center',
                padding: '2rem',
                textAlign: 'center',
                background: '#10100e',
              }}
            >
              <span className="stamp">片源</span>
              <strong style={{ marginTop: '1.25rem', fontSize: '1.4rem' }}>
                进放映厅
              </strong>
            </Link>
          </div>
        </section>

        {/* 语录条 */}
        <section className="section" style={{ paddingTop: 0 }} id="quotes" data-home-section="quotes">
          <p className="kicker">BIAO · 范德彪</p>
          <div className="section-head">
            <h2>硬话气氛组</h2>
            <Link className="btn btn-ghost" to="/quotes">
              语录墙
            </Link>
          </div>
          <div className="grid-3">
            {biaoQuotes.slice(0, 6).map((q) => (
              <blockquote key={q.id} className="card">
                <span className="tag">BIAO · {q.id}</span>
                <h3 style={{ fontSize: '1.05rem', lineHeight: 1.45 }}>「{q.text}」</h3>
                <p>主理人态度授权 · 土味进行到底</p>
              </blockquote>
            ))}
          </div>
        </section>

        {/* 班底 — SSR 露出全员名字 */}
        <section className="section" style={{ paddingTop: 0 }} id="team-strip" data-home-section="team-strip">
          <div className="section-head">
            <div>
              <p className="kicker">TEAM · 东北班底</p>
              <h2>主理人范德彪带队</h2>
            </div>
            <Link className="btn btn-ghost" to="/team">
              完整介绍
            </Link>
          </div>
          <p className="lead" style={{ marginBottom: '1.25rem' }}>
            专业工作室，原生自东北。伙计新二、雨姐、老蒯、小阿giao 出刀；吴总统筹档期；马大帅托住后勤。
          </p>
          <div className="grid-3">
            {team.map((p) => (
              <Link key={p.name} to="/team" className="card" style={{ display: 'grid', gap: '0.65rem' }}>
                <img
                  src={p.image}
                  alt={p.name}
                  width={400}
                  height={400}
                  style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 2 }}
                />
                <span className="tag">{p.chip}</span>
                <h3>{p.name}</h3>
                <p>{p.role}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* 系统模块 — 填满首页 */}
        <section className="section" style={{ paddingTop: 0 }} id="system-modules" data-home-section="system-modules">
          <p className="kicker">SYSTEM</p>
          <div className="section-head">
            <h2>
              一整套系统
              <br />
              不是单页空壳
            </h2>
            <Link className="btn btn-ghost" to="/system">
              系统地图
            </Link>
          </div>
          <p className="lead" style={{ marginBottom: '1.5rem' }}>
            工作室主路径、作品、片源、语录、叙事、团队、服务、流程——SSR
            可索引，内容站得住。
          </p>
          <div className="grid-3">
            {modules.map((m) => (
              <Link key={m.to} to={m.to} className="card">
                <span className="tag">{m.tag}</span>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
                <span className="go">ENTER →</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 合作画像 */}
        <section className="section" style={{ paddingTop: 0 }} id="clients" data-home-section="clients">
          <p className="kicker">CLIENTS</p>
          <h2 className="page-h" style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)' }}>
            合作类型画像
          </h2>
          <p className="lead" style={{ marginBottom: '1.25rem' }}>
            示例行业画像（非榜单广告）。真实合作细节可在沟通中展开。
          </p>
          <div className="clients">
            {clients.map((c) => (
              <div key={c.name} className="client">
                <strong>{c.name}</strong>
                <span>{c.note}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="section" style={{ paddingTop: 0, paddingBottom: '5rem' }} id="cta" data-home-section="cta">
          <div className="band">
            <p>他们把混乱压成一条清晰的线。上线后，团队沟通成本明显下降。</p>
            <footer>林知夏 · 北境科技创始人</footer>
          </div>
          <p className="kicker" style={{ marginTop: '2.5rem' }}>
            NEXT
          </p>
          <h2 className="page-h">
            有火花？<em>开干</em>
          </h2>
          <p className="lead">
            你就慢慢跟我们处。处不好，你自己找原因——先把需求丢过来。
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
            <Link className="btn btn-seal" to="/contact">
              开始项目
            </Link>
            <Link className="btn btn-ghost" to="/team">
              先看团队
            </Link>
            <Link className="btn btn-ghost" to="/about">
              关于工作室
            </Link>
          </div>
        </section>
      </main>
    </Shell>
  )
}
