import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Zap, Mail, Lock, User, Phone, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !email || !password) { setError('Please fill all required fields'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }

    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signUp({ email, password })
    if (authError) { setError(authError.message); setLoading(false); return }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
        phone: phone || null,
      })
      if (profileError) { setError(profileError.message); setLoading(false); return }
    }

    setSuccess(true)
    setLoading(false)
    setTimeout(() => navigate('/login'), 2500)
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-10">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-neon">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <span className="font-display text-2xl tracking-widest text-white">AUTOLUXE</span>
        </Link>

        <div className="card-dark p-8">
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Account Created!</h2>
              <p className="text-white/40 text-sm">Redirecting to login...</p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
              <p className="text-white/40 text-sm mb-8">Join the Autoluxe experience</p>

              {error && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm mb-6">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 font-medium block mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="input-dark pl-10" placeholder="John Doe" required />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/40 font-medium block mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="input-dark pl-10" placeholder="+1 555 000 0000" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/40 font-medium block mb-1.5">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-dark pl-10" placeholder="you@example.com" required />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/40 font-medium block mb-1.5">Password * (min 6 chars)</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-dark pl-10" placeholder="••••••••" required />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-accent w-full mt-2 disabled:opacity-50">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : 'Create Account'}
                </button>
              </form>

              <p className="text-center text-white/30 text-sm mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-accent font-medium hover:underline">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
