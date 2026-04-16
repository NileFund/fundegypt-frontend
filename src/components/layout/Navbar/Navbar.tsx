import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES, APP_NAME } from '../../../utils/constants';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="sticky top-0 z-50 glass-shine text-white shadow-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo with Gradient */}
          <Link
            to={ROUTES.HOME}
            className="text-2xl font-bold tracking-tight bg-gradient-to-r from-brand-mint to-brand-success bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
          >
            {APP_NAME}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to={ROUTES.EXPLORE}
              className="relative font-medium group transition-all duration-300 hover:text-brand-mint"
            >
              Explore
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to={ROUTES.CATEGORY}
              className="relative font-medium group transition-all duration-300 hover:text-brand-mint"
            >
              Categories
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to={ROUTES.CREATE_PROJECT}
              className="relative font-medium group transition-all duration-300 hover:text-brand-mint"
            >
              Start Campaign
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Desktop Auth Links */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="font-medium hover:text-brand-mint transition-colors duration-300"
            >
              Login
            </button>
            <Link
              to={ROUTES.REGISTER}
              className="bg-brand-primary hover:bg-brand-success text-white px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-brand-primary/20 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="flex flex-col gap-4 pb-6">
            <Link
              to={ROUTES.EXPLORE}
              className="text-lg font-medium hover:text-brand-mint transition-colors border-b border-white/10 pb-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              to={ROUTES.CATEGORY}
              className="text-lg font-medium hover:text-brand-mint transition-colors border-b border-white/10 pb-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              to={ROUTES.CREATE_PROJECT}
              className="text-lg font-medium hover:text-brand-mint transition-colors border-b border-white/10 pb-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Start Campaign
            </Link>
            <div className="flex flex-col gap-4 mt-2">
              <button
                onClick={() => { navigate(ROUTES.LOGIN); setIsMenuOpen(false); }}
                className="text-lg font-medium text-left hover:text-brand-mint transition-colors"
              >
                Login
              </button>
              <Link
                to={ROUTES.REGISTER}
                className="bg-brand-primary hover:bg-brand-success text-center text-white py-3 rounded-xl font-semibold transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;