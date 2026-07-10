import { Link, createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { Shell } from '~/components/Shell'
import { filmClips } from '~/data/site'
import { pageTitle, seo } from '~/utils/seo'

export const Route = createFileRoute('/film')({
  head: () => ({
    meta: [
      ...seo({
        title: pageTitle('片源放映厅'),
        description: '哈拉少片源系统：showreel、电影镜头、粒子漩涡、作品片段。',
        path: '/film',
      }),
    ],
  }),
  component: FilmPage,
})

function FilmPage() {
  const vidRef = React.useRef<HTMLVideoElement>(null)
  const fillRef = React.useRef<HTMLElement>(null)
  const timeRef = React.useRef<HTMLSpanElement>(null)
  const [src, setSrc] = React.useState(filmClips[0].src)
  const [poster, setPoster] = React.useState(filmClips[0].poster)
  const [playing, setPlaying] = React.useState(false)

  const fmt = (s: number) => {
    if (!Number.isFinite(s)) return '0:00'
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  }

  const sync = () => {
    const vid = vidRef.current
    if (!vid) return
    const d = vid.duration || 0
    const c = vid.currentTime || 0
    if (fillRef.current) fillRef.current.style.width = `${d ? (c / d) * 100 : 0}%`
    if (timeRef.current) timeRef.current.textContent = `${fmt(c)} / ${fmt(d)}`
    setPlaying(!vid.paused && !vid.ended)
  }

  const play = async () => {
    const vid = vidRef.current
    if (!vid) return
    try {
      vid.muted = false
      await vid.play()
    } catch {
      vid.muted = true
      await vid.play().catch(() => {})
    }
    sync()
  }

  const load = (clip: (typeof filmClips)[0]) => {
    const was = vidRef.current && !vidRef.current.paused
    setSrc(clip.src)
    setPoster(clip.poster)
    requestAnimationFrame(() => {
      const vid = vidRef.current
      if (!vid) return
      vid.load()
      if (was) play()
      else sync()
    })
  }

  return (
    <Shell footerMega="FILM" footerNote="多轨片源 · 自定义播放器">
      <main id="main" className="page" style={{ maxWidth: 1100 }}>
        <p className="kicker">FILM SYSTEM</p>
        <h1 className="page-h">
          放映厅
          <br />
          <em>多轨片源</em>
        </h1>
        <p className="lead">自定义播放器。章节切换 + 分镜墙。旁白与纯影像分轨。</p>

        <div className="player">
          <div className="player-stage">
            <video
              ref={vidRef}
              key={src}
              playsInline
              preload="metadata"
              poster={poster}
              onTimeUpdate={sync}
              onLoadedMetadata={sync}
              onPlay={sync}
              onPause={sync}
              onEnded={sync}
            >
              <source src={src} type="video/mp4" />
            </video>
            {!playing ? (
              <button
                type="button"
                className="btn btn-led"
                style={{
                  position: 'absolute',
                  inset: 0,
                  margin: 'auto',
                  width: '4.5rem',
                  height: '4.5rem',
                  borderRadius: '50%',
                  padding: 0,
                }}
                aria-label="播放"
                onClick={play}
              >
                ▶
              </button>
            ) : null}
          </div>
          <div className="player-bar">
            <button
              type="button"
              aria-label="播放暂停"
              onClick={() => {
                const v = vidRef.current
                if (!v) return
                if (v.paused) play()
                else {
                  v.pause()
                  sync()
                }
              }}
            >
              {playing ? '❚❚' : '▶'}
            </button>
            <div
              className="scrub"
              onPointerDown={(e) => {
                const vid = vidRef.current
                const el = e.currentTarget
                if (!vid?.duration) return
                const seek = (ev: PointerEvent | React.PointerEvent) => {
                  const r = el.getBoundingClientRect()
                  const ratio = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width))
                  vid.currentTime = ratio * vid.duration
                  sync()
                }
                seek(e)
                const move = (ev: PointerEvent) => seek(ev)
                const up = () => {
                  removeEventListener('pointermove', move)
                  removeEventListener('pointerup', up)
                }
                addEventListener('pointermove', move)
                addEventListener('pointerup', up)
              }}
            >
              <i ref={fillRef as React.RefObject<HTMLElement>} />
            </div>
            <span className="player-time" ref={timeRef} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-mute)' }}>
              0:00 / 0:00
            </span>
            <button
              type="button"
              onClick={() => {
                const v = vidRef.current
                if (!v) return
                v.muted = !v.muted
              }}
            >
              声
            </button>
          </div>
        </div>

        <div className="clips">
          {filmClips.map((c) => (
            <button
              key={c.src}
              type="button"
              className={`clip ${src === c.src ? 'is-on' : ''}`}
              onClick={() => load(c)}
            >
              <img src={c.poster} alt="" />
              <p>{c.label}</p>
            </button>
          ))}
        </div>

        <div className="band">
          <p>小树不倒我就不倒——片源也一样，剪到站得住为止。</p>
          <footer>范德彪 · 片源气氛组</footer>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          <Link className="btn btn-ghost" to="/work">
            回作品
          </Link>
          <Link className="btn btn-led" to="/contact">
            谈影像项目
          </Link>
        </div>
      </main>
    </Shell>
  )
}
