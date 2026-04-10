"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "#beneficios", label: "Beneficios" },
    { href: "#flujo", label: "Cómo funciona" },
    { href: "#planes", label: "Planes" }
  ];

  const pillBase = scrolled || menuOpen
    ? 'bg-white/80 backdrop-blur-2xl border border-black/5 shadow-xl shadow-black/[0.03]'
    : 'bg-white/40 backdrop-blur-md border border-black/5 shadow-sm shadow-black/[0.01]';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 md:px-8 pointer-events-none">
      <div 
        className={`transition-all duration-500 ease-in-out w-full max-w-5xl overflow-hidden pointer-events-auto
          ${pillBase} 
          ${menuOpen ? 'rounded-[32px] max-h-[500px]' : 'rounded-[80px] max-h-[80px]'}
        `}
      >
        <div className="flex items-center justify-between px-6 py-3 md:px-10 md:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative w-9 h-9 md:w-11 md:h-11 overflow-hidden rounded-xl bg-primary transform group-hover:rotate-6 transition-transform shadow-lg shadow-primary/20">
              <Image src="/LOGODIRECTO.jpg" alt="DIRECTO" fill className="object-cover" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-black text-foreground/40 hover:text-primary transition-colors tracking-wide uppercase italic"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
             <Link 
              href="/login" 
              className="hidden md:flex px-6 py-2.5 text-foreground/40 hover:text-primary rounded-full text-sm font-black transition-all uppercase italic"
            >
              Entrar
            </Link>
            <Link 
              href="/onboarding" 
              className="px-5 py-2.5 md:px-8 md:py-3.5 bg-primary text-white rounded-full text-sm md:text-base font-black transition-all shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-95 whitespace-nowrap uppercase italic"
            >
              Inicia tu demo
            </Link>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-foreground"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Content */}
        <div 
          className={`md:hidden transition-all duration-500 ease-in-out px-8 
            ${menuOpen ? 'opacity-100 pb-12 pt-4 border-t border-black/5' : 'opacity-0 h-0 overflow-hidden'}
          `}
        >
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-2xl font-heading font-black text-foreground hover:text-primary transition-colors uppercase italic"
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-black/5 my-2" />
            <Link 
              href="/login" 
              className="text-xl font-black text-foreground/40 uppercase italic"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
