import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <main className="page" style={{ minHeight: '70dvh' }}>
      <p className="kicker">404</p>
      <h1 className="page-h">
        走错门了
        <br />
        <em>欧了</em>
      </h1>
      <p className="lead">这页不存在。回首页或打开系统地图。</p>
      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
        <Link className="btn btn-led" to="/">
          回首页
        </Link>
        <Link className="btn btn-ghost" to="/system">
          系统地图
        </Link>
      </div>
    </main>
  )
}
