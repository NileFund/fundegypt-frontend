import { Link } from 'react-router-dom';
import { APP_NAME, ROUTES } from '../../../utils/constants';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative glass-shine text-white pt-8 pb-4 px-6 overflow-hidden border-t border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

          {/* Brand Column */}
          <div className="space-y-6">
            <Link
              to={ROUTES.HOME}
              className="text-2xl font-bold tracking-tight bg-linear-to-r from-brand-mint to-brand-success bg-clip-text text-transparent"
            >
              {APP_NAME}
            </Link>
            <p className="text-gray-300 leading-relaxed max-w-xs mt-2">
              Empowering local initiatives through transparent community crowdfunding. Join us in making a difference across Egypt.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-brand-mint">Explore</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link to={ROUTES.EXPLORE} className="hover:text-brand-mint transition-colors duration-200 flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-brand-primary transition-all duration-200 group-hover:w-2"></span>
                  Browse Projects
                </Link>
              </li>
              <li>
                <Link to={ROUTES.CATEGORY} className="hover:text-brand-mint transition-colors duration-200 flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-brand-primary transition-all duration-200 group-hover:w-2"></span>
                  Categories
                </Link>
              </li>
              <li>
                <Link to={ROUTES.CREATE_PROJECT} className="hover:text-brand-mint transition-colors duration-200 flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-brand-primary transition-all duration-200 group-hover:w-2"></span>
                  Start a Campaign
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-brand-mint">Contact Us</h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-brand-primary shrink-0" />
                <span>Cairo, Egypt</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-brand-primary shrink-0" />
                <a href="mailto:info@fundegypt.com" className="hover:text-brand-mint transition-colors">info@fundegypt.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-brand-primary shrink-0" />
                <a href="tel:+20 155 345 1889" className="hover:text-brand-mint transition-colors">+20 155 345 1889</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© {currentYear} {APP_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;