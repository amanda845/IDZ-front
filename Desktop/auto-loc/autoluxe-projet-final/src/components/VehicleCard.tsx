import { Link } from 'react-router-dom'
import { ArrowUpRight, Shield } from 'lucide-react'
import { Vehicle } from '../types'

interface VehicleCardProps {
  vehicle: Vehicle
  showReserve?: boolean
}

const PLACEHOLDER = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&q=80'

export default function VehicleCard({ vehicle, showReserve = true }: VehicleCardProps) {
  return (
    <div className="card-dark overflow-hidden group hover:border-accent/30 transition-all duration-300 hover:shadow-neon">
      {/* Image */}
      <div className="relative h-44 bg-bg-card2 overflow-hidden">
        <img
          src={vehicle.image_url || PLACEHOLDER}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent" />
        {vehicle.category && (
          <span className="absolute top-3 right-3 text-xs font-semibold bg-accent/20 text-accent border border-accent/30 rounded-full px-2.5 py-0.5">
            {vehicle.category}
          </span>
        )}
        {!vehicle.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white/80 text-sm font-semibold">Unavailable</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-bg-card2 border border-white/10 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-white/40">{vehicle.brand}</p>
              <p className="text-sm font-semibold text-white leading-tight">{vehicle.model}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-accent font-bold text-lg">${vehicle.price_per_day}</p>
            <p className="text-white/30 text-xs">/day</p>
          </div>
        </div>

        {showReserve && vehicle.available && (
          <Link
            to={`/reserve/${vehicle.id}`}
            className="flex items-center justify-between w-full mt-4 bg-accent/10 hover:bg-accent text-accent hover:text-black rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 group/btn"
          >
            Reserve Now
            <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  )
}
