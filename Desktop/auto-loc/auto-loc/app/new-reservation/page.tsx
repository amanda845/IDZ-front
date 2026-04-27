'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase'
import Link from 'next/link'

export default function NewReservation() {
  const searchParams = useSearchParams()
  const carId = searchParams.get('carId')
  const [car, setCar] = useState<any>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    if (carId) fetchCar()
  }, [carId])

  const fetchCar = async () => {
    const { data } = await supabase.from('cars').select('*').eq('id', carId!).single()
    if (data) {
      setCar(data)
      // Set default dates to tomorrow for 3 days
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const inThreeDays = new Date()
      inThreeDays.setDate(inThreeDays.getDate() + 4)
      setStartDate(tomorrow.toISOString().split('T')[0])
      setEndDate(inThreeDays.toISOString().split('T')[0])
    }
    setLoading(false)
  }

  const handleFileUpload = async (selectedFile: File) => {
    const fileExt = selectedFile.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('permis')
      .upload(`public/${fileName}`, selectedFile, { upsert: true })

    if (uploadError) throw uploadError

    const { data: publicUrl } = supabase.storage
      .from('permis')
      .getPublicUrl(`public/${fileName}`)

    return publicUrl.data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!car || !startDate || !endDate || !file) {
      alert('Tous les champs sont obligatoires')
      return
    }

    setSubmitLoading(true)
    try {
      const permitUrl = await handleFileUpload(file)
      
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Vous devez être connecté')
        return
      }

      const { error } = await supabase
        .from('reservations')
        .insert({
          car_id: car.id,
          client_id: session.user.id,
          start_date: startDate,
          end_date: endDate,
          permit_file_path: permitUrl
        })

      if (error) throw error

      alert('Réservation créée avec succès!')
      router.push('/dashboard')
    } catch (error: any) {
      alert('Erreur: ' + error.message)
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="text-2xl animate-pulse">Chargement du véhicule...</div>
    </div>
  )

  if (!car) return (
    <div className="text-center py-20">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Véhicule non trouvé</h2>
      <Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-xl">
        ← Retour aux voitures
      </Link>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-12 mb-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
            <span className="text-3xl">🚗</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Réserver
            </h1>
            <p className="text-2xl font-semibold text-gray-700 mt-2">
              {car.brand} {car.model}
            </p>
            <div className="text-3xl font-bold text-green-600 mt-2">
              {car.price_per_day} DA / jour
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date de début *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date de fin *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Photo du permis de conduire * (Obligatoire)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept="image/*"
                className="hidden"
                id="file-upload"
                required
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {file ? (
                  <div className="space-y-2">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl mx-auto flex items-center justify-center">
                      <span className="text-2xl">✅</span>
                    </div>
                    <p className="text-green-700 font-medium">{file.name}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto flex items-center justify-center">
                      <span className="text-2xl">📸</span>
                    </div>
                    <p className="text-gray-500">Cliquez pour sélectionner votre photo</p>
                    <p className="text-xs text-gray-400">JPG, PNG (max 5MB)</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex-1 bg-gray-100 text-gray-800 py-4 px-8 rounded-2xl font-semibold hover:bg-gray-200 transition-colors text-lg"
            >
              ← Annuler
            </button>
            <button
              type="submit"
              disabled={submitLoading || !file || !startDate || !endDate}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-8 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Création...
                </>
              ) : (
                'Confirmer Réservation'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
