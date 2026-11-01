import React, { useState } from 'react';
import { Star, Quote, CheckCircle, Settings, Calendar, PlusCircle, MessageSquarePlus, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Testimonial, StudioConfig, ServiceItem } from '../types';
import { CrownLogo } from './CrownLogo';
import { AddReviewModal } from './AddReviewModal';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  config: StudioConfig;
  services: ServiceItem[];
  onOpenSettings: () => void;
  onBookClick: () => void;
  onReviewSubmitted: (newReview: Testimonial, allReviews: Testimonial[]) => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
  config,
  services,
  onOpenSettings,
  onBookClick,
  onReviewSubmitted,
}) => {
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Calculate average rating
  const avgRating = testimonials.length > 0
    ? (testimonials.reduce((acc, curr) => acc + curr.rating, 0) / testimonials.length).toFixed(1)
    : '5.0';

  // Sliced reviews if collapsed
  const displayedReviews = showAllReviews ? testimonials : testimonials.slice(0, 3);

  return (
    <section id="testimonios" className="py-16 lg:py-24 bg-[#0a0b0d] relative overflow-hidden">
      {/* Subtle gold glow */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#F0B247]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
              <Star className="w-3.5 h-3.5 text-[#F0B247] fill-current" />
              <span>TESTIMONIOS REALES</span>
              <span className="w-1 h-1 rounded-full bg-neutral-600" />
              <span className="text-[#F0B247] font-bold">{avgRating} ★ ({testimonials.length} reseñas)</span>
            </div>

            <h2 className="font-sans font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight">
              EXPERIENCIAS EN <span className="text-[#F0B247]">FAST CUT</span>
            </h2>

            <p className="text-sm text-neutral-400 mt-1 max-w-xl">
              La satisfacción de quienes confían su imagen y estilo en nuestros barberos. ¿Ya te cortaste con nosotros? ¡Déjanos tu opinión!
            </p>
          </div>

          {/* Action Buttons: Add Review + Admin Edit */}
          <div className="flex items-center flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddReviewModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold text-black bg-[#F0B247] hover:bg-[#fabc55] active:scale-[0.98] transition-all shadow-md shadow-[#F0B247]/20 group"
            >
              <MessageSquarePlus className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
              <span>Dejar Mi Reseña</span>
            </button>

            <button
              type="button"
              onClick={onOpenSettings}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#14151b] border border-[#232530] text-xs text-neutral-400 hover:text-[#F0B247] hover:border-[#F0B247]/40 transition-colors"
              title="Administrar testimonios como propietario"
            >
              <Settings className="w-3.5 h-3.5 text-[#F0B247]" />
              <span className="hidden sm:inline">Gestionar</span>
            </button>
          </div>
        </div>

        {/* Customer Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedReviews.map((item, index) => (
            <div
              key={item.id}
              className="group relative rounded-3xl bg-[#121318] border border-[#22242d] hover:border-[#F0B247]/50 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-[#F0B247]/10"
            >
              <div>
                {/* Top Row: Stars, New badge & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < item.rating
                            ? 'text-[#F0B247] fill-[#F0B247]'
                            : 'text-neutral-700'
                        }`}
                      />
                    ))}
                    {index === 0 && item.date?.includes('Hoy') && (
                      <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#F0B247]/20 text-[#F0B247] border border-[#F0B247]/30 uppercase tracking-wider animate-pulse">
                        Nueva
                      </span>
                    )}
                  </div>

                  <Quote className="w-6 h-6 text-neutral-700 group-hover:text-[#F0B247]/40 transition-colors" />
                </div>

                {/* Comment Text */}
                <p className="text-sm text-neutral-300 leading-relaxed italic mb-6">
                  "{item.comment}"
                </p>
              </div>

              {/* Author & Service Footer */}
              <div className="pt-4 border-t border-[#1d1f27] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {item.avatarUrl ? (
                    <img
                      src={item.avatarUrl}
                      alt={item.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/src/assets/images/hero_barber_model_1793125288409.jpg';
                      }}
                      className="w-10 h-10 rounded-full object-cover border border-[#F0B247]/50 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#1a1b24] border border-[#F0B247]/40 flex items-center justify-center font-bold text-xs text-[#F0B247] shrink-0">
                      {item.avatarText || item.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-white flex items-center gap-1.5 truncate">
                      <span className="truncate">{item.name}</span>
                      <CheckCircle className="w-3.5 h-3.5 text-[#F0B247] shrink-0" />
                    </h3>
                    <p className="text-[11px] text-neutral-400 font-medium truncate">
                      {item.service}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] text-neutral-500 font-mono shrink-0">
                  {item.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Expand / Collapse reviews button if more than 3 */}
        {testimonials.length > 3 && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#14151d] hover:bg-[#1a1c26] border border-[#262836] hover:border-[#F0B247]/40 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
            >
              {showAllReviews ? (
                <>
                  <ChevronUp className="w-4 h-4 text-[#F0B247]" />
                  <span>Mostrar menos reseñas</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 text-[#F0B247]" />
                  <span>Ver todas las reseñas ({testimonials.length})</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Bottom Banner CTA for Clients */}
        <div className="mt-12 p-6 rounded-2xl bg-[#121318] border border-[#22242d] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-[#181a22] border border-[#F0B247]/30 flex items-center justify-center text-[#F0B247] shrink-0">
              <CrownLogo className="w-5 h-5 text-[#F0B247]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">¿Te atendiste recientemente en FAST CUT?</h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Tu opinión nos ayuda a premiar a nuestros barberos y mantener el nivel de excelencia.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsAddReviewModalOpen(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold text-[#F0B247] bg-[#1a1b24] hover:bg-[#222432] border border-[#F0B247]/40 transition-all"
            >
              <Star className="w-3.5 h-3.5 text-[#F0B247] fill-[#F0B247]" />
              <span>Calificar Servicio</span>
            </button>

            <button
              type="button"
              onClick={onBookClick}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold text-black bg-[#F0B247] hover:bg-[#fabc55] active:scale-[0.98] transition-all shadow-md shadow-[#F0B247]/20 whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Cita</span>
            </button>
          </div>
        </div>

      </div>

      {/* Client Add Review Modal */}
      <AddReviewModal
        isOpen={isAddReviewModalOpen}
        onClose={() => setIsAddReviewModalOpen(false)}
        services={services}
        onReviewSubmitted={(newReview, allReviews) => {
          onReviewSubmitted(newReview, allReviews);
        }}
      />
    </section>
  );
};
