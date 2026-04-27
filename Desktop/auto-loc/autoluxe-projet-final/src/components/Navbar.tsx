import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Menu, X, Zap } from 'lucide-react'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setOpen(false)
  }

  const isActive = (path: string) => location.pathname === path

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Vehicles', path: '/vehicles' },
    ...(user ? [{ label: 'Dashboard', path: '/dashboard' }] : []),
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-base/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center group-hover:shadow-neon transition-all">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="font-display text-xl tracking-widest text-white">AUTOLUXE</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <Link
                key={l.path}
                to={l.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(l.path) ? 'text-accent' : 'text-white/60 hover:text-white'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <button onClick={handleSignOut} className="btn-outline text-sm py-2 px-5">
                Sign Out
              </button>
            ) : (
              <>
                <Link to="/login" className="text-sm text-white/60 hover:text-white transition-colors font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-accent text-sm py-2 px-5">
                  Register Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white/60 hover:text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-bg-card border-t border-white/5 px-4 py-4 flex flex-col gap-4">
          {links.map(l => (
            <Link
              key={l.path}
              to={l.path}
              onClick={() => setOpen(false)}
              className={`text-sm font-medium ${isActive(l.path) ? 'text-accent' : 'text-white/70'}`}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <button onClick={handleSignOut} className="btn-outline text-sm py-2">Sign Out</button>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="text-sm text-white/70">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-accent text-sm py-2 text-center">Register Now</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
