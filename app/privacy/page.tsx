"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] px-6 py-20">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link 
          href="/onboarding"
          className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>

        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black font-heading uppercase tracking-tight">Política de Privacidad</h1>
          <p className="text-muted text-lg">Última actualización: 10 de abril de 2026</p>
        </header>

        <div className="prose prose-slate max-w-none">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-heading uppercase">1. Información que recolectamos</h2>
            <p className="font-medium text-muted">
              En Directo IA, recolectamos información básica como tu nombre, correo electrónico y detalles de tu negocio (nombre del restaurante, menú, horarios) para poder configurar tu Agente de IA personalizado.
            </p>
          </section>

          <section className="space-y-4 pt-8">
            <h2 className="text-2xl font-bold font-heading uppercase">2. Uso de la información</h2>
            <p className="font-medium text-muted">
              Utilizamos esta información exclusivamente para:
            </p>
            <ul className="list-disc pl-5 space-y-2 font-medium text-muted">
              <li>Generar la lógica de ventas de tu bot.</li>
              <li>Configurar tu panel de control.</li>
              <li>Enviarte notificaciones críticas sobre tus pedidos.</li>
            </ul>
          </section>

          <section className="space-y-4 pt-8 border-t border-border">
            <p className="italic text-muted/60">
              Esta es una página de ejemplo con información de marcador de posición (placeholder).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
