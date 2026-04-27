export interface Profile {
  id: string
  full_name: string
  phone: string | null
  created_at: string
}

export interface Vehicle {
  id: string
  brand: string
  model: string
  category: string | null
  year: number | null
  price_per_day: number
  available: boolean
  image_url: string | null
  created_at: string
}

export interface Reservation {
  id: string
  user_id: string
  vehicle_id: string
  start_date: string
  end_date: string
  status: string
  license_url: string | null
  created_at: string
  vehicle?: Vehicle
}

export type VehicleCategory = 'All' | 'Luxury' | 'Coupe' | 'Supercar' | 'Hypercar' | 'SUV'
