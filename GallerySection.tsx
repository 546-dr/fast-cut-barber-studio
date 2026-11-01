import React, { useState } from 'react';
import {
  Star,
  Gem,
  Scissors,
  Shield,
  X,
  Eye,
  Calendar,
  ArrowRight
} from 'lucide-react';

import { GalleryItem } from '../types';

interface GallerySectionProps {
  galleryItems: GalleryItem[];
  onSelectStyleForBooking: (styleName: string) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  galleryItems,
  onSelectStyleForBooking,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  // Mostrar todas las fotografías sin filtros
  const filteredItems = galleryItems;

  return (
    <section id="galeria" className="py-16 lg:py-24 bg-[#08090b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ENCABEZADO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
              <Star className="w-3.5 h-3.5 text-[#F0B247] fill-current" />
              <span>NUESTRA GALERÍA</span>
            </div>

            <h2 className="font-sans font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight">
              TRABAJOS REALES
            </h2>

            <p className="mt-2 text-sm text-neutral-400">
              Conoce nuestros trabajos y estilos.
            </p>
          </div>

          {/* ÚNICO FILTRO */}
          <div className="flex items-center">
            <span className="px-5 py-2 rounded-full bg-[#F0B247] text-black text-xs font-bold uppercase tracking-wider shadow-md shadow-[#F0B247]/20">
              Todos
            </span>
          </div>
        </div>

        {/* TODAS LAS FOTOGRAFÍAS */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">

            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedPhoto(item)}
                className="group cursor-pointer relative aspect-square rounded-2xl overflow-hidden bg-[#14151b] border border-[#23252e] hover:border-[#F0B247]/70 transition-all duration-300"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      '/src/assets/images/barber_service_fade_1793125288978.jpg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  referrerPolicy="no-referrer"
                />

                {/* EFECTO AL PASAR EL CURSOR */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center">
                  <Eye className="w-6 h-6 text-[#F0B247] mb-2" />
                  <span className="text-xs font-bold text-white uppercase line-clamp-2">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}

          </div>
        ) : (
          <div className="rounded-2xl border border-[#23252e] bg-[#121318] p-10 text-center">
            <Scissors className="w-10 h-10 text-[#F0B247] mx-auto mb-3" />
            <h3 className="text-white font-bold">
              Próximamente nuevos trabajos
            </h3>
            <p className="text-sm text-neutral-400 mt-2">
              Estamos preparando nuestra galería.
            </p>
          </div>
        )}

        {/* SELLOS DE CONFIANZA */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 pt-10 border-t border-[#1c1e26]">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#14151b] border border-[#23252e] flex items-center justify-center text-[#F0B247] shrink-0">
              <Gem className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Estilo Único
              </h3>
              <p className="text-[11px] text-neutral-400">
                Cortes personalizados
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#14151b] border border-[#23252e] flex items-center justify-center text-[#F0B247] shrink-0">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Barberos Profesionales
              </h3>
              <p className="text-[11px] text-neutral-400">
                Atención de calidad
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#14151b] border border-[#23252e] flex items-center justify-center text-[#F0B247] shrink-0">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Clientes Satisfechos
              </h3>
              <p className="text-[11px] text-neutral-400">
                Confianza y experiencia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#14151b] border border-[#23252e] flex items-center justify-center text-[#F0B247] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Ambiente Seguro
              </h3>
              <p className="text-[11px] text-neutral-400">
                Tu comodidad es prioridad
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* VENTANA PARA AMPLIAR FOTOGRAFÍAS */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-lg w-full bg-[#121318] border border-[#282a35] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/70 text-white hover:text-[#F0B247]"
              aria-label="Cerrar fotografía"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[4/3] w-full bg-black">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    '/src/assets/images/barber_service_fade_1793125288978.jpg';
                }}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-5">
              <h3 className="font-bold text-lg text-white mb-1">
                {selectedPhoto.title}
              </h3>

              <p className="text-xs text-neutral-400 mb-4">
                {selectedPhoto.description}
              </p>

              <button
                type="button"
                onClick={() => {
                  const title = selectedPhoto.title;

                  setSelectedPhoto(null);
                  onSelectStyleForBooking(title);

                  const el = document.getElementById('reservas');

                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full py-3 rounded-xl bg-[#F0B247] hover:bg-[#fabc55] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Pedir este corte en mi reserva</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>
          </div>
        </div>
      )}

    </section>
  );
};