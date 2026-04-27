import { Download, Route, Heart } from 'lucide-react'

const stats = [
  { icon: Download, value: '4 Million+', label: 'App Downloads' },
  { icon: Route, value: '20 Million+', label: 'Trips/Rent Served' },
  { icon: Heart, value: '6 Million+', label: 'Lives Impacted' },
]

export default function StatsSection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-bg-card rounded-3xl border border-white/5 p-10 grid grid-cols-1 sm:grid-cols-3 gap-10">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Icon className="w-7 h-7 text-accent" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-display text-5xl text-white tracking-wide">{value}</p>
                <p className="text-white/40 text-sm mt-1">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
