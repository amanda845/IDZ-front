import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import StatsSection from '../components/StatsSection'
import VehicleGrid from '../components/VehicleGrid'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />
      <HeroSection />
      <StatsSection />

      {/* Fleet section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display text-5xl text-white">Our Vehicle Fleet</h2>
            </div>
            <p className="text-white/30 text-sm max-w-xs text-right leading-relaxed hidden sm:block">
              We provide our customers with the most incredible driving emotions. Only world-class cars in our fleet.
            </p>
          </div>
          <VehicleGrid limit={6} showSearch={false} />
          <div className="text-center mt-10">
            <Link to="/vehicles" className="btn-outline inline-flex items-center gap-2">
              Explore More Vehicles
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
