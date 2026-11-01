import React from 'react';
import { MessageSquare, MapPin, Clock, Settings, ArrowUp } from 'lucide-react';
import { StudioConfig } from '../types';
import { CrownLogo } from './CrownLogo';
import { buildWhatsAppLink } from '../utils/whatsapp';

interface FooterProps {
  config: StudioConfig;
  onOpenSettings: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onOpenSettings }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#07080a] border-t border-[#1a1c22] pt-14 pb-20 lg:pb-12 text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-10 border-b border-[#1a1c24]">
          
          {/* Brand & Slogan */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-white mb-3">
                <CrownLogo className="w-5 h-5 text-[#F0B247]" />
                <div className="flex flex-col">
                  <span className="font-extrabold text-white text-base tracking-tight">FAST CUT</span>
                  <span className="text-[8px] tracking-[0.25em] text-neutral-400 uppercase font-semibold">BARBER STUDIO</span>
                </div>
              </div>

              <p className="text-sm text-[#F0B247] font-bold italic mb-2 tracking-wide">
                "{config.slogan}"
              </p>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mb-6">
                {config.tagline}
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={onOpenSettings}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#14151b] hover:bg-[#1a1c24] border border-[#23252f] text-xs text-neutral-300 hover:text-[#F0B247] transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-[#F0B247]" />
                <span>Editar datos de la barbería</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Navegación
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#inicio" className="hover:text-[#F0B247] transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#servicios" className="hover:text-[#F0B247] transition-colors">
                  Nuestros Servicios
                </a>
              </li>
              <li>
                <a href="#reservas" className="hover:text-[#F0B247] transition-colors">
                  Agenda tu Cita
                </a>
              </li>
              <li>
                <a href="#galeria" className="hover:text-[#F0B247] transition-colors">
                  Trabajos Reales (Galería)
                </a>
              </li>
              <li>
                <a href="#ubicacion" className="hover:text-[#F0B247] transition-colors">
                  Ubicación y Horarios
                </a>
              </li>
            </ul>
          </div>

          {/* Contact and WhatsApp Direct */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Contacto Directo
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F0B247] shrink-0 mt-0.5" />
                <span>{config.address} ({config.city})</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#F0B247] shrink-0 mt-0.5" />
                <span>{config.scheduleWeekday}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                <span className="font-mono text-white font-bold">{config.phoneDisplay}</span>
              </div>

              <div className="pt-2">
                <a
                  href={buildWhatsAppLink(config.phoneWhatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#22bf5b] text-xs font-bold text-black transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-black" />
                  <span>WhatsApp Disponible</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <div>
            © {new Date().getFullYear()} {config.name}. Todos los derechos reservados.
          </div>

          <div className="text-center sm:text-right">
            Precios y datos referenciales basados en el diseño oficial.
          </div>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-lg bg-[#14151b] hover:bg-[#1a1c24] border border-[#23252f] text-neutral-400 hover:text-white transition-colors"
            aria-label="Volver arriba"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
