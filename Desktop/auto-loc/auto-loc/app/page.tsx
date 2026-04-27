'use client'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const [cars, setCars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    const { data } = await supabase.from('cars').select('*').eq('available', true)
    setCars(data || [])
    setLoading(false)
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-xl">Chargement des voitures...</div>
    </div>
  )

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Location de Voitures</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Réservez votre véhicule en quelques clics. Authentification sécurisée, 
          tableau de bord personnel, upload photo permis obligatoire.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cars.map((car) => (
          <div key={car.id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
            <div className="h-64 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-6xl opacity-20">🚗</span>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{car.brand} {car.model}</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">{car.price_per_day} DA/jour</div>
              <Link
                href={`/new-reservation?carId=${car.id}`}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all block text-center"
              >
                Réserver maintenant
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {cars.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 mb-8">Aucune voiture disponible pour le moment</p>
          <Link href="/dashboard" className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700">
            Voir mes réservations
          </Link>
        </div>
      )}
    </div>
  )
}
