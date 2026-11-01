import React from 'react';
import {
  MapPin,
  Clock,
  MessageSquare,
  Phone,
  Instagram,
  Facebook,
  Settings,
  Navigation,
  Star
} from 'lucide-react';

import { StudioConfig } from '../types';
import { CrownLogo } from './CrownLogo';
import { buildWhatsAppLink } from '../utils/whatsapp';

interface LocationSectionProps {
  config: StudioConfig;
  onOpenSettings: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  config,
  onOpenSettings,
}) => {
  // Ubicación oficial compartida por el cliente
  const officialMapsUrl =
    'https://maps.app.goo.gl/ZYUVGwL6fYgTwfk59';

  const mapSearch =
    'FAST CUT BARBER STUDIO, Av. Las Colinas 578, San Juan, Iquitos, Peru';

  const embedMapUrl =
    `https://maps.google.com/maps?q=${encodeURIComponent(mapSearch)}&output=embed`;

  const whatsappDirectUrl = buildWhatsAppLink(
    config.phoneWhatsapp,
    `👋 Hola ${config.name}, me gustaría consultar cómo llegar al local.`
  );

  return (
    <section id="ubicacion" className="py-16 lg:py-24 bg-[#0a0b0e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ENCABEZADO */}
        <div className="mb-12">
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
            <Star className="w-3.5 h-3.5 text-[#F0B247] fill-current" />
            <span>NUESTRO LOCAL</span>
          </div>

          <h2 className="font-sans font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight">
            UBICACIÓN Y HORARIOS
          </h2>

          <p className="text-sm text-neutral-400 mt-2">
            Visítanos en nuestro local de San Juan, Iquitos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* INFORMACIÓN DEL NEGOCIO */}
          <div className="lg:col-span-5 flex flex-col gap-4">

            {/* DIRECCIÓN */}
            <div className="p-5 rounded-2xl bg-[#121318] border border-[#22242d] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#191b22] border border-[#2c2f3b] flex items-center justify-center text-[#F0B247] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-sm text-white">
                    Ubicación del Estudio
                  </h3>
                  <button
                    type="button"
                    onClick={onOpenSettings}
                    className="text-[11px] text-[#F0B247] hover:underline inline-flex items-center gap-1"
                  >
                    <Settings className="w-3 h-3" />
                    Editar
                  </button>
                </div>

                <p className="text-sm text-neutral-200 font-semibold mt-2">
                  Av. Las Colinas 578
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  San Juan, Iquitos, Perú
                </p>

                <a
                  href={officialMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#F0B247] font-bold hover:underline"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Cómo llegar</span>
                </a>
              </div>
            </div>

            {/* HORARIOS */}
            <div className="p-5 rounded-2xl bg-[#121318] border border-[#22242d] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#191b22] border border-[#2c2f3b] flex items-center justify-center text-[#F0B247] shrink-0">
                <Clock className="w-5 h-5" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">
                    Horario de Atención
                  </h3>
                  <button
                    type="button"
                    onClick={onOpenSettings}
                    className="text-[11px] text-[#F0B247] hover:underline inline-flex items-center gap-1"
                  >
                    <Settings className="w-3 h-3" />
                    Editar
                  </button>
                </div>

                <div className="mt-2 space-y-1 text-xs">
                  <div className="text-neutral-200 font-semibold">
                    {config.scheduleWeekday}
                  </div>
                  <div className="text-neutral-400">
                    {config.scheduleSunday}
                  </div>
                </div>
              </div>
            </div>

            {/* CONTACTO */}
            <div className="p-5 rounded-2xl bg-[#121318] border border-[#22242d] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#191b22] border border-[#2c2f3b] flex items-center justify-center text-[#25D366] shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">
                    WhatsApp y Llamadas
                  </h3>
                  <button
                    type="button"
                    onClick={onOpenSettings}
                    className="text-[11px] text-[#F0B247] hover:underline inline-flex items-center gap-1"
                  >
                    <Settings className="w-3 h-3" />
                    Configurar
                  </button>
                </div>

                <p className="text-sm font-mono text-white font-bold mt-2">
                  {config.phoneDisplay}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <a
                    href={whatsappDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366] text-black text-xs font-bold"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>

                  <a
                    href={`tel:${config.phoneWhatsapp}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1a1c24] text-neutral-200 text-xs font-semibold border border-[#2a2c38]"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Llamar
                  </a>
                </div>
              </div>
            </div>

            {/* REDES SOCIALES */}
            <div className="p-4 rounded-xl bg-[#121318] border border-[#22242d] flex items-center justify-between text-xs">
              <span className="text-neutral-400 font-semibold uppercase tracking-wider">
                Redes del Estudio:
              </span>

              <div className="flex items-center gap-2 text-neutral-300">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#181a20] hover:text-[#F0B247] border border-neutral-800"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#181a20] hover:text-[#F0B247] border border-neutral-800"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* MAPA REAL */}
          <div className="lg:col-span-7 rounded-2xl bg-[#121318] border border-[#22242d] overflow-hidden flex flex-col min-h-[380px]">

            <div className="p-4 bg-[#121318] border-b border-[#22242d] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <CrownLogo className="w-5 h-5 text-[#F0B247] shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">
                    FAST CUT BARBER STUDIO
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    San Juan, Iquitos
                  </p>
                </div>
              </div>

              <MapPin className="w-5 h-5 text-[#F0B247] shrink-0" />
            </div>

            <div className="flex-1 min-h-[320px] bg-[#191b22]">
              <iframe
                title="Ubicación de Fast Cut Barber Studio en Google Maps"
                src={embedMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '320px' }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="p-4 bg-[#121318] flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-neutral-400 text-center sm:text-left">
                Av. Las Colinas 578, San Juan, Iquitos
              </p>

              <a
                href={officialMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-[#F0B247] hover:bg-[#fabc55] transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Cómo llegar
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};