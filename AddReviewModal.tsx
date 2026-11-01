import React, { useState, useRef } from 'react';
import { X, Star, Upload, CheckCircle2, AlertCircle, Camera, Sparkles, User, Scissors } from 'lucide-react';
import { ServiceItem, Testimonial } from '../types';
import { processImageFile } from '../utils/imageUtils';
import { submitClientTestimonial } from '../services/api';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceItem[];
  onReviewSubmitted: (newReview: Testimonial, allReviews: Testimonial[]) => void;
}

const RATING_LABELS: Record<number, string> = {
  5: '¡Excelente! Máxima calidad y atención',
  4: 'Muy bueno, superó mis expectativas',
  3: 'Buen servicio, cumplió lo prometido',
  2: 'Regular, aspectos por mejorar',
  1: 'No satisfecho con el servicio'
};

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  isOpen,
  onClose,
  services,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [clientName, setClientName] = useState('');
  const [selectedService, setSelectedService] = useState(services[0]?.name || 'Corte Fade');
  const [customService, setCustomService] = useState('');
  const [comment, setComment] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successReview, setSuccessReview] = useState<Testimonial | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentDisplayRating = hoverRating ?? rating;

  // Compute initials for avatar preview
  const nameParts = clientName.trim().split(/\s+/).filter(Boolean);
  const previewInitials = nameParts.length > 1
    ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
    : clientName.trim().slice(0, 2).toUpperCase() || 'FC';

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPhoto(true);
      setErrorMessage(null);
      const compressed = await processImageFile(file, 600, 0.82);
      setAvatarUrl(compressed);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al procesar la fotografía.');
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = () => {
    setAvatarUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = clientName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage('Por favor ingresa tu nombre completo (mínimo 2 letras).');
      return;
    }

    const trimmedComment = comment.trim();
    if (!trimmedComment || trimmedComment.length < 5) {
      setErrorMessage('Por favor escribe tu opinión (mínimo 5 caracteres).');
      return;
    }

    const finalService = selectedService === 'otro' 
      ? (customService.trim() || 'Servicio Especial') 
      : selectedService;

    try {
      setIsSubmitting(true);
      const res = await submitClientTestimonial({
        name: trimmedName,
        rating,
        comment: trimmedComment,
        service: finalService,
        avatarUrl: avatarUrl || undefined
      });

      setSuccessReview(res.testimonial);
      onReviewSubmitted(res.testimonial, res.testimonials);
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocurrió un error al enviar tu reseña.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccessReview(null);
    setClientName('');
    setComment('');
    setAvatarUrl('');
    setRating(5);
    setHoverRating(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-[#101116] border border-[#232532] rounded-3xl shadow-2xl shadow-black overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-[#F0B247] to-transparent" />

        {/* Modal Close Button */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#181a24] hover:bg-[#252838] border border-[#2c2f3f] flex items-center justify-center text-neutral-400 hover:text-white transition-colors z-10"
          aria-label="Cerrar ventana"
        >
          <X className="w-4 h-4" />
        </button>

        {successReview ? (
          /* Success Screen */
          <div className="p-8 sm:p-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-[#F0B247]/15 border border-[#F0B247]/40 flex items-center justify-center text-[#F0B247] mb-5 shadow-lg shadow-[#F0B247]/10 animate-bounce-subtle">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-[11px] font-bold tracking-widest text-[#F0B247] uppercase mb-1">
              ¡RESEÑA PUBLICADA CON ÉXITO!
            </span>

            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">
              GRACIAS POR TU CONFIANZA
            </h3>

            <p className="text-sm text-neutral-300 max-w-md mb-6 leading-relaxed">
              Tu opinión ha sido registrada y ya se encuentra visible públicamente en el catálogo de testimonios de <strong className="text-white">FAST CUT BARBER STUDIO</strong>.
            </p>

            {/* Preview of published review */}
            <div className="w-full bg-[#15161f] border border-[#272937] rounded-2xl p-5 text-left mb-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < successReview.rating
                          ? 'text-[#F0B247] fill-[#F0B247]'
                          : 'text-neutral-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {successReview.date}
                </span>
              </div>

              <p className="text-xs text-neutral-200 italic mb-4 leading-relaxed">
                "{successReview.comment}"
              </p>

              <div className="flex items-center gap-3 pt-3 border-t border-[#222434]">
                {successReview.avatarUrl ? (
                  <img
                    src={successReview.avatarUrl}
                    alt={successReview.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/src/assets/images/hero_barber_model_1793125288409.jpg';
                    }}
                    className="w-9 h-9 rounded-full object-cover border border-[#F0B247]/50"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#1c1d28] border border-[#F0B247]/40 flex items-center justify-center font-bold text-xs text-[#F0B247]">
                    {successReview.avatarText}
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1">
                    <span>{successReview.name}</span>
                    <span className="text-[10px] bg-[#F0B247]/20 text-[#F0B247] px-1.5 py-0.2 rounded font-mono font-normal">Cliente</span>
                  </h4>
                  <p className="text-[11px] text-neutral-400">
                    {successReview.service}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#F0B247] hover:bg-[#fabc55] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#F0B247]/20"
            >
              Cerrar y Ver en la Web
            </button>
          </div>
        ) : (
          /* Form Content */
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#191b26] border border-[#282b3d] text-[11px] font-semibold text-[#F0B247] uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3" />
                <span>Tu Opinión Importa</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                DEJA TU RESEÑA DE <span className="text-[#F0B247]">FAST CUT</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Comparte cómo fue tu experiencia de corte y califica la atención de nuestros barberos profesionales.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-2.5 text-red-200 text-xs">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Rating Star Selector */}
              <div className="p-4 rounded-2xl bg-[#14151e] border border-[#232532] text-center">
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                  ¿Cómo calificarías tu experiencia?
                </label>
                
                <div className="flex items-center justify-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const isFilled = starVal <= currentDisplayRating;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 focus:outline-none transition-transform hover:scale-125 active:scale-95"
                        title={`${starVal} de 5 estrellas`}
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            isFilled
                              ? 'text-[#F0B247] fill-[#F0B247] drop-shadow-[0_0_8px_rgba(240,178,71,0.5)]'
                              : 'text-neutral-700 hover:text-neutral-500'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs font-semibold text-[#F0B247] min-h-[18px]">
                  {RATING_LABELS[currentDisplayRating]}
                </div>
              </div>

              {/* Name & Service inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#F0B247]" />
                    <span>Tu Nombre Completo *</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={50}
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej. Rodrigo Vásquez"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#151620] border border-[#27293a] text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-[#F0B247] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-[#F0B247]" />
                    <span>Servicio Realizado *</span>
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#151620] border border-[#27293a] text-white text-xs focus:outline-none focus:border-[#F0B247] transition-colors"
                  >
                    {services.map((svc) => (
                      <option key={svc.id} value={svc.name}>
                        {svc.name}
                      </option>
                    ))}
                    <option value="Corte + Barba Completo">Corte + Barba Completo</option>
                    <option value="otro">Otro servicio personalizado...</option>
                  </select>
                </div>
              </div>

              {/* Custom service input if 'otro' is chosen */}
              {selectedService === 'otro' && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">
                    Especifica qué servicio te realizaste:
                  </label>
                  <input
                    type="text"
                    maxLength={50}
                    value={customService}
                    onChange={(e) => setCustomService(e.target.value)}
                    placeholder="Ej. Platinado + Degradado francés"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#151620] border border-[#27293a] text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-[#F0B247]"
                  />
                </div>
              )}

              {/* Comment text area */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                    Tu Opinión / Comentario *
                  </label>
                  <span className={`text-[11px] font-mono ${comment.length > 450 ? 'text-[#F0B247]' : 'text-neutral-500'}`}>
                    {comment.length}/500
                  </span>
                </div>
                <textarea
                  required
                  rows={3}
                  maxLength={500}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Cuéntanos qué te pareció el corte, el trato del barbero, la puntualidad y si recomendarías FAST CUT..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#151620] border border-[#27293a] text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-[#F0B247] transition-colors resize-none"
                />
              </div>

              {/* Optional Client Photo / Haircut Photo */}
              <div className="p-3.5 rounded-2xl bg-[#14151e] border border-[#232532]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {avatarUrl ? (
                      <div className="relative">
                        <img
                          src={avatarUrl}
                          alt="Foto del cliente"
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#F0B247]"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#1c1e2b] border border-[#2e3146] flex items-center justify-center font-bold text-xs text-[#F0B247]">
                        {previewInitials}
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-semibold text-white">
                        {avatarUrl ? 'Foto añadida' : 'Foto de tu corte o perfil (Opcional)'}
                      </h4>
                      <p className="text-[11px] text-neutral-400">
                        {avatarUrl ? 'Tu foto se mostrará junto a tu reseña' : 'Puedes subir una foto del resultado'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                    {avatarUrl ? (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-[11px] text-red-300 transition-colors"
                      >
                        Quitar
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isUploadingPhoto}
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e202d] hover:bg-[#282b3d] border border-[#303348] text-xs text-neutral-300 hover:text-white transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5 text-[#F0B247]" />
                        <span>{isUploadingPhoto ? 'Cargando...' : 'Subir Foto'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto sm:flex-1 py-3 px-4 rounded-xl bg-[#171822] hover:bg-[#222432] border border-[#2a2c3d] text-neutral-400 hover:text-white text-xs font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto sm:flex-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#F0B247] to-[#e4a535] hover:from-[#fabc55] hover:to-[#edae3f] text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#F0B247]/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Publicando...</span>
                    </>
                  ) : (
                    <>
                      <Star className="w-4 h-4 fill-black" />
                      <span>Publicar Mi Reseña</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
