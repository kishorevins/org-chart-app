// import { NavLink } from 'react-router-dom'
import logoSrc from '../assets/logo(2).png'
import './Header.css'

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a href="/" className="site-logo" aria-label="Vinsinfo Home">
          <img src={logoSrc} alt="Vinsinfo" className="site-logo-img" />
        </a>
        {/* <nav className="site-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => 'site-nav-link' + (isActive ? ' active' : '')}
          >
            Top-Down View
          </NavLink>
          <NavLink
            to="/upward"
            className={({ isActive }) => 'site-nav-link' + (isActive ? ' active' : '')}
          >
            Bottom-Up View
          </NavLink>
          <NavLink
            to="/pyramid"
            className={({ isActive }) => 'site-nav-link' + (isActive ? ' active' : '')}
          >
            Pyramid View
          </NavLink>
          <NavLink
            to="/roadmap"
            className={({ isActive }) => 'site-nav-link' + (isActive ? ' active' : '')}
          >
            Roadmap View
          </NavLink>
        </nav> */}
      </div>
    </header>
  )
}
