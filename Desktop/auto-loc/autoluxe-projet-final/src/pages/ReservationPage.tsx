import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Vehicle } from '../types'
import Navbar from '../components/Navbar'
import ReservationForm from '../components/ReservationForm'
import Footer from '../components/Footer'
import { ArrowLeft } from 'lucide-react'

export default function ReservationPage() {
  const { vehicleId } = useParams<{ vehicleId: string }>()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!vehicleId) { navigate('/vehicles'); return }
    fetchVehicle()
  }, [vehicleId])

  const fetchVehicle = async () => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', vehicleId)
      .single()

    if (error || !data) { navigate('/vehicles'); return }
    setVehicle(data)
    setLoading(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!vehicle) return null

  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/vehicles" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to vehicles
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Vehicle info */}
            <div>
              <div className="card-dark overflow-hidden mb-6">
                <div className="h-56 bg-bg-card2 overflow-hidden">
                  <img
                    src={vehicle.image_url || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=700&q=80'}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=700&q=80' }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white/40 text-sm">{vehicle.brand}</p>
                      <h2 className="text-2xl font-bold text-white">{vehicle.model}</h2>
                      {vehicle.category && (
                        <span className="inline-block mt-1 text-xs font-semibold bg-accent/15 text-accent border border-accent/20 rounded-full px-2.5 py-0.5">
                          {vehicle.category}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-accent">${vehicle.price_per_day}</p>
                      <p className="text-white/30 text-xs">per day</p>
                    </div>
                  </div>
                  {vehicle.year && <p className="text-white/30 text-sm mt-3">Year: {vehicle.year}</p>}
                </div>
              </div>
            </div>

            {/* Reservation form */}
            <ReservationForm vehicle={vehicle} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
