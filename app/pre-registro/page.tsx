'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ChevronRight, Store, User, Mail, Phone } from 'lucide-react'
import Image from 'next/image'
import { submitWaitlist } from './actions'

export default function PreRegistroPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await submitWaitlist(formData)

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else if (result.success) {
      setIsSuccess(true)
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-card max-w-md w-full rounded-3xl shadow-xl shadow-primary/5 border border-border p-8 md:p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">¡Gracias por tu interés!</h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Te has registrado exitosamente en nuestra lista de espera. Te notificaremos tan pronto como Directo esté disponible para tu restaurante.
          </p>

          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
          >
            Volver al inicio
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Decorative Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden flex-col justify-between p-12 text-primary-foreground">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/40"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <Image
              src="/logotipo.svg"
              alt="Directo Logo"
              width={220}
              height={64}
              className="brightness-0 invert"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-[1.1]">
              El futuro de tu restaurante comienza aquí.
            </h1>
            <p className="text-primary-foreground/80 text-xl max-w-md leading-relaxed font-light">
              Únete a la lista de espera exclusiva y sé de los primeros en automatizar tus ventas, reservas y atención al cliente con Inteligencia Artificial.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 flex gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <p className="text-3xl font-black mb-1">+50</p>
            <p className="text-sm text-primary-foreground/70 font-medium">Restaurantes esperando</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <p className="text-3xl font-black mb-1">24/7</p>
            <p className="text-sm text-primary-foreground/70 font-medium">Atención automatizada</p>
          </div>
        </div>
      </div>

      {/* Form Right Side */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-20 relative min-h-[100dvh] lg:min-h-0">
        <div className="w-full max-w-md flex flex-col">
          <div className="mb-12 lg:hidden">
            <Image
              src="/logotipo.svg"
              alt="Directo Logo"
              width={160}
              height={48}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-foreground mb-3 font-heading">Únete a la espera</h2>
              <p className="text-muted-foreground text-lg">Completa tus datos para recibir acceso anticipado y ofertas exclusivas de lanzamiento.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">!</div>
                  <p>{error}</p>
                </motion.div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <label htmlFor="name" className="text-sm font-bold text-slate-700 mb-1 block">Nombre completo</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="Ej. Juan Pérez"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="email" className="text-sm font-bold text-slate-700 mb-1 block">Correo electrónico</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="juan@ejemplo.com"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="phone" className="text-sm font-bold text-slate-700 mb-1 block">Número de teléfono <span className="text-slate-400 font-normal">(Opcional)</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="+57 300 000 0000"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="restaurant_name" className="text-sm font-bold text-slate-700 mb-1 block">Nombre del restaurante <span className="text-slate-400 font-normal">(Opcional)</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Store className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      id="restaurant_name"
                      name="restaurant_name"
                      placeholder="Ej. El Buen Sabor"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 mt-6 shadow-lg shadow-primary/25 hover:shadow-primary/40 group"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  <>
                    Inscribirme a la lista
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-slate-500 mt-6 px-4">
                Al registrarte aceptas nuestros <a href="/terms" className="text-primary hover:underline">Términos</a> y <a href="/privacy" className="text-primary hover:underline">Políticas de Privacidad</a>.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
