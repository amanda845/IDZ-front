'use client'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Dashboard() {
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth/sign-in')
      return
    }

    const { data } = await supabase
      .from('reservations')
      .select(`
        *,
        cars (
          brand,
          model,
          price_per_day
        )
      `)
      .order('created_at', { ascending: false })
    
    setReservations(data || [])
    setLoading(false)
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-xl animate-pulse">Chargement de vos réservations...</div>
    </div>
  )

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-12 gap-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Mes Réservations
        </h1>
        <Link 
          href="/new-reservation"
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
        >
          + Nouvelle Réservation
        </Link>
      </div>

      {reservations.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-2xl p-12">
          <div className="text-6xl mb-6">📭</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Aucune réservation</h3>
          <p className="text-gray-600 mb-8">Commencez par réserver une voiture</p>
          <Link 
            href="/" 
            className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Voir les voitures disponibles
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {reservations.map((reservation) => {
            const totalDays = new Date(reservation.end_date).getTime() - new Date(reservation.start_date).getTime()
            const totalPrice = (totalDays / (1000 * 3600 * 24) + 1) * reservation.cars.price_per_day
            
            return (
              <div key={reservation.id} className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all border-l-8 border-blue-500">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl">🚗</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          {reservation.cars.brand} {reservation.cars.model}
                        </h3>
                        <p className="text-gray-600">
                          {reservation.start_date} → {reservation.end_date}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        reservation.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : reservation.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {reservation.status === 'pending' && '⏳ En attente'}
                        {reservation.status === 'confirmed' && '✅ Confirmée'}
                        {reservation.status === 'cancelled' && '❌ Annulée'}
                      </span>
                    </div>

                    {reservation.permit_file_path && (
                      <a 
                        href={reservation.permit_file_path} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                      >
                        📸 Voir photo permis
                      </a>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-800">
                      {totalPrice.toLocaleString()} DA
                    </div>
                    <div className="text-sm text-gray-500">Total</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
