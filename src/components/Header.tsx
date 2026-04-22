import logoSrc from '../assets/Logo.png'
import './Header.css'

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a href="/org-chart-app/" className="site-logo" aria-label="Vinsinfo Home">
          <img src={logoSrc} alt="Vinsinfo" className="site-logo-img" />
        </a>
        <nav className="site-nav">
          <span className="site-nav-label">Career Growth Path</span>
        </nav>
      </div>
    </header>
  )
}
