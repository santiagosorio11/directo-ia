import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, CheckCircle2, Zap, Smartphone,
  TrendingDown, UserMinus, MessageSquare, ShieldCheck,
  ChevronRight, BarChart3, TrendingUp
} from "lucide-react";
import { ChatSimulation } from "./components/ui/ChatSimulation";
import Navbar from "./components/Navbar";


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-x-hidden font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 md:px-12 lg:px-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent blur-3xl -z-10 opacity-60" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start mt-8 lg:mt-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-black/5 w-fit shadow-sm">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black text-muted uppercase tracking-widest italic">WhatsApp · IA · Sin intermediarios</span>
            </div>
            
            <h1 className="text-4xl lg:text-7xl font-heading font-black leading-[1.1] mb-2 transform scale-y-110 origin-bottom inline-block italic uppercase">
              Vende <span className="text-primary">directo.</span><br />
               Sin el 30%.
            </h1>
            
            <p className="text-base lg:text-lg text-foreground/60 max-w-lg leading-relaxed font-bold mb-4 italic">
              Convierte WhatsApp en tu canal real de pedidos. Tus clientes escriben, la IA toma el pedido, valida el pago y confirma. Más margen, más control y menos dependencia de apps.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                href="/onboarding" 
                className="group px-6 md:px-10 py-4 bg-primary text-white rounded-full font-black text-base md:text-xl shadow-2xl shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-all w-full sm:w-auto uppercase italic"
              >
                Inicia tu demo <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#flujo"
                className="px-6 md:px-10 py-4 bg-white hover:bg-[#EEF2F6] border border-black/5 rounded-full font-black text-base md:text-xl flex items-center justify-center transition-all w-full sm:w-auto uppercase italic shadow-sm"
              >
                Ver cómo funciona
              </a>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8 pt-8 border-t border-black/5 w-full">
              <div><div className="text-3xl font-heading font-black text-foreground italic">+30%</div><div className="text-[10px] font-black text-muted uppercase tracking-widest">MARGEN RECUPERADO</div></div>
              <div><div className="text-3xl font-heading font-black text-foreground italic">24/7</div><div className="text-[10px] font-black text-muted uppercase tracking-widest">ATENCIÓN IA</div></div>
              <div><div className="text-3xl font-heading font-black text-foreground italic">100%</div><div className="text-[10px] font-black text-muted uppercase tracking-widest">CANAL PROPIO</div></div>
              <div><div className="text-3xl font-heading font-black text-foreground italic">0</div><div className="text-[10px] font-black text-muted uppercase tracking-widest">INTERMEDIARIOS</div></div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[340px] rotate-1 lg:rotate-3 scale-[0.9]">
             <div className="absolute inset-0 bg-primary/10 blur-[100px] -z-10 rounded-full" />
             <div className="bg-white rounded-[40px] border border-black/5 shadow-2xl overflow-hidden aspect-[9/16] p-4 lg:p-6 ring-1 ring-black/[0.02]">
                <ChatSimulation />
             </div>
          </div>
        </div>
      </section>

      {/* Problema */}
      <section id="problema" className="py-24 px-8 md:px-12 lg:px-20 border-t border-black/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 mb-6">
               <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
               <span className="text-xs font-black text-muted uppercase tracking-widest italic">El problema</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-heading font-black leading-[1.2] mb-6 transform scale-y-110 origin-bottom inline-block uppercase italic">Las apps te traen pedidos.<br/>Pero te quitan margen.</h2>
            <p className="text-base text-foreground/60 leading-relaxed mb-8 font-bold italic">Vender por marketplace parece cómodo, hasta que haces cuentas. Pagas comisión, pierdes control y el cliente termina siendo de la plataforma.</p>
            
            <div className="space-y-4">
              {[
                "Pagas comisiones altas por cada pedido.",
                "No controlas la relación con el cliente.",
                "No construyes un canal propio de recompra.",
                "Dependes del algoritmo de otra empresa para vender."
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center flex-shrink-0 mt-1"><UserMinus className="w-4 h-4" /></div>
                  <span className="text-foreground/80 font-bold text-base leading-snug italic">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-[40px] p-10 border border-black/5 shadow-xl">
            <div className="flex justify-between items-end border-b border-black/5 pb-6 mb-6">
              <span className="text-xs font-black text-muted uppercase tracking-widest italic">Pedido por app</span>
              <span className="text-4xl font-heading font-black text-foreground italic">$45.000</span>
            </div>
            <div className="h-4 bg-[#EEF2F6] rounded-full overflow-hidden mb-4">
              <div className="h-full bg-red-500 w-[30%]"></div>
            </div>
            <div className="text-xs font-black text-red-500 mb-10 uppercase italic tracking-widest">Hasta 30% se va en comisión</div>
            
            <div className="text-7xl font-heading font-black text-primary mb-6 italic">30%</div>
            <h3 className="text-2xl font-black mb-3 uppercase italic leading-tight">Ese margen puede estar saliendo hoy de tu operación</h3>
            <p className="text-foreground/50 font-bold italic">DIRECTO te ayuda a mover pedidos a un canal que sí controlas: WhatsApp, bajo tu marca y con experiencia automatizada.</p>
          </div>
        </div>
      </section>

      {/* Beneficios Grid */}
      <section id="beneficios" className="py-24 px-8 md:px-12 lg:px-20 border-t border-black/5 bg-white/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 mb-6">
               <div className="w-2 h-2 rounded-full bg-primary" />
               <span className="text-xs font-black text-muted uppercase tracking-widest italic">Beneficios</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-heading font-black leading-[1.2] mb-6 transform scale-y-110 origin-bottom inline-block uppercase italic">
              Más margen. Más control.<br/><span className="text-primary">Más negocio.</span>
            </h2>
            <p className="text-base text-foreground/60 max-w-2xl leading-relaxed font-bold italic">DIRECTO convierte WhatsApp en un canal real de pedidos, pagos y confirmación, diseñado para vender mejor y operar con menos fricción.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
               { i: '💰', t: 'Recupera tu margen', d: 'Deja de regalar parte de cada pedido a un marketplace externo.' },
               { i: '📲', t: 'Tu canal propio', d: 'El cliente pide por WhatsApp, bajo tu marca, sin descargar nada.' },
               { i: '🤖', t: 'Atención automática', d: 'La IA responde, toma el pedido y reduce carga operativa.' },
               { i: '👤', t: 'El cliente es tuyo', d: 'La relación, la recompra y la comunicación quedan contigo.' },
               { i: '📊', t: 'Más visibilidad', d: 'Entiendes mejor lo que entra, cómo se confirma y qué optimizar.' },
               { i: '⚡', t: 'Escala sin fricción', d: 'Atiendes más pedidos sin depender de crecer solo con más personal.' },
            ].map((b, idx) => (
              <div key={idx} className="bg-white p-10 rounded-[40px] border border-black/5 hover:border-primary/20 transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5 group">
                <div className="w-16 h-16 bg-[#EEF2F6] rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">{b.i}</div>
                <h3 className="text-2xl font-black font-heading mb-4 uppercase italic leading-tight">{b.t}</h3>
                <p className="text-sm text-foreground/50 leading-relaxed font-bold italic">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flujo Steps */}
      <section id="flujo" className="py-24 px-8 md:px-12 lg:px-20 border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-heading font-black leading-[1.2] mb-6 transform scale-y-110 origin-bottom inline-block uppercase italic">
              Todo en WhatsApp.<br/>Simple para el cliente.
            </h2>
            <p className="text-base text-foreground/60 max-w-2xl mx-auto leading-relaxed font-bold italic">El flujo es claro, rápido y pensado para cerrar pedidos sin fricción.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-[48px] left-0 w-full h-[1px] bg-black/5 z-0" />
            {[
               { n: 1, t: 'El cliente escribe', d: 'Entra por WhatsApp como ya lo haría hoy.' },
               { n: 2, t: 'La IA toma el pedido', d: 'Muestra menú, responde dudas y estructura la orden.' },
               { n: 3, t: 'Se valida el pago', d: 'El cliente envía comprobante y el sistema lo revisa.' },
               { n: 4, t: 'Pedido confirmado', d: 'Cocina recibe la confirmación y la operación continúa.' }
            ].map(s => (
               <div key={s.n} className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-[#F9FAFB] border-[12px] border-white flex items-center justify-center text-4xl font-heading font-black text-primary mb-8 shadow-xl">{s.n}</div>
                  <h3 className="text-xl font-black mb-4 uppercase italic leading-tight">{s.t}</h3>
                  <p className="text-sm text-foreground/50 font-bold italic">{s.d}</p>
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI & Antes / Después */}
      <section className="py-24 px-8 md:px-12 lg:px-20 border-t border-black/5 bg-gradient-to-b from-white to-transparent">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="bg-white rounded-[40px] p-12 border border-black/5 shadow-2xl">
            <h3 className="text-3xl font-black font-heading mb-8 uppercase italic leading-tight">Pérdida mensual de margen</h3>
            <div className="space-y-6 font-sans">
               <div className="flex justify-between items-center text-foreground/40 font-black italic uppercase text-sm"><span>20 pedidos diarios</span><span>x</span></div>
               <div className="flex justify-between items-center text-foreground/40 font-black italic uppercase text-sm"><span>$40.000 ticket promedio</span><span className="text-foreground transition-all uppercase">= $800.000/día</span></div>
               <div className="flex justify-between items-center text-red-500 font-black italic uppercase text-sm"><span>30% en comisiones</span><span>= $240.000/día</span></div>
               <div className="border-t border-black/5 mt-6 pt-6 flex justify-between items-center text-primary font-black text-3xl italic uppercase leading-tight"><span>Pérdida al mes</span><span>$7.200.000</span></div>
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 mb-6">
               <span className="text-xs font-black text-muted uppercase tracking-widest italic">ROI y Comparativa</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-heading font-black leading-[1.2] mb-6 transform scale-y-110 origin-bottom inline-block uppercase italic">No es solo automatizar.<br/>Es recuperar dinero.</h2>
            <p className="text-base text-foreground/60 leading-relaxed mb-10 font-bold italic">DIRECTO no se vende por "tecnología bonita". Se vende porque puede ayudarte a mover parte de tu operación a un canal más rentable y controlado.</p>
            
            <div className="space-y-4">
               {[
                 { a: 'Dependes de apps', b: 'Vendes por tu canal propio' },
                 { a: 'Pagas comisión alta', b: 'Recuperas más margen por pedido' },
                 { a: 'El cliente es de la app', b: 'El cliente queda en tu ecosistema' }
               ].map((c, i) => (
                 <div key={i} className="flex items-center gap-6 bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
                   <div className="w-1/2 text-foreground/40 text-xs font-black uppercase italic tracking-tight">{c.a}</div>
                   <ArrowRight className="w-5 h-5 text-primary mx-1 flex-shrink-0" />
                   <div className="w-1/2 text-foreground font-black text-xs uppercase italic tracking-tight">{c.b}</div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planes" className="py-24 px-8 md:px-12 lg:px-20 border-t border-black/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-heading font-black leading-[1.2] mb-6 transform scale-y-110 origin-bottom inline-block uppercase italic">Entra al piloto.<br/>Estructura simple.</h2>
            <p className="text-base text-foreground/60 max-w-2xl mx-auto font-bold italic">Diseñado para que puedas empezar sin fricción y validar rápido el canal.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {/* Starter Plan */}
            <div className="p-12 bg-white border border-black/5 rounded-[40px] flex flex-col shadow-sm">
              <span className="text-xs font-black text-muted uppercase tracking-widest mb-4 italic">Starter</span>
              <div className="flex items-baseline gap-2 mb-8"><span className="text-5xl font-black font-heading italic">USD 99</span><span className="text-muted font-black uppercase text-[10px] tracking-widest italic">/ Mes</span></div>
              <p className="text-sm text-foreground/50 font-bold mb-10 italic">Ideal para comenzar a operar con un canal propio.</p>
              <div className="space-y-5 mb-12 flex-1">
                {["1 número de WhatsApp", "Configuración base", "Flujo inicial de pedidos", "Validación de pagos", "Soporte inicial"].map((feat, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <CheckCircle2 className="w-5 h-5 text-muted/20" />
                    <span className="text-sm text-foreground/60 font-bold italic">{feat}</span>
                  </div>
                ))}
              </div>
              <Link href="/onboarding" className="w-full py-5 rounded-full bg-[#EEF2F6] hover:bg-[#E5EAEF] text-foreground text-center font-black transition-all uppercase italic text-sm tracking-widest shadow-sm">Inicia tu demo</Link>
            </div>

            {/* Pro Plan */}
            <div className="p-12 bg-white border-4 border-primary rounded-[40px] flex flex-col relative shadow-2xl shadow-primary/10 scale-105 z-10">
              <div className="absolute top-0 right-[40px] bg-primary text-white px-5 py-2 rounded-b-xl text-[10px] font-black uppercase tracking-widest italic">Popular</div>
              <span className="text-xs font-black text-primary uppercase tracking-widest mb-4 italic">Pro</span>
              <div className="flex items-baseline gap-2 mb-8"><span className="text-6xl font-black font-heading italic text-foreground leading-none">USD 129</span><span className="text-primary font-black uppercase text-[10px] tracking-widest italic">/ Mes</span></div>
              <p className="text-sm text-foreground/80 font-black mb-10 italic">Para operaciones que quieren vender mejor desde el inicio.</p>
              <div className="space-y-5 mb-12 flex-1">
                {["Mayor personalización", "Flujos más robustos", "Validación IA de pagos", "Soporte prioritario", "Mejor estructura de operación"].map((feat, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="text-sm text-foreground font-black italic">{feat}</span>
                  </div>
                ))}
              </div>
              <Link href="/onboarding" className="w-full py-6 rounded-full bg-primary text-white text-center font-black shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase italic text-lg tracking-widest">Inicia tu demo</Link>
            </div>

            {/* Enterprise Plan */}
            <div className="p-12 bg-white border border-black/5 rounded-[40px] flex flex-col shadow-sm">
              <span className="text-xs font-black text-muted uppercase tracking-widest mb-4 italic">Enterprise</span>
              <div className="mb-8 mt-2"><span className="text-4xl font-black font-heading italic uppercase leading-tight">Personalizar</span></div>
              <p className="text-sm text-foreground/50 font-bold mb-10 italic">Para multi-sede o necesidades especiales.</p>
              <div className="space-y-5 mb-12 flex-1">
                {["Operación más compleja", "Customización avanzada", "Implementación a medida", "Acompañamiento dedicado"].map((feat, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <CheckCircle2 className="w-5 h-5 text-muted/20" />
                    <span className="text-sm text-foreground/60 font-bold italic">{feat}</span>
                  </div>
                ))}
              </div>
              <Link href="#cta" className="w-full py-5 rounded-full bg-[#EEF2F6] hover:bg-[#E5EAEF] text-foreground text-center font-black transition-all uppercase italic text-sm tracking-widest shadow-sm">Cotizar</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section id="cta" className="py-32 px-8 md:px-12 lg:px-20 border-t border-black/5 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 blur-[120px] -z-10 opacity-60" />
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-10">
          <div className="inline-flex items-center gap-2">
            <span className="text-xs font-black text-muted uppercase tracking-widest italic">Piloto Controlado</span>
          </div>
          <h2 className="text-4xl lg:text-7xl font-heading font-black leading-[1.1] transform scale-y-110 inline-block origin-bottom mb-2 uppercase italic">
            Cupos limitados para<br/>restaurantes piloto.
          </h2>
          <p className="text-base lg:text-xl text-foreground/50 font-bold mb-4 leading-relaxed italic max-w-2xl">
            Si quieres recuperar margen y construir canal propio, este es el momento. Estamos abriendo pocos pilotos a la vez.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 w-full justify-center px-4 sm:px-0">
             <Link 
               href="/onboarding" 
               className="group px-10 py-5 bg-primary text-white rounded-full font-black text-xl shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 w-full sm:w-auto uppercase italic tracking-widest"
             >
               Inicia tu demo
               <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
             </Link>
             <a href="mailto:ventas@iaorbita.com" className="px-10 py-5 bg-white hover:bg-[#EEF2F6] text-foreground border border-black/5 rounded-full font-black text-xl transition-all flex items-center justify-center w-full sm:w-auto uppercase italic tracking-widest shadow-sm">
                Agendar demo
             </a>
          </div>
          <p className="text-primary font-black text-xs uppercase tracking-[0.2em] mt-6 animate-pulse italic">Se están activando restaurantes de forma controlada</p>
        </div>
      </section>

      <footer className="py-16 border-t border-black/5 px-8 md:px-12 lg:px-20 bg-white/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-4">
             <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-primary shadow-lg shadow-primary/20">
                <Image src="/LOGODIRECTO.jpg" alt="DIRECTO" fill className="object-cover" />
             </div>
            <span className="font-heading font-black text-2xl uppercase italic tracking-tighter">DIRECTO</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-xs font-black text-muted uppercase tracking-widest italic">
             <a href="#problema" className="hover:text-primary transition-colors">Problema</a>
             <a href="#flujo" className="hover:text-primary transition-colors">Cómo funciona</a>
             <a href="#planes" className="hover:text-primary transition-colors">Planes</a>
          </div>
          <div className="flex flex-col items-center md:items-end gap-1">
            <p className="text-muted text-[10px] font-black uppercase tracking-widest italic">© 2026 DIRECTO. Powered by Orbita IA.</p>
            <div className="flex gap-4">
              <Link href="/terms" className="text-[10px] font-black text-muted/50 uppercase tracking-widest italic hover:text-primary">Términos</Link>
              <Link href="/privacy" className="text-[10px] font-black text-muted/50 uppercase tracking-widest italic hover:text-primary">Privacidad</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
