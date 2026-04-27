import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import VehicleCard from './VehicleCard'
import { Vehicle, VehicleCategory } from '../types'
import { Search } from 'lucide-react'

const CATEGORIES: VehicleCategory[] = ['All', 'Luxury', 'Coupe', 'Supercar', 'Hypercar', 'SUV']

interface VehicleGridProps {
  showSearch?: boolean
  limit?: number
}

export default function VehicleGrid({ showSearch = true, limit }: VehicleGridProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<VehicleCategory>('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) setVehicles(data)
    setLoading(false)
  }

  const filtered = vehicles
    .filter(v => category === 'All' || v.category === category)
    .filter(v => {
      if (!search) return true
      const q = search.toLowerCase()
      return v.brand.toLowerCase().includes(q) || v.model.toLowerCase().includes(q)
    })
    .slice(0, limit)

  return (
    <div>
      {/* Category filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
              category === cat
                ? 'bg-accent text-black border-accent shadow-neon'
                : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}

        {showSearch && (
          <div className="relative ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-bg-card2 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent/50 w-48"
            />
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card-dark h-72 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <p className="text-lg">No vehicles found</p>
          <p className="text-sm mt-1">Try a different category or search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(v => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      )}
    </div>
  )
}
