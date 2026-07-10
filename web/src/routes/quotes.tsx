import { Link, createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { Shell } from '~/components/Shell'
import { biaoQuotes } from '~/data/site'
import { pageTitle, seo } from '~/utils/seo'

export const Route = createFileRoute('/quotes')({
  head: () => ({
    meta: [
      ...seo({
        title: pageTitle('范德彪语录'),
        description: '范德彪语录墙：点击播放硬话。土到骨头，酷到出刃。',
        path: '/quotes',
      }),
    ],
  }),
  component: QuotesPage,
})

function QuotesPage() {
  const [active, setActive] = React.useState<string | null>(null)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)

  const play = async (id: string, src: string) => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    const audio = new Audio(src)
    audioRef.current = audio
    setActive(id)
    try {
      await audio.play()
    } catch {
      /* */
    }
    audio.addEventListener('ended', () => {
      setActive(null)
      if (audioRef.current === audio) audioRef.current = null
    })
  }

  return (
    <Shell footerMega="语录" footerNote="范德彪 · 态度授权 · 点击播放">
      <main id="main" className="page">
        <p className="kicker">QUOTES · 范德彪</p>
        <h1 className="page-h">
          硬话墙
          <br />
          <em>点一下</em>
        </h1>
        <p className="lead">主理人范德彪的态度授权语录。点击卡片播放旁白——土味进行到底，锋利也别丢。</p>

        <div className="quote-wall" style={{ marginTop: '1.75rem' }}>
          {biaoQuotes.map((q) => (
            <button
              key={q.id}
              type="button"
              className={`q-card ${active === q.id ? 'is-on' : ''}`}
              onClick={() => play(q.id, q.audio)}
            >
              <p>{q.text}</p>
              <div className="q-meta">
                <span>BIAO · {q.id}</span>
                <span className="q-play">▶ 听</span>
              </div>
            </button>
          ))}
        </div>

        <div className="band">
          <p>语录不是装饰。是工作室出刀前的气氛组。</p>
          <footer>土酷进行到底</footer>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          <Link className="btn btn-led" to="/contact">
            开干
          </Link>
          <Link className="btn btn-ghost" to="/stories">
            工作室叙事
          </Link>
        </div>
      </main>
    </Shell>
  )
}
