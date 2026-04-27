import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Reservation, Profile } from '../types'
import Navbar from '../components/Navbar'
import DashboardTable from '../components/DashboardTable'
import Footer from '../components/Footer'
import { User, Car, Calendar, Plus } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState<string | null>(null)

  useEffect(() => {
    if (user) { fetchData() }
  }, [user])

  const fetchData = async () => {
    if (!user) return
    const [profileRes, resRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('reservations').select('*, vehicle:vehicles(*)').eq('user_id', user.id).order('created_at', { ascending: false }),
    ])
    if (profileRes.data) setProfile(profileRes.data)
    if (resRes.data) setReservations(resRes.data as Reservation[])
    setLoading(false)
  }

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return
    setCancelling(id)
    const { error } = await supabase.from('reservations').update({ status: 'cancelled' }).eq('id', id)
    if (!error) {
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r))
    }
    setCancelling(null)
  }

  const pending = reservations.filter(r => r.status === 'pending').length
  const confirmed = reservations.filter(r => r.status === 'confirmed').length

  if (loading) return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/20 flex items-center justify-center">
                <User className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {profile?.full_name || 'My Dashboard'}
                </h1>
                <p className="text-white/40 text-sm">{user?.email}</p>
              </div>
            </div>
            <Link to="/vehicles" className="btn-accent flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> New Reservation
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { icon: Calendar, label: 'Total Reservations', value: reservations.length },
              { icon: Car, label: 'Pending', value: pending },
              { icon: Car, label: 'Confirmed', value: confirmed },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="card-dark p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-white/40 text-xs">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Reservations */}
          <h2 className="text-lg font-semibold text-white mb-4">Your Reservations</h2>
          <DashboardTable reservations={reservations} onCancel={handleCancel} cancelling={cancelling} />
        </div>
      </div>
      <Footer />
    </div>
  )
}
