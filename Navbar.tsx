import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar, Home, Scissors, Image as ImageIcon, MoreHorizontal, Settings, MapPin, Clock, Phone } from 'lucide-react';
import { StudioConfig } from '../types';
import { CrownLogo } from './CrownLogo';

interface NavbarProps {
  config: StudioConfig;
  onOpenSettings: () => void;
  onSelectBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ config, onOpenSettings, onSelectBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('inicio');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['inicio', 'servicios', 'galeria', 'reservas', 'nosotros', 'ubicacion'];
      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTab(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Inicio', href: '#inicio', id: 'inicio' },
    { label: 'Servicios', href: '#servicios', id: 'servicios' },
    { label: 'Reservas', href: '#reservas', id: 'reservas' },
    { label: 'Galería', href: '#galeria', id: 'galeria' },
    { label: 'Reseñas', href: '#testimonios', id: 'testimonios' },
    { label: 'Nosotros', href: '#nosotros', id: 'nosotros' },
    { label: 'Ubicación', href: '#ubicacion', id: 'ubicacion' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Desktop & Mobile Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0b0c0e]/95 backdrop-blur-md border-b border-[#1f2128] py-3.5 shadow-xl shadow-black/60'
            : 'bg-[#0b0c0e]/90 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-6">
            
            {/* Mobile Hamburger (left) */}
            <div className="flex items-center gap-1.5 lg:hidden shrink-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-neutral-300 hover:text-white rounded focus:outline-none"
                aria-label="Abrir menú"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Brand Logo with Golden Crown */}
            <a
              href="#inicio"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#inicio');
              }}
              className="flex flex-col items-start group whitespace-nowrap shrink-0"
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <CrownLogo className="w-4 h-4 sm:w-5 sm:h-5 text-[#F0B247] group-hover:scale-110 transition-transform shrink-0" />
                <span className="font-extrabold tracking-tight text-white text-sm sm:text-lg">
                  FAST CUT
                </span>
              </div>
              <span className="text-[8px] sm:text-[9px] tracking-[0.24em] sm:tracking-[0.28em] text-neutral-400 uppercase font-medium -mt-0.5">
                BARBER STUDIO
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-wider font-semibold text-neutral-300">
              {navLinks.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className={`relative py-1 transition-colors duration-150 hover:text-white ${
                      isActive ? 'text-white' : 'text-neutral-400'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F0B247] rounded-full" />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Right Action: CTA Button + Settings */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={onOpenSettings}
                title="Configuración de Barbería"
                className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg border border-[#23252d] bg-[#141519] text-neutral-400 hover:text-[#F0B247] hover:border-[#F0B247]/50 transition-all"
                aria-label="Configuración"
              >
                <Settings className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectBooking();
                  handleNavClick('#reservas');
                }}
                className="inline-flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wider text-black bg-[#F0B247] hover:bg-[#fabc55] active:scale-[0.98] transition-all shadow-md shadow-[#F0B247]/20 whitespace-nowrap shrink-0"
              >
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Agendar Cita</span>
                <span className="sm:hidden">Agendar</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer (Side Menu) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/85 backdrop-blur-md flex flex-col justify-between p-6">
          <div className="flex items-center justify-between border-b border-[#22242b] pb-4">
            <div className="flex items-center gap-2">
              <CrownLogo className="w-5 h-5 text-[#F0B247]" />
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-base">FAST CUT</span>
                <span className="text-[8px] tracking-[0.25em] text-neutral-400 uppercase">BARBER STUDIO</span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded bg-[#17181f] text-neutral-300"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-3 py-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-base font-semibold text-neutral-200 hover:text-[#F0B247] transition-colors py-2 border-b border-neutral-900 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-xs text-neutral-600">→</span>
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3 pt-4 border-t border-[#22242b]">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onSelectBooking();
                handleNavClick('#reservas');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-black bg-[#F0B247]"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Cita</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSettings();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs text-neutral-300 bg-[#16171d] border border-neutral-800"
            >
              <Settings className="w-3.5 h-3.5 text-[#F0B247]" />
              <span>Configuración del Estudio</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (matches reference phone UI on right!) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0e0f13]/95 backdrop-blur-md border-t border-[#1f2128] px-3 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto relative">
          
          {/* Inicio */}
          <button
            type="button"
            onClick={() => handleNavClick('#inicio')}
            className={`flex flex-col items-center gap-1 text-[10px] ${
              activeTab === 'inicio' ? 'text-[#F0B247]' : 'text-neutral-400'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Inicio</span>
          </button>

          {/* Servicios */}
          <button
            type="button"
            onClick={() => handleNavClick('#servicios')}
            className={`flex flex-col items-center gap-1 text-[10px] ${
              activeTab === 'servicios' ? 'text-[#F0B247]' : 'text-neutral-400'
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>Servicios</span>
          </button>

          {/* Center Floating Reservar Button (raised golden circle with calendar icon) */}
          <button
            type="button"
            onClick={() => {
              onSelectBooking();
              handleNavClick('#reservas');
            }}
            className="-mt-5 flex flex-col items-center group"
            aria-label="Reservar cita"
          >
            <div className="w-12 h-12 rounded-full bg-[#F0B247] group-hover:bg-[#fabc55] flex items-center justify-center text-black shadow-lg shadow-[#F0B247]/30 border-4 border-[#0e0f13]">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-[#F0B247] mt-0.5">Reservar</span>
          </button>

          {/* Galería */}
          <button
            type="button"
            onClick={() => handleNavClick('#galeria')}
            className={`flex flex-col items-center gap-1 text-[10px] ${
              activeTab === 'galeria' ? 'text-[#F0B247]' : 'text-neutral-400'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Galería</span>
          </button>

          {/* Más */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center gap-1 text-[10px] text-neutral-400 hover:text-white"
          >
            <MoreHorizontal className="w-4 h-4" />
            <span>Más</span>
          </button>

        </div>
      </div>
    </>
  );
};
