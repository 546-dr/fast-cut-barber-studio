import React from 'react';
import {
  Calendar,
  MessageSquare,
  Scissors,
  Gem,
  Star,
  Clock,
  MapPin,
  Phone
} from 'lucide-react';

import { StudioConfig } from '../types';
import { buildWhatsAppLink } from '../utils/whatsapp';

import localShop from '../assets/images/fastcut-local.jpg';
import fastcutLogo from '../assets/images/fastcut-logo.jpg';

interface HeroProps {
  config: StudioConfig;
  onBookClick: () => void;
  onOpenSettings: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  config,
  onBookClick
}) => {
  const whatsappUrl = buildWhatsAppLink(
    config.phoneWhatsapp,
    `¡Hola ${config.name}! ¿Me podrían informar qué horarios tienen disponibles para reservar una cita?`
  );

  return (
    <section
      id="inicio"
      className="relative isolate overflow-hidden bg-[#090a0c] pt-24 pb-12 sm:pt-28 lg:pt-32 lg:pb-16"
    >
      {/* FOTOGRAFÍA REAL DEL LOCAL */}
      <div className="absolute inset-0 z-0">
        <img
          src={localShop}
          alt="Interior de FAST CUT BARBER STUDIO"
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* CAPAS PARA MEJORAR LA LECTURA */}
      <div className="absolute inset-0 z-[1] bg-black/40" />

      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-black/65 via-black/30 to-black/20" />

      {/* ILUMINACIÓN DORADA */}
      <div className="pointer-events-none absolute right-0 top-0 z-[2] h-80 w-80 rounded-full bg-[#F0B247]/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">

          {/* COLUMNA IZQUIERDA */}
          <div className="flex min-w-0 flex-col justify-center text-center lg:col-span-7 lg:text-left">

            <div className="mb-5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-white lg:justify-start">
              <MapPin className="h-4 w-4 text-[#F0B247]" />
              <span>IQUITOS – SAN JUAN</span>
            </div>

            {/* TÍTULO PRINCIPAL */}
            <h1 className="mb-5 break-words text-5xl font-black uppercase leading-[1.08] tracking-tight text-white sm:text-7xl lg:text-8xl">
              FAST CUT
            </h1>

            {/* FRASE OFICIAL */}
            <p className="mx-auto mb-7 max-w-2xl text-xl font-extrabold uppercase leading-tight tracking-[0.08em] text-[#F0B247] drop-shadow-[0_2px_10px_rgba(240,178,71,0.25)] sm:text-2xl lg:mx-0 lg:text-4xl">
              VIVE LA EXPERIENCIA Y ELEVA TU ESTILO
            </p>

            {/* DESCRIPCIÓN */}
            <p className="mx-auto mb-7 max-w-xl text-sm leading-relaxed text-white sm:text-base lg:mx-0 lg:text-lg">
              {config.tagline ||
                'Cortes modernos, clásicos y personalizados con la mejor atención.'}
            </p>

            {/* CARACTERÍSTICAS */}
            <div className="mb-8 grid grid-cols-3 gap-2 border-y border-white/20 py-5 sm:gap-4">

              <div className="flex flex-col items-center gap-2 sm:flex-row">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#F0B247]/30 bg-black/50 text-[#F0B247]">
                  <Scissors className="h-5 w-5" />
                </div>

                <div className="text-center sm:text-left">
                  <span className="block text-[10px] font-bold uppercase text-white sm:text-xs">
                    Cortes
                  </span>
                  <span className="text-[10px] text-neutral-200 sm:text-xs">
                    Profesionales
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 sm:flex-row">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#F0B247]/30 bg-black/50 text-[#F0B247]">
                  <Gem className="h-5 w-5" />
                </div>

                <div className="text-center sm:text-left">
                  <span className="block text-[10px] font-bold uppercase text-white sm:text-xs">
                    Estilo
                  </span>
                  <span className="text-[10px] text-neutral-200 sm:text-xs">
                    Personalizado
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 sm:flex-row">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#F0B247]/30 bg-black/50 text-[#F0B247]">
                  <Star className="h-5 w-5" />
                </div>

                <div className="text-center sm:text-left">
                  <span className="block text-[10px] font-bold uppercase text-white sm:text-xs">
                    Ambiente
                  </span>
                  <span className="text-[10px] text-neutral-200 sm:text-xs">
                    Único
                  </span>
                </div>
              </div>

            </div>

            {/* BOTONES */}
            <div className="flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">

              <button
                type="button"
                onClick={onBookClick}
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-[#F0B247] px-6 py-4 text-xs font-black uppercase tracking-wider text-black shadow-lg shadow-black/30 transition-all hover:bg-[#fabc55] active:scale-[0.98] sm:text-sm"
              >
                <Calendar className="h-4 w-4" />
                Agendar Cita
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-white/30 bg-black/60 px-6 py-4 text-xs font-bold text-white transition-all hover:border-[#F0B247] hover:bg-black/80 sm:text-sm"
              >
                <MessageSquare className="h-4 w-4 text-[#25D366]" />
                Escribir por WhatsApp
              </a>

            </div>
          </div>

          {/* COLUMNA DERECHA: LOGO DESPLAZADO */}
          <div className="relative mx-auto w-full max-w-xs lg:col-span-5 lg:justify-self-end lg:translate-x-[clamp(40px,7vw,90px)] lg:-translate-y-5">

            <div className="absolute -inset-2 rounded-[2rem] bg-[#F0B247]/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-3xl border border-[#F0B247]/30 bg-black/75 shadow-xl shadow-black/50 backdrop-blur-sm">

              <div className="flex min-h-[210px] flex-col items-center justify-center px-4 py-6 sm:min-h-[250px] sm:py-7">

                <span className="mb-3 rounded-full border border-[#F0B247]/30 bg-black/60 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.25em] text-[#F0B247] sm:text-[10px]">
                  Bienvenido a
                </span>

                <img
                  src={fastcutLogo}
                  alt="Logotipo oficial de FAST CUT BARBER STUDIO"
                  className="h-auto max-h-[150px] w-full max-w-[200px] object-contain drop-shadow-[0_0_15px_rgba(240,178,71,0.15)]"
                />

                <div className="mt-4 flex items-center gap-3">
                  <span className="h-px w-6 bg-[#F0B247]/60" />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-neutral-300">
                    Iquitos – San Juan
                  </span>

                  <span className="h-px w-6 bg-[#F0B247]/60" />
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* TARJETAS INFORMATIVAS */}
        <div className="mt-10 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-3">

          <div className="flex items-start gap-4 rounded-2xl border border-white/20 bg-black/75 p-5 backdrop-blur-sm transition-colors hover:border-[#F0B247]/50">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#F0B247]/30 bg-black text-[#F0B247]">
              <Clock className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Horario de atención
              </h3>
              <p className="mt-1 text-sm font-semibold text-white">
                {config.scheduleWeekday}
              </p>
              <p className="text-xs text-neutral-300">
                {config.scheduleSunday}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-white/20 bg-black/75 p-5 backdrop-blur-sm transition-colors hover:border-[#F0B247]/50">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#F0B247]/30 bg-black text-[#F0B247]">
              <MapPin className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Ubicación
              </h3>
              <p className="mt-1 text-sm font-semibold text-white">
                {config.address}
              </p>
              <p className="text-xs text-neutral-300">
                {config.city}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-white/20 bg-black/75 p-5 backdrop-blur-sm transition-colors hover:border-[#F0B247]/50">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#F0B247]/30 bg-black text-[#F0B247]">
              <Phone className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Contáctanos
              </h3>
              <p className="mt-1 font-mono text-sm font-bold text-white">
                {config.phoneDisplay}
              </p>
              <p className="flex items-center gap-1 text-xs font-medium text-[#25D366]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" />
                WhatsApp Disponible
              </p>
            </div>
          </div>

        </div>

        {/* ACCESOS RÁPIDOS PARA MÓVILES */}
        <div className="mt-4 grid grid-cols-3 gap-2 md:hidden">

          <a
            href="#inicio"
            className="flex min-h-[65px] flex-col items-center justify-center gap-1 rounded-xl border border-white/20 bg-black/80 p-2"
          >
            <Clock className="h-4 w-4 text-[#F0B247]" />
            <span className="text-[11px] font-semibold text-white">
              Horario
            </span>
          </a>

          <a
            href="#ubicacion"
            className="flex min-h-[65px] flex-col items-center justify-center gap-1 rounded-xl border border-white/20 bg-black/80 p-2"
          >
            <MapPin className="h-4 w-4 text-[#F0B247]" />
            <span className="text-[11px] font-semibold text-white">
              Ubicación
            </span>
          </a>

          <a
            href={`tel:${config.phoneWhatsapp}`}
            className="flex min-h-[65px] flex-col items-center justify-center gap-1 rounded-xl border border-white/20 bg-black/80 p-2"
          >
            <Phone className="h-4 w-4 text-[#25D366]" />
            <span className="text-[11px] font-semibold text-white">
              Llamar
            </span>
          </a>

        </div>

      </div>
    </section>
  );
};