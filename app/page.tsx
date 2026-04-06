import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  ArrowRight, CheckCircle2, Zap, Smartphone,
  TrendingDown, UserMinus, MessageSquare, ShieldCheck,
  ChevronRight, BarChart3, TrendingUp
} from "lucide-react";
import { ChatSimulation } from "./components/ui/ChatSimulation";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-white selection:bg-[#FF5200]/30 overflow-x-hidden">
      {/* Navbar Minimalista */}
      <nav className="fixed top-0 w-full z-50 bg-[#09090B]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-white/5">
              <Image src="/LOGODIRECTO.jpeg" alt="DIRECTO" fill className="object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-2xl font-extrabold tracking-normal">DIRECTO</span>
              <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-[-4px]">powered by Orbita IA</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <a href="#problema" className="hover:text-white transition-colors">Problema</a>
            <a href="#flujo" className="hover:text-white transition-colors">Cómo funciona</a>
            <a href="#beneficios" className="hover:text-white transition-colors">Beneficios</a>
            <a href="#planes" className="hover:text-white transition-colors">Planes</a>
          </div>
          <Link 
            href="/onboarding" 
            className="px-6 py-2.5 bg-[#FF5200] hover:bg-[#ff6a2b] rounded-full text-sm font-bold transition-all shadow-lg shadow-[#FF5200]/20"
          >
            Quiero mi restaurante
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-8 md:px-12 lg:px-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-[#FF5200]/10 to-transparent blur-3xl -z-10 opacity-50" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 w-fit">
              <div className="w-2 h-2 rounded-full bg-[#FF5200] animate-pulse" />
              <span className="text-xs font-bold text-white/60 tracking-wider">WhatsApp · IA · Sin intermediarios</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-heading font-extrabold leading-[1.2] mb-2 transform scale-y-110 origin-bottom inline-block">
              Vende <span className="text-[#FF5200]">directo.</span><br />
              Sin el 30%.
            </h1>
            
            <p className="text-base lg:text-lg text-white/70 max-w-lg leading-relaxed font-medium mb-4">
              Convierte WhatsApp en tu canal real de pedidos. Tus clientes escriben, la IA toma el pedido, valida el pago y confirma. Más margen, más control y menos dependencia de apps.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/onboarding" 
                className="group px-8 py-4 bg-[#FF5200] text-white rounded-full font-extrabold text-lg shadow-2xl shadow-[#FF5200]/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                Quiero mi restaurante <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#flujo"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-bold text-lg flex items-center justify-center transition-all"
              >
                Ver cómo funciona
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-white/10">
              <div><div className="text-3xl font-heading font-black text-white">+30%</div><div className="text-xs font-bold text-white/50">MARGEN RECUPERADO</div></div>
              <div><div className="text-3xl font-heading font-black text-white">24/7</div><div className="text-xs font-bold text-white/50">ATENCIÓN IA</div></div>
              <div><div className="text-3xl font-heading font-black text-white">100%</div><div className="text-xs font-bold text-white/50">CANAL PROPIO</div></div>
              <div><div className="text-3xl font-heading font-black text-white">0</div><div className="text-xs font-bold text-white/50">INTERMEDIARIOS</div></div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[340px] rotate-1 lg:rotate-3 scale-[0.9]">
             <div className="absolute inset-0 bg-[#FF5200]/20 blur-[100px] -z-10 rounded-full" />
             <div className="bg-[#18181B] rounded-[40px] border border-white/10 shadow-2xl overflow-hidden aspect-[9/16] p-4 lg:p-6">
                <ChatSimulation />
             </div>
          </div>
        </div>
      </section>

      {/* Problema */}
      <section id="problema" className="py-24 px-8 md:px-12 lg:px-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 mb-6">
               <div className="w-2 h-2 rounded-full bg-[#FF5200] animate-pulse" />
               <span className="text-sm font-bold text-white/50 uppercase tracking-widest">El problema</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-heading font-extrabold leading-[1.3] mb-6 transform scale-y-110 origin-bottom inline-block">Las apps te traen pedidos.<br/>Pero te quitan margen.</h2>
            <p className="text-base text-white/70 leading-relaxed mb-8">Vender por marketplace parece cómodo, hasta que haces cuentas. Pagas comisión, pierdes control y el cliente termina siendo de la plataforma.</p>
            
            <div className="space-y-4">
              {[
                "Pagas comisiones altas por cada pedido.",
                "No controlas la relación con el cliente.",
                "No construyes un canal propio de recompra.",
                "Dependes del algoritmo de otra empresa para vender."
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center flex-shrink-0 mt-1"><UserMinus className="w-4 h-4" /></div>
                  <span className="text-white/80 font-medium text-base leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
            <div className="flex justify-between items-end border-b border-white/10 pb-6 mb-6">
              <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Pedido por app</span>
              <span className="text-3xl font-heading font-black text-white">$45.000</span>
            </div>
            <div className="h-4 bg-white/10 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-red-500 w-[30%]"></div>
            </div>
            <div className="text-sm font-bold text-red-500 mb-10">Hasta 30% se va en comisión</div>
            
            <div className="text-6xl font-heading font-black text-[#FF5200] mb-4">30%</div>
            <h3 className="text-xl font-bold mb-2">Ese margen puede estar saliendo hoy de tu operación</h3>
            <p className="text-white/60">DIRECTO te ayuda a mover pedidos a un canal que sí controlas: WhatsApp, bajo tu marca y con experiencia automatizada.</p>
          </div>
        </div>
      </section>

      {/* Beneficios Grid */}
      <section id="beneficios" className="py-24 px-8 md:px-12 lg:px-20 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 mb-6">
               <div className="w-2 h-2 rounded-full bg-[#FF5200]" />
               <span className="text-sm font-bold text-white/50 uppercase tracking-widest">Beneficios</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-heading font-extrabold leading-[1.3] mb-6 transform scale-y-110 origin-bottom inline-block">
              Más margen. Más control.<br/><span className="text-[#FF5200]">Más negocio.</span>
            </h2>
            <p className="text-base text-white/70 max-w-2xl leading-relaxed">DIRECTO convierte WhatsApp en un canal real de pedidos, pagos y confirmación, diseñado para vender mejor y operar con menos fricción.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
               { i: '💰', t: 'Recupera tu margen', d: 'Deja de regalar parte de cada pedido a un marketplace externo.' },
               { i: '📲', t: 'Tu canal propio', d: 'El cliente pide por WhatsApp, bajo tu marca, sin descargar nada.' },
               { i: '🤖', t: 'Atención automática', d: 'La IA responde, toma el pedido y reduce carga operativa.' },
               { i: '👤', t: 'El cliente es tuyo', d: 'La relación, la recompra y la comunicación quedan contigo.' },
               { i: '📊', t: 'Más visibilidad', d: 'Entiendes mejor lo que entra, cómo se confirma y qué optimizar.' },
               { i: '⚡', t: 'Escala sin fricción', d: 'Atiendes más pedidos sin depender de crecer solo con más personal.' },
            ].map((b, idx) => (
              <div key={idx} className="bg-white/5 p-8 rounded-[32px] border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-3xl mb-6">{b.i}</div>
                <h3 className="text-2xl font-bold font-heading mb-3">{b.t}</h3>
                <p className="text-sm text-white/60 leading-relaxed font-medium">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flujo Steps */}
      <section id="flujo" className="py-24 px-8 md:px-12 lg:px-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-extrabold leading-[1.3] mb-6 transform scale-y-110 origin-bottom inline-block">
              Todo en WhatsApp.<br/>Simple para el cliente.
            </h2>
            <p className="text-base text-white/70 max-w-2xl mx-auto leading-relaxed">El flujo es claro, rápido y pensado para cerrar pedidos sin fricción.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-[48px] left-0 w-full h-[2px] bg-white/10 z-0" />
            {[
               { n: 1, t: 'El cliente escribe', d: 'Entra por WhatsApp como ya lo haría hoy.' },
               { n: 2, t: 'La IA toma el pedido', d: 'Muestra menú, responde dudas y estructura la orden.' },
               { n: 3, t: 'Se valida el pago', d: 'El cliente envía comprobante y el sistema lo revisa.' },
               { n: 4, t: 'Pedido confirmado', d: 'Cocina recibe la confirmación y la operación continúa.' }
            ].map(s => (
               <div key={s.n} className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-[#09090B] border-8 border-white/5 flex items-center justify-center text-3xl font-heading font-black text-[#FF5200] mb-6">{s.n}</div>
                  <h3 className="text-xl font-bold mb-3">{s.t}</h3>
                  <p className="text-sm text-white/60 font-medium">{s.d}</p>
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI & Antes / Después */}
      <section className="py-24 px-8 md:px-12 lg:px-20 border-t border-white/5 bg-gradient-to-b from-white/[0.01] to-transparent">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="bg-[#18181B] rounded-[40px] p-10 border border-white/10 shadow-2xl">
            <h3 className="text-2xl font-bold font-heading mb-6">Pérdida mensual de margen</h3>
            <div className="space-y-4 font-mono text-sm sm:text-base">
               <div className="flex justify-between items-center text-white/60"><span>20 pedidos diarios</span><span>x</span></div>
               <div className="flex justify-between items-center text-white/60"><span>$40.000 ticket promedio</span><span className="text-white">= $800.000/día</span></div>
               <div className="flex justify-between items-center text-red-400 font-bold"><span>30% en comisiones</span><span>= $240.000/día</span></div>
               <div className="border-t border-white/10 mt-4 pt-4 flex justify-between items-center text-[#FF5200] font-black text-xl"><span>Pérdida al mes</span><span>$7.200.000</span></div>
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 mb-6">
               <span className="text-sm font-bold text-white/50 uppercase tracking-widest">ROI y Comparativa</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-heading font-extrabold leading-[1.3] mb-6 transform scale-y-110 origin-bottom inline-block">No es solo automatizar.<br/>Es recuperar dinero.</h2>
            <p className="text-base text-white/70 leading-relaxed mb-10">DIRECTO no se vende por "tecnología bonita". Se vende porque puede ayudarte a mover parte de tu operación a un canal más rentable y controlado.</p>
            
            <div className="space-y-3">
               {[
                 { a: 'Dependes de apps', b: 'Vendes por tu canal propio' },
                 { a: 'Pagas comisión alta', b: 'Recuperas más margen por pedido' },
                 { a: 'El cliente es de la app', b: 'El cliente queda en tu ecosistema' }
               ].map((c, i) => (
                 <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl">
                   <div className="w-1/2 text-white/50 text-sm">{c.a}</div>
                   <ArrowRight className="w-4 h-4 text-[#FF5200] mx-2 flex-shrink-0" />
                   <div className="w-1/2 text-white font-bold text-sm">{c.b}</div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planes" className="py-24 px-8 md:px-12 lg:px-20 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-extrabold leading-[1.3] mb-6 transform scale-y-110 origin-bottom inline-block">Entra al piloto.<br/>Estructura simple.</h2>
            <p className="text-base text-white/70 max-w-2xl mx-auto font-medium">Diseñado para que puedas empezar sin fricción y validar rápido el canal.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {/* Starter Plan */}
            <div className="p-10 bg-white/[0.02] border border-white/10 rounded-[40px] flex flex-col">
              <span className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">Starter</span>
              <div className="flex items-baseline gap-2 mb-6"><span className="text-5xl font-black font-heading">USD 99</span><span className="text-white/40 font-bold uppercase text-xs">/ Mes</span></div>
              <p className="text-sm text-white/60 font-medium mb-8">Ideal para comenzar a operar con un canal propio.</p>
              <div className="space-y-4 mb-10 flex-1">
                {["1 número de WhatsApp", "Configuración base", "Flujo inicial de pedidos", "Validación de pagos", "Soporte inicial"].map((feat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-white/20" />
                    <span className="text-sm text-white/70 font-medium">{feat}</span>
                  </div>
                ))}
              </div>
              <Link href="/onboarding" className="w-full py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-center font-bold transition-all">Empezar</Link>
            </div>

            {/* Pro Plan */}
            <div className="p-10 bg-[#FF5200]/10 border-2 border-[#FF5200] rounded-[40px] flex flex-col relative shadow-2xl shadow-[#FF5200]/10">
              <div className="absolute top-0 right-[40px] bg-[#FF5200] text-white px-4 py-1 rounded-b-lg text-xs font-bold uppercase tracking-widest">Popular</div>
              <span className="text-sm font-bold text-[#FF5200] uppercase tracking-widest mb-4">Pro</span>
              <div className="flex items-baseline gap-2 mb-6"><span className="text-5xl font-black font-heading text-white">USD 129</span><span className="text-[#FF5200] font-bold uppercase text-xs">/ Mes</span></div>
              <p className="text-sm text-white/80 font-bold mb-8">Para operaciones que quieren vender mejor desde el inicio.</p>
              <div className="space-y-4 mb-10 flex-1">
                {["Mayor personalización", "Flujos más robustos", "Validación IA de pagos", "Soporte prioritario", "Mejor estructura de operación"].map((feat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#FF5200]" />
                    <span className="text-sm text-white font-bold">{feat}</span>
                  </div>
                ))}
              </div>
              <Link href="/onboarding" className="w-full py-4 rounded-full bg-[#FF5200] text-white text-center font-extrabold shadow-xl hover:scale-105 active:scale-95 transition-all">Quiero este</Link>
            </div>

            {/* Enterprise Plan */}
            <div className="p-10 bg-white/[0.02] border border-white/10 rounded-[40px] flex flex-col">
              <span className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">Enterprise</span>
              <div className="mb-6 mt-2"><span className="text-3xl font-black font-heading">Personalizar</span></div>
              <p className="text-sm text-white/60 font-medium mb-8">Para multi-sede o necesidades especiales.</p>
              <div className="space-y-4 mb-10 flex-1">
                {["Operación más compleja", "Customización avanzada", "Implementación a medida", "Acompañamiento dedicado"].map((feat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-white/20" />
                    <span className="text-sm text-white/70 font-medium">{feat}</span>
                  </div>
                ))}
              </div>
              <Link href="#cta" className="w-full py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-center font-bold transition-all">Cotizar</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section id="cta" className="py-32 px-8 md:px-12 lg:px-20 border-t border-white/5 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FF5200]/20 blur-[120px] -z-10 opacity-40" />
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-8">
          <div className="inline-flex items-center gap-2">
            <span className="text-sm font-bold text-white/50 uppercase tracking-widest">Piloto Controlado</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-heading font-extrabold leading-[1.2] transform scale-y-110 inline-block origin-bottom mb-2">
            Cupos limitados para<br/>restaurantes piloto.
          </h2>
          <p className="text-base text-white/60 font-medium mb-4 leading-relaxed">
            Si quieres recuperar margen y construir canal propio, este es el momento. Estamos abriendo pocos pilotos a la vez.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
             <Link 
               href="/onboarding" 
               className="group px-10 py-5 bg-[#FF5200] text-white rounded-full font-extrabold text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
             >
               Quiero entrar al piloto
               <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
             </Link>
             <a href="mailto:ventas@iaorbita.com" className="px-10 py-5 bg-white/10 hover:bg-white/15 text-white rounded-full font-bold text-lg transition-all flex items-center justify-center">
                Agendar demo
             </a>
          </div>
          <p className="text-[#FF5200] font-bold text-sm uppercase tracking-widest mt-4 animate-pulse">Se están activando restaurantes de forma controlada</p>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 px-8 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="relative w-8 h-8 overflow-hidden rounded-lg">
                <Image src="/LOGODIRECTO.jpeg" alt="DIRECTO" fill className="object-cover" />
             </div>
            <span className="font-heading font-bold text-xl">DIRECTO</span>
          </div>
          <div className="flex gap-6 text-sm font-bold text-white/40">
             <a href="#problema" className="hover:text-white">Problema</a>
             <a href="#flujo" className="hover:text-white">Cómo funciona</a>
             <a href="#planes" className="hover:text-white">Planes</a>
          </div>
          <p className="text-white/20 text-sm font-medium">© 2026 DIRECTO. Powered by Orbita IA.</p>
        </div>
      </footer>
    </div>
  );
}
