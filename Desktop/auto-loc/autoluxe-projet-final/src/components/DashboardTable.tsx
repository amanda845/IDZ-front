import { Reservation } from '../types'
import { Calendar, Car, Clock, XCircle } from 'lucide-react'

interface DashboardTableProps {
  reservations: Reservation[]
  onCancel?: (id: string) => void
  cancelling?: string | null
}

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  confirmed: 'bg-green-500/15 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/15 text-red-400 border-red-500/20',
  completed: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
}

export default function DashboardTable({ reservations, onCancel, cancelling }: DashboardTableProps) {
  if (reservations.length === 0) {
    return (
      <div className="card-dark p-16 text-center">
        <Car className="w-10 h-10 text-white/20 mx-auto mb-4" />
        <p className="text-white/40 text-lg">No reservations yet</p>
        <p className="text-white/25 text-sm mt-1">Your bookings will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reservations.map(res => (
        <div key={res.id} className="card-dark p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:border-accent/20 transition-all">
          {/* Vehicle image */}
          <div className="w-28 h-20 rounded-xl bg-bg-card2 overflow-hidden flex-shrink-0">
            <img
              src={res.vehicle?.image_url || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=300&q=70'}
              alt={res.vehicle?.model}
              className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=300&q=70' }}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <p className="text-white font-semibold">
                  {res.vehicle?.brand} {res.vehicle?.model}
                </p>
                <p className="text-white/40 text-sm">{res.vehicle?.category}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusColor[res.status] || statusColor.pending}`}>
                {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/40">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-accent" />
                {new Date(res.start_date).toLocaleDateString()}
              </span>
              <span className="text-white/20">→</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-accent" />
                {new Date(res.end_date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5 ml-auto">
                <Clock className="w-3.5 h-3.5" />
                Booked {new Date(res.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Cancel button */}
          {onCancel && res.status === 'pending' && (
            <button
              onClick={() => onCancel(res.id)}
              disabled={cancelling === res.id}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-400/40 rounded-lg px-3 py-2 transition-all flex-shrink-0 disabled:opacity-50"
            >
              <XCircle className="w-3.5 h-3.5" />
              {cancelling === res.id ? 'Cancelling...' : 'Cancel'}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
