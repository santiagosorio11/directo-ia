"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  BarChart3, 
  MessageSquare, 
  Smartphone, 
  TrendingUp, 
  ShieldCheck,
  ChevronRight,
  TrendingDown,
  UserMinus
} from "lucide-react";
import { ChatSimulation } from "./components/ui/ChatSimulation";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-white selection:bg-[#FF5200]/30 overflow-x-hidden">
      {/* Navbar Minimalista */}
      <nav className="fixed top-0 w-full z-50 bg-[#09090B]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#FF5200] rounded-xl flex items-center justify-center font-bold text-xl">D</div>
            <span className="font-heading text-2xl font-extrabold tracking-tighter">DIRECTO</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#beneficios" className="hover:text-white transition-colors">Beneficios</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Cómo funciona</a>
            <a href="#precios" className="hover:text-white transition-colors">Precios</a>
          </div>
          <Link 
            href="/onboarding" 
            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-bold transition-all"
          >
            Iniciar Sesión
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-[#FF5200]/10 to-transparent blur-3xl -z-10 opacity-50" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="flex flex-col gap-8"
          >
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit"
            >
              <div className="w-2 h-2 rounded-full bg-[#FF5200] animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/50">Next Gen Restaurant Tech</span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-6xl lg:text-8xl font-heading font-extrabold leading-[0.9] tracking-tighter"
            >
              Vende directo.<br />
              <span className="text-[#FF5200]">Sin el 30%.</span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-white/60 max-w-lg leading-relaxed font-medium"
            >
              Convierte WhatsApp en tu canal de ventas más rentable. Nuestra IA toma pedidos, valida pagos y retiene a tus clientes automáticamente.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/onboarding" 
                className="group px-8 py-5 bg-[#FF5200] text-white rounded-[24px] font-extrabold text-xl shadow-2xl shadow-[#FF5200]/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                Empezar Ahora
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#como-funciona"
                className="px-8 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[24px] font-bold text-lg flex items-center justify-center transition-all"
              >
                Ver Demo
              </a>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#FF5200]/20 blur-[120px] rounded-full scale-75 -z-10" />
            <div className="bg-[#18181B] rounded-[48px] p-4 border border-white/10 shadow-2xl overflow-hidden aspect-[9/16] max-w-[340px] mx-auto rotate-1 lg:rotate-3">
               <ChatSimulation />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: "Margen Recuperado", value: "+30%" },
            { id: "Canal Propio", value: "100%" },
            { label: "Automatización", value: "24/7" },
            { label: "Retención Cliente", value: "X3" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl lg:text-5xl font-heading font-black text-white mb-2">{stat.value}</div>
              <div className="text-sm font-bold text-white/40 uppercase tracking-widest">{stat.label || stat.id}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem Section */}
      <section id="beneficios" className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center mb-24">
          <h2 className="text-4xl lg:text-6xl font-heading font-black mb-6">El problema del 30%</h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto font-medium">Depender de apps externas no es sostenible. Estás regalando tu margen y tus clientes a otros.</p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { 
              title: "Comisiones Abusivas", 
              desc: "Hasta el 35% de cada plato va para la plataforma.",
              icon: TrendingDown
            },
            { 
              title: "Cero Data Propios", 
              desc: "No sabes quién es tu cliente ni tienes su contacto.",
              icon: UserMinus
            },
            { 
              title: "Fricción Operativa", 
              desc: "Tablets sonando todo el día y errores de carga.",
              icon: Zap
            }
          ].map((p, i) => (
            <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] hover:bg-white/[0.04] transition-all group">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <p.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{p.title}</h3>
              <p className="text-white/40 font-medium leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-32 bg-primary/5 relative">
         <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
           <div>
             <h2 className="text-5xl lg:text-7xl font-heading font-black mb-8 leading-[0.9]">Recupera <br/><span className="text-primary">Tu Libertad.</span></h2>
             <div className="space-y-6">
               {[
                 "Venta automatizada sin intervention humana.",
                 "Base de datos de clientes 100% tuya.",
                 "Incremento inmediato en el margen neto.",
                 "Fidelización automática por WhatsApp."
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4">
                   <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                     <CheckCircle2 className="w-4 h-4" />
                   </div>
                   <span className="text-lg font-bold text-white/80">{item}</span>
                 </div>
               ))}
             </div>
           </div>
           <div className="bg-[#09090B] p-10 rounded-[48px] border border-white/10 shadow-3xl">
              <div className="flex flex-col gap-6">
                 <div className="flex justify-between items-end border-b border-white/10 pb-6">
                    <span className="text-sm font-bold uppercase text-white/40 tracking-widest">Ejemplo de Venta</span>
                    <span className="text-3xl font-heading font-black text-primary">$1,000 MXN</span>
                 </div>
                 <div className="grid grid-cols-2 gap-8">
                    <div>
                       <span className="text-[10px] uppercase font-bold text-white/40 block mb-2">Con Apps</span>
                       <span className="text-2xl font-bold text-red-500">$650 MXN<br/><small className="text-xs text-white/20">Neto tras comisiones</small></span>
                    </div>
                    <div>
                       <span className="text-[10px] uppercase font-bold text-white/40 block mb-2">Con DIRECTO</span>
                       <span className="text-2xl font-bold text-green-500">$980 MXN<br/><small className="text-xs text-white/20">Costo operativo mínimo</small></span>
                    </div>
                 </div>
                 <div className="mt-4 p-6 bg-primary/10 rounded-3xl border border-primary/20 text-center">
                    <span className="text-xl font-bold text-primary">+45% de Utilidad Real</span>
                 </div>
              </div>
           </div>
         </div>
       </section>

      {/* Pricing Section */}
      <section id="precios" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 flex flex-col gap-4">
            <h2 className="text-4xl lg:text-6xl font-heading font-black">Planes que Crecen Contigo</h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto font-medium">Desde un solo local hasta cadenas multinacionales. Recupera tu margen hoy.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {/* Starter Plan */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-10 bg-white/[0.02] border border-white/5 rounded-[48px] flex flex-col gap-8 transition-all hover:bg-white/[0.04]"
            >
              <div className="flex flex-col gap-2">
                <span className="text-sm font-bold text-white/40 uppercase tracking-[0.2em]">Starter</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black font-heading">$49</span>
                  <span className="text-white/40 font-bold uppercase tracking-widest text-xs">/ Mes</span>
                </div>
              </div>
              <p className="text-white/60 font-medium leading-relaxed">Ideal para restaurantes pequeños que quieren empezar a vender por WhatsApp.</p>
              <div className="space-y-4 flex-1">
                {["Canal Propio de WhatsApp", "Catálogo Digital", "Pagos Manuales", "Soporte Standard"].map((feat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500/50" />
                    <span className="text-sm font-bold text-white/60 font-sans">{feat}</span>
                  </div>
                ))}
              </div>
              <Link href="/onboarding" className="w-full py-4 rounded-[20px] bg-white/5 hover:bg-white/10 text-center font-black transition-all">Empezar Gratis</Link>
            </motion.div>

            {/* Pro Plan (Highlighted) */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-10 bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/40 rounded-[52px] flex flex-col gap-8 shadow-2xl shadow-primary/10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-primary px-6 py-2 rounded-bl-[20px] font-black text-[10px] uppercase tracking-widest text-white shadow-lg">Más Popular</div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-bold text-primary uppercase tracking-[0.2em]">Professional</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black font-heading">$99</span>
                  <span className="text-primary font-black uppercase tracking-widest text-xs">/ Mes</span>
                </div>
              </div>
              <p className="text-white/80 font-bold leading-relaxed">El poder de la IA para manejar todo tu negocio sin intervención humana.</p>
              <div className="space-y-4 flex-1">
                {[
                  "Todo en Starter",
                  "Asesor de Ventas IA 24/7",
                  "Validación de Pagos Automática",
                  "Digitalización OCR de Menú",
                  "Dashboard de Analíticas Pro",
                  "Soporte Prioritario"
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                    <span className="text-md font-black text-white font-sans">{feat}</span>
                  </div>
                ))}
              </div>
              <Link href="/onboarding" className="w-full py-5 rounded-[24px] bg-primary text-white text-center font-black text-xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Digitalizar Ahora</Link>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-10 bg-white/[0.02] border border-white/5 rounded-[48px] flex flex-col gap-8 transition-all hover:bg-white/[0.04]"
            >
              <div className="flex flex-col gap-2">
                <span className="text-sm font-bold text-white/40 uppercase tracking-[0.2em]">Enterprise</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black font-heading">Custom</span>
                </div>
              </div>
              <p className="text-white/60 font-medium leading-relaxed">Soluciones a medida para cadenas de restaurantes y operadores logísticos.</p>
              <div className="space-y-4 flex-1">
                {["Cuentas Ilimitadas", "API Access Completo", "White Label Options", "Account Manager Dedicado", "Integración POS Personalizada"].map((feat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white/20" />
                    <span className="text-sm font-bold text-white/40 font-sans">{feat}</span>
                  </div>
                ))}
              </div>
              <Link href="mailto:ventas@iaorbita.com" className="w-full py-4 rounded-[20px] bg-white/5 hover:bg-white/10 text-center font-black transition-all">Hablar con Ventas</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-40 px-6 text-center overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[150px] -z-10 opacity-30" />
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-10">
          <h2 className="text-5xl lg:text-8xl font-heading font-black leading-tight tracking-tighter">
            Deja de regalar <br/>tu dinero.
          </h2>
          <Link 
            href="/onboarding" 
            className="group px-12 py-6 bg-white text-black rounded-[28px] font-extrabold text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
          >
            Digitalizar Mi Restaurante
            <ChevronRight className="w-8 h-8 text-primary group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-white/40 font-bold uppercase tracking-widest text-sm">Cupos seleccionados por ciudad</p>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold">D</div>
            <span className="font-heading font-bold text-xl">DIRECTO</span>
          </div>
          <p className="text-white/20 text-sm font-medium">© 2025 DIRECTO. Powered by Orbita IA.</p>
        </div>
      </footer>
    </div>
  );
}
