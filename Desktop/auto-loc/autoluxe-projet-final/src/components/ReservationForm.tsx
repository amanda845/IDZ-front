import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Vehicle } from '../types'
import { Calendar, Upload, CheckCircle2, AlertCircle } from 'lucide-react'

interface ReservationFormProps {
  vehicle: Vehicle
}

export default function ReservationForm({ vehicle }: ReservationFormProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [licenseFile, setLicenseFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const totalDays = startDate && endDate
    ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000))
    : 0
  const totalPrice = totalDays * vehicle.price_per_day

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB')
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type)) {
      setError('Only JPG, PNG, WEBP, or PDF files are allowed')
      return
    }
    setLicenseFile(file)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    if (!startDate || !endDate) { setError('Please select pickup and return dates'); return }
    if (new Date(endDate) <= new Date(startDate)) { setError('Return date must be after pickup date'); return }
    if (!licenseFile) { setError("Please upload your driver's license"); return }

    setLoading(true)
    setError('')

    try {
      // Upload license
      const ext = licenseFile.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('licenses')
        .upload(fileName, licenseFile, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('licenses').getPublicUrl(fileName)

      // Check for conflicts
      const { data: conflicts } = await supabase
        .from('reservations')
        .select('id')
        .eq('vehicle_id', vehicle.id)
        .not('status', 'eq', 'cancelled')
        .lte('start_date', endDate)
        .gte('end_date', startDate)

      if (conflicts && conflicts.length > 0) {
        setError('This vehicle is already booked for the selected dates. Please choose different dates.')
        setLoading(false)
        return
      }

      // Insert reservation
      const { error: resError } = await supabase.from('reservations').insert({
        user_id: user.id,
        vehicle_id: vehicle.id,
        start_date: startDate,
        end_date: endDate,
        license_url: publicUrl,
        status: 'pending',
      })

      if (resError) throw resError

      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="card-dark p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Reservation Confirmed!</h3>
        <p className="text-white/40 text-sm">Redirecting to your dashboard...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card-dark p-6 space-y-5">
      <h3 className="text-lg font-semibold text-white">Complete Your Reservation</h3>

      {error && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/40 font-medium block mb-1.5">
            <Calendar className="w-3.5 h-3.5 inline mr-1" />Pickup Date
          </label>
          <input
            type="date"
            value={startDate}
            min={today}
            onChange={e => setStartDate(e.target.value)}
            className="input-dark"
            required
          />
        </div>
        <div>
          <label className="text-xs text-white/40 font-medium block mb-1.5">
            <Calendar className="w-3.5 h-3.5 inline mr-1" />Return Date
          </label>
          <input
            type="date"
            value={endDate}
            min={startDate || today}
            onChange={e => setEndDate(e.target.value)}
            className="input-dark"
            required
          />
        </div>
      </div>

      {/* License upload */}
      <div>
        <label className="text-xs text-white/40 font-medium block mb-1.5">
          Driver's License (JPG, PNG, PDF — max 5MB)
        </label>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-accent/40 rounded-xl p-8 cursor-pointer transition-all group">
          <Upload className="w-8 h-8 text-white/20 group-hover:text-accent mb-2 transition-colors" />
          {licenseFile ? (
            <p className="text-accent text-sm font-medium">{licenseFile.name}</p>
          ) : (
            <p className="text-white/30 text-sm">Click to upload your license</p>
          )}
          <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileChange} />
        </label>
      </div>

      {/* Price summary */}
      {totalDays > 0 && (
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
          <div className="flex justify-between text-sm text-white/60 mb-1">
            <span>${vehicle.price_per_day}/day × {totalDays} day{totalDays > 1 ? 's' : ''}</span>
            <span className="text-accent font-bold text-base">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-accent w-full disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            Processing...
          </span>
        ) : 'Confirm Reservation'}
      </button>
    </form>
  )
}
