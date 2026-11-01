import React from 'react';

import localShop from '../assets/images/fastcut-nosotros.jpg';

import {
  Award,
  ShieldCheck,
  Coffee,
  Clock,
  Scissors,
  Sparkles,
  Target,
  Eye
} from 'lucide-react';

import { STUDIO_BENEFITS } from '../data/initialData';
import { StudioConfig } from '../types';

interface AboutSectionProps {
  config: StudioConfig;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ config }) => {
  const benefitIcons = [
    <Sparkles key="1" className="w-5 h-5" />,
    <ShieldCheck key="2" className="w-5 h-5" />,
    <Coffee key="3" className="w-5 h-5" />,
    <Clock key="4" className="w-5 h-5" />,
  ];

  return (
    <section
      id="nosotros"
      className="relative overflow-hidden bg-[#090a0c] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* CONTENIDO PRINCIPAL */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">

          {/* FOTOGRAFÍA DEL ESTABLECIMIENTO */}
          <div className="relative lg:col-span-6">

            <div className="absolute -inset-3 rounded-3xl bg-[#F0B247]/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-[#F0B247]/20 bg-[#121316] shadow-2xl">

              <img
                src={localShop}
                alt="Interior de FAST CUT BARBER STUDIO"
                className="h-[320px] w-full object-cover object-center sm:h-[440px] lg:h-[480px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-black/80 p-4 backdrop-blur-md sm:bottom-5 sm:left-5 sm:right-5">
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-[#F0B247]">
                  Nuestro local
                </p>

                <p className="text-sm leading-relaxed text-neutral-200">
                  Un espacio diseñado para ofrecerte estilo, comodidad y una atención de calidad.
                </p>
              </div>

            </div>
          </div>

          {/* MISIÓN Y VISIÓN */}
          <div className="flex flex-col justify-center lg:col-span-6">

            <div className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#F0B247]">
              <Scissors className="h-4 w-4" />
              Sobre {config.name}
            </div>

            {/* MISIÓN */}
            <div className="mb-9 flex items-start gap-5">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-[#F0B247]/40 bg-[#15130f] text-[#F0B247] sm:h-20 sm:w-20">
                <Target className="h-8 w-8 sm:h-10 sm:w-10" />
              </div>

              <div className="min-w-0 flex-1 border-l-2 border-[#F0B247]/60 pl-5">

                <h3 className="mb-2 font-serif text-3xl font-bold text-white sm:text-4xl">
                  MISIÓN
                </h3>

                <p className="text-sm leading-relaxed text-neutral-300">
                  Brindar un servicio de barbería moderno y de calidad, ofreciendo cortes de cabello, arreglos de barba y tratamientos de cuidado personal de acuerdo con el estilo y las preferencias de cada cliente. En {config.name} buscamos crear un ambiente cómodo, limpio y agradable, donde cada persona reciba una atención personalizada y se sienta satisfecha con su imagen.
                </p>

              </div>
            </div>

            {/* VISIÓN */}
            <div className="mb-8 flex items-start gap-5">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-[#F0B247]/40 bg-[#15130f] text-[#F0B247] sm:h-20 sm:w-20">
                <Eye className="h-8 w-8 sm:h-10 sm:w-10" />
              </div>

              <div className="min-w-0 flex-1 border-l-2 border-[#F0B247]/60 pl-5">

                <h3 className="mb-2 font-serif text-3xl font-bold text-white sm:text-4xl">
                  VISIÓN
                </h3>

                <p className="text-sm leading-relaxed text-neutral-300">
                  Ser una barbería reconocida por la calidad de sus servicios, la atención al cliente y la innovación en las tendencias del cuidado masculino. {config.name} aspira a convertirse en una de las barberías preferidas de la ciudad, destacando por su profesionalismo, confianza y compromiso con la satisfacción de sus clientes.
                </p>

              </div>
            </div>

            {/* INDICADORES */}
            <div className="grid grid-cols-3 gap-3 border-t border-neutral-800 pt-7 text-center sm:gap-5">

              <div>
                <span className="block text-2xl font-black text-[#F0B247] sm:text-3xl">
                  100%
                </span>
                <span className="mt-1 block text-[9px] font-semibold uppercase tracking-wider text-neutral-400 sm:text-[11px]">
                  Navaja esterilizada
                </span>
              </div>

              <div>
                <span className="block text-2xl font-black text-[#F0B247] sm:text-3xl">
                  VIP
                </span>
                <span className="mt-1 block text-[9px] font-semibold uppercase tracking-wider text-neutral-400 sm:text-[11px]">
                  Bebida incluida
                </span>
              </div>

              <div>
                <span className="block text-2xl font-black text-[#F0B247] sm:text-3xl">
                  +6
                </span>
                <span className="mt-1 block text-[9px] font-semibold uppercase tracking-wider text-neutral-400 sm:text-[11px]">
                  Años de maestría
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* VENTAJAS DEL ESTUDIO */}
        <div className="mt-20 border-t border-neutral-800/80 pt-16">

          <div className="mx-auto mb-12 max-w-2xl text-center">

            <h3 className="mb-3 font-bold text-2xl text-white sm:text-3xl">
              VENTAJAS DE ELEGIR NUESTRO ESTUDIO
            </h3>

            <p className="text-sm text-neutral-400">
              Detalles que marcan la diferencia en cada visita.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

            {STUDIO_BENEFITS.map((benefit, idx) => (

              <div
                key={benefit.title}
                className="flex flex-col justify-between rounded-2xl border border-[#24262d] bg-[#121316] p-6 transition-all hover:border-[#F0B247]/40"
              >

                <div>

                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[#F0B247]/30 bg-[#181a1f] text-[#F0B247]">
                    {benefitIcons[idx] || (
                      <Award className="h-5 w-5" />
                    )}
                  </div>

                  <h4 className="mb-2 text-base font-bold text-white">
                    {benefit.title}
                  </h4>

                  <p className="text-xs leading-relaxed text-neutral-400">
                    {benefit.description}
                  </p>

                </div>

              </div>

            ))}

          </div>
        </div>

      </div>
    </section>
  );
};