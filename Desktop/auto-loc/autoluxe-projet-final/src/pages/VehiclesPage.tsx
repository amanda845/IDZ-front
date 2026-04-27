import Navbar from '../components/Navbar'
import VehicleGrid from '../components/VehicleGrid'
import Footer from '../components/Footer'

export default function VehiclesPage() {
  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="font-display text-6xl text-white mb-2">Our Fleet</h1>
            <p className="text-white/40">Browse and reserve world-class luxury vehicles</p>
          </div>
          <VehicleGrid showSearch={true} />
        </div>
      </div>
      <Footer />
    </div>
  )
}
