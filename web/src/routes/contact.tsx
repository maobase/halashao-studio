import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { Shell } from '~/components/Shell'
import { site } from '~/data/site'
import { pageTitle, seo } from '~/utils/seo'

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: [
      ...seo({
        title: pageTitle('开干 · 联系'),
        description: `联系${site.name}设计工作室。主理人${site.principal}。开始项目。`,
        path: '/contact',
      }),
    ],
  }),
  component: ContactPage,
})

function ContactPage() {
  const [status, setStatus] = React.useState('')

  return (
    <Shell footerMega="开干" footerNote={`主理人${site.principal} · 该出手时就出手`}>
      <main id="main" className="page">
        <p className="kicker">CONTACT</p>
        <h1 className="page-h">
          有火花？
          <br />
          <em>开干</em>
        </h1>
        <p className="lead">描述产品、时间线、想要的感觉。我们认真回复，对齐刀口再谈档期。</p>

        <div className="contact-grid">
          <div>
            <span className="stamp">档期</span>
            <a className="contact-mail" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <p className="lead" style={{ marginTop: '1.25rem' }}>
              你就慢慢跟我们处。处不好，你自己找原因。
            </p>
            <p className="lead">主理人范德彪带班；东北原生，全国协作。吴总统筹对外接口。</p>
          </div>
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault()
              const fd = new FormData(e.currentTarget)
              if (![...fd.values()].every((v) => String(v).trim())) {
                setStatus('填全再发。')
                return
              }
              setStatus('收到。我们尽快回——欧了。')
              e.currentTarget.reset()
            }}
          >
            <label>
              名字
              <input name="name" required autoComplete="name" placeholder="陈以安" />
            </label>
            <label>
              邮箱
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
              />
            </label>
            <label>
              项目简述
              <textarea name="message" rows={5} required placeholder="品牌 / 界面 / 发布片…" />
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
              <button className="btn btn-led" type="submit">
                发送
              </button>
              <p className="form-status" role="status">
                {status}
              </p>
            </div>
          </form>
        </div>
      </main>
    </Shell>
  )
}
