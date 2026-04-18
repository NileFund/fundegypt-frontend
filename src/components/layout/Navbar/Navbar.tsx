import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES, APP_NAME } from '../../../utils/constants'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isLoggedIn = !!localStorage.getItem('access_token')

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="sticky top-0 z-50 glass-shine text-white transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link
            to={ROUTES.HOME}
            className="text-2xl font-bold tracking-tight bg-linear-to-r from-brand-mint to-brand-success bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
          >
            {APP_NAME}
          </Link>

          {isLoggedIn ? (
            <>
              <div className="hidden md:flex items-center gap-8">
                <Link to={ROUTES.EXPLORE} className="relative font-medium group transition-all duration-300 hover:text-brand-mint">
                  Explore
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link to={ROUTES.CATEGORY} className="relative font-medium group transition-all duration-300 hover:text-brand-mint">
                  Categories
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link to={ROUTES.CREATE_PROJECT} className="relative font-medium group transition-all duration-300 hover:text-brand-mint">
                  Start Campaign
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>

              <div className="hidden md:flex items-center gap-6">
                <Link to={ROUTES.PROFILE} className="font-medium hover:text-brand-mint transition-colors">Profile</Link>
                <button
                  onClick={() => { localStorage.clear(); window.location.href = ROUTES.HOME }}
                  className="bg-brand-primary hover:bg-brand-success text-white px-6 py-2 rounded-full font-semibold shadow-md transition-all active:scale-95"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to={ROUTES.CREATE_PROJECT}
                className="bg-brand-primary hover:bg-brand-success text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg transition-all active:scale-95 btn-3d"
              >
                Start a fundraiser
              </Link>
              <button
                onClick={() => navigate(ROUTES.LOGIN)}
                className="hidden md:block font-bold text-sm hover:text-brand-mint transition-colors"
              >
                Login
              </button>
            </div>
          )}

          {isLoggedIn && (
            <div className="md:hidden flex items-center">
              <button onClick={toggleMenu} className="p-2 rounded-md hover:bg-brand-primary/20 transition-colors">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          )}
        </div>

        {isLoggedIn && isMenuOpen && (
          <div className="md:hidden mt-4 pb-6 transition-all duration-500">
            <div className="flex flex-col gap-4">
              <Link to={ROUTES.EXPLORE} className="text-lg font-medium hover:text-brand-mint py-2 border-b border-white/10" onClick={() => setIsMenuOpen(false)}>Explore</Link>
              <Link to={ROUTES.CATEGORY} className="text-lg font-medium hover:text-brand-mint py-2 border-b border-white/10" onClick={() => setIsMenuOpen(false)}>Categories</Link>
              <Link to={ROUTES.CREATE_PROJECT} className="text-lg font-medium hover:text-brand-mint py-2 border-b border-white/10" onClick={() => setIsMenuOpen(false)}>Start Campaign</Link>
              <button
                onClick={() => { localStorage.clear(); window.location.href = ROUTES.HOME }}
                className="bg-brand-primary text-white py-3 rounded-xl font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
