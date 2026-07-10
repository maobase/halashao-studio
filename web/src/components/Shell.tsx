import { Link } from '@tanstack/react-router'
import * as React from 'react'
import { navMore, navPrimary, site } from '~/data/site'
import { Particles } from './Particles'

export function Shell({
  children,
  footerMega = site.name,
  footerNote = '专业工作室 · 原生自东北 · 主理人范德彪',
}: {
  children: React.ReactNode
  footerMega?: string
  footerNote?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 12)
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <div className="noise" aria-hidden />
      <div className="led-grid" aria-hidden />
      <Particles />
      <a
        href="#main"
        style={{
          position: 'absolute',
          left: '-999px',
          top: 0,
          zIndex: 100,
          background: 'var(--color-led)',
          color: '#111',
          padding: '0.5rem 1rem',
        }}
        onFocus={(e) => {
          e.currentTarget.style.left = '1rem'
          e.currentTarget.style.top = '1rem'
        }}
        onBlur={(e) => {
          e.currentTarget.style.left = '-999px'
        }}
      >
        跳到内容
      </a>

      <header className={`shell-nav ${scrolled ? 'is-on' : ''}`}>
        <Link to="/" className="logo">
          <i />
          {site.name}
        </Link>
        <nav className="nav-core" aria-label="主导航">
          {navPrimary.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === '/' }}
              activeProps={{ className: item.to === '/contact' ? 'cta active' : 'active' }}
              className={item.to === '/contact' ? 'cta' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          className="burger"
          type="button"
          aria-label="菜单"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </header>

      {open ? (
        <div className="drawer" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <nav aria-label="移动导航">
            {[...navPrimary, ...navMore].map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}

      {children}

      <footer className="foot">
        <p className="foot-mega">{footerMega}</p>
        <div className="foot-row">
          <p>{footerNote}</p>
          <div className="foot-links">
            <Link to="/about">关于</Link>
            <Link to="/team">团队</Link>
            <Link to="/work">作品</Link>
            <Link to="/contact">开干</Link>
          </div>
          <p className="foot-copy">© {new Date().getFullYear()} {site.nameEn}</p>
        </div>
      </footer>
    </>
  )
}
