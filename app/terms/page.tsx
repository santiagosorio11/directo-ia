"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
          <h1 className="text-4xl md:text-5xl font-black font-heading uppercase tracking-tight">Términos de Servicio</h1>
          <p className="text-muted text-lg">Última actualización: 10 de abril de 2026</p>
        </header>

        <div className="prose prose-slate max-w-none">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-heading uppercase">1. Aceptación de los términos</h2>
            <p className="font-medium text-muted">
              Al utilizar Directo IA, aceptas cumplir con estos términos de servicio. Nuestra plataforma proporciona herramientas de inteligencia artificial para la gestión y venta en restaurantes.
            </p>
          </section>

          <section className="space-y-4 pt-8">
            <h2 className="text-2xl font-bold font-heading uppercase">2. Uso de la plataforma</h2>
            <p className="font-medium text-muted">
              Te comprometes a proporcionar información veraz sobre tu negocio y a no utilizar la herramienta para fines ilícitos o que violen derechos de terceros.
            </p>
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
