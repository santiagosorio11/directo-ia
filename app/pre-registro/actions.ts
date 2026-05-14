'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitWaitlist(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const restaurant_name = formData.get('restaurant_name') as string

  if (!name || !email) {
    return { error: 'Nombre y correo electrónico son requeridos.' }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('waitlist_leads')
    .insert([
      {
        name,
        email,
        phone,
        restaurant_name,
      },
    ])

  if (error) {
    if (error.code === '23505') {
      return { error: 'Este correo electrónico ya está registrado en la lista de espera.' }
    }
    console.error('Error insertando en waitlist:', error)
    return { error: 'Ocurrió un error al procesar tu solicitud. Intenta de nuevo.' }
  }

  revalidatePath('/pre-registro')
  return { success: true }
}
