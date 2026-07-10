import { Link, createFileRoute } from '@tanstack/react-router'
import { Shell } from '~/components/Shell'
import { site } from '~/data/site'
import { pageTitle, seo } from '~/utils/seo'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      ...seo({
        title: pageTitle('关于'),
        description: site.description,
        path: '/about',
      }),
    ],
  }),
  component: AboutPage,
})

function AboutPage() {
  return (
    <Shell footerMega="关于" footerNote={`专业工作室 · 原生自${site.origin} · 主理人${site.principal}`}>
      <main id="main" className="page">
        <p className="kicker">ABOUT · {site.origin}原生</p>
        <h1 className="page-h">
          专业的哈拉少
          <br />
          <em>设计工作室</em>
        </h1>
        <p className="lead">
          我们是原生自东北的专业设计工作室，主理人范德彪。做品牌、产品与影像——酷是壳，土是芯；刀口硬，交付也硬。
        </p>

        <div className="about-hero">
          <div>
            <p className="lead" style={{ maxWidth: '42ch' }}>
              东北给了我们直球：不绕弯、不端着。专业给了我们纪律：系统可延展、界面可上线、影像有节奏。新二气质的网感可以借，廉价摆拍免谈。
            </p>
            <p className="lead" style={{ maxWidth: '42ch', marginTop: '1rem' }}>
              工作室不大，刀口集中。不接模板单，不把花活当策略。和创始人、产品与市场负责人并肩，先问清问题，再动手。
            </p>
          </div>
          <figure>
            <img src="/media/studio-space.jpg" alt="哈拉少工作室协作现场" />
          </figure>
        </div>

        <div className="stats">
          <div>
            <b>东北</b>
            <span>原生基因</span>
          </div>
          <div>
            <b>跨尺度</b>
            <span>市井 → 系统 → 未来</span>
          </div>
          <div>
            <b>可交付</b>
            <span>上线 · 延展 · 可回看</span>
          </div>
        </div>

        <div className="prose-grid">
          <div>
            <h2>我们从哪来</h2>
            <p>
              班底长在东北：直球、硬气、能扛事。审美认人间烟火，方法认「删完还站得住」。品牌与界面交叉起步，动效与片源顺着「记得住」的需求自然长出。
            </p>
            <p className="said">「本市几场著名硬仗都是我主打的。」——主理人范德彪</p>
          </div>
          <div>
            <h2>土酷如何成立</h2>
            <p>
              土不是粗糙，是可传播的直球与语境；酷不是堆特效，是剪辑、层级与分寸。二者叠在一起，才有反差记忆。
            </p>
          </div>
          <div>
            <h2>我们怎么看专业</h2>
            <p>
              专业 = 范围说清、节点可回看、文件交得出、上线扛得住。对齐刀口，而不是对齐 PPT 页数。
            </p>
          </div>
          <div>
            <h2>工作室结构</h2>
            <p>
              主理人范德彪 + 伙计新二、雨姐、老蒯、小阿giao；办公室主任吴总统筹档期；马大帅保障后勤。
            </p>
          </div>
        </div>

        <div className="band">
          <p>小树不倒我就不倒。模板可以倒，立场别倒。东北人办事，说话算话。</p>
          <footer>哈拉少 · 范德彪工作室</footer>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          <Link className="btn btn-led" to="/team">
            认识班底
          </Link>
          <Link className="btn btn-ghost" to="/services">
            看服务
          </Link>
          <Link className="btn btn-ghost" to="/contact">
            开干
          </Link>
        </div>
      </main>
    </Shell>
  )
}
