import { Link } from 'react-router-dom'
import { MapPin, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col pt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-base via-bg-base to-[#0d1a00] z-0" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 pt-16 pb-8 flex-1">
        {/* Text */}
        <div className="flex-1 max-w-lg animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-6">
            <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
            <span className="text-accent text-xs font-semibold">Affordable, Reliable & Available</span>
          </div>
          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-none text-white mb-6">
            HAVING LUXURY CAR FOR EVERY JOURNEY
          </h1>
          <p className="text-white/40 text-base leading-relaxed mb-8">
            Experience the world's finest automobiles. From supercars to luxury SUVs — your perfect drive awaits.
          </p>

          {/* Brand icons row */}
          <div>
            <p className="text-white/30 text-xs mb-3">See category</p>
            <div className="flex items-center gap-2 flex-wrap">
              {['Bugatti', 'Ferrari', 'Mercedes', 'BMW'].map((brand, i) => (
                <span
                  key={brand}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    i === 0
                      ? 'bg-accent text-black border-accent shadow-neon'
                      : 'border-white/15 text-white/50 hover:border-accent hover:text-accent'
                  }`}
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Car image */}
        <div className="flex-1 relative animate-fade-in-up animate-delay-200">
          <div className="absolute inset-0 bg-accent/10 rounded-full blur-3xl scale-75" />
          <img
            src="https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&q=90"
            alt="Luxury Car"
            className="relative z-10 w-full max-w-2xl mx-auto object-contain drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 0 60px rgba(200,255,90,0.15))' }}
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16 animate-fade-in-up animate-delay-400">
        <div className="bg-bg-card/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          {/* Filter toggle */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-white/40 text-sm font-medium">Filter:</span>
            <button className="bg-accent text-black text-xs font-bold px-4 py-1.5 rounded-full">With Driver</button>
            <button className="border border-white/15 text-white/50 text-xs font-medium px-4 py-1.5 rounded-full hover:border-accent hover:text-accent transition-all">Without Driver</button>
            <div className="ml-auto flex items-center gap-2 text-white/40 text-sm">
              Round-Trip
              <div className="w-10 h-5 bg-accent rounded-full flex items-center justify-end px-0.5">
                <div className="w-4 h-4 bg-black rounded-full" />
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="lg:col-span-1">
              <label className="text-white/40 text-xs font-medium block mb-1.5">Departure</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input className="input-dark pl-9" placeholder="City, Place" />
              </div>
            </div>
            <div className="lg:col-span-1">
              <label className="text-white/40 text-xs font-medium block mb-1.5">Return Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input className="input-dark pl-9" placeholder="City, Place" />
              </div>
            </div>
            <div>
              <label className="text-white/40 text-xs font-medium block mb-1.5">Pick-Up Time</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input type="date" className="input-dark pl-9" />
              </div>
            </div>
            <div>
              <label className="text-white/40 text-xs font-medium block mb-1.5">Return Time</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input type="date" className="input-dark pl-9" />
              </div>
            </div>
            <Link to="/vehicles" className="btn-accent flex items-center justify-center gap-2 w-full">
              Book Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
