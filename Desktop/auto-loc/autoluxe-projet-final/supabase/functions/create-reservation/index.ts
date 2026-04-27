// supabase/functions/create-reservation/index.ts
// Deploy with: supabase functions deploy create-reservation

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get the user from the token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { vehicle_id, start_date, end_date, license_url } = await req.json()

    // Validate inputs
    if (!vehicle_id || !start_date || !end_date) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (new Date(end_date) <= new Date(start_date)) {
      return new Response(JSON.stringify({ error: 'Return date must be after pickup date' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check vehicle exists and is available
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select('id, available')
      .eq('id', vehicle_id)
      .single()

    if (vehicleError || !vehicle) {
      return new Response(JSON.stringify({ error: 'Vehicle not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (!vehicle.available) {
      return new Response(JSON.stringify({ error: 'Vehicle is not available' }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check for date conflicts
    const { data: conflicts } = await supabase
      .from('reservations')
      .select('id')
      .eq('vehicle_id', vehicle_id)
      .not('status', 'eq', 'cancelled')
      .lte('start_date', end_date)
      .gte('end_date', start_date)

    if (conflicts && conflicts.length > 0) {
      return new Response(JSON.stringify({ error: 'Vehicle already booked for these dates' }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Insert reservation
    const { data: reservation, error: insertError } = await supabase
      .from('reservations')
      .insert({
        user_id: user.id,
        vehicle_id,
        start_date,
        end_date,
        license_url: license_url || null,
        status: 'pending',
      })
      .select()
      .single()

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ success: true, reservation }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
