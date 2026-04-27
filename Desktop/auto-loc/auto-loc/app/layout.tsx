import './globals.css'
import { createServerComponentClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })

  return (
    <html lang="fr">
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white shadow-lg">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <a href="/" className="text-2xl font-bold hover:opacity-90">🚗 Auto-Loc</a>
            <div className="space-x-4">
              <a href="/dashboard" className="hover:underline">Dashboard</a>
              <a href="/auth/sign-in" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100">Connexion</a>
            </div>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto p-8">
          {children}
        </main>
      </body>
    </html>
  )
}
