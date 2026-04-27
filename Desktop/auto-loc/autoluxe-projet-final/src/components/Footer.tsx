import { Link } from 'react-router-dom'
import { Zap, Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-bg-card border-t border-white/5 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Zap className="w-4 h-4 text-black" />
              </div>
              <span className="font-display text-xl tracking-widest text-white">AUTOLUXE</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Experience the pinnacle of automotive luxury. World-class vehicles, seamless booking, unforgettable journeys.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-accent hover:text-accent transition-all">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <div className="flex flex-col gap-3">
              {[['Home', '/'], ['Vehicles', '/vehicles'], ['Dashboard', '/dashboard'], ['Register', '/register']].map(([label, path]) => (
                <Link key={path} to={path} className="text-sm text-white/40 hover:text-accent transition-colors">{label}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-white/40">
                <Mail className="w-4 h-4 text-accent" />
                contact@autoluxe.com
              </div>
              <div className="flex items-center gap-2 text-sm text-white/40">
                <Phone className="w-4 h-4 text-accent" />
                +1 (555) 000-0000
              </div>
              <div className="flex items-center gap-2 text-sm text-white/40">
                <MapPin className="w-4 h-4 text-accent" />
                Beverly Hills, CA
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">© 2025 Autoluxe. All rights reserved.</p>
          <p className="text-white/20 text-xs">Built with precision and passion.</p>
        </div>
      </div>
    </footer>
  )
}
