import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

import {
  ServiceItem,
  Barber,
  StudioConfig,
  BookingState,
} from '../types';

import { CrownLogo } from './CrownLogo';
import { buildWhatsAppLink } from '../utils/whatsapp';

interface BookingSectionProps {
  services: ServiceItem[];
  barbers: Barber[];
  config: StudioConfig;
  selectedServiceId: string;
  onSelectServiceId: (id: string) => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  services,
  config,
  selectedServiceId,
  onSelectServiceId,
}) => {
  // Obtener fecha local
  const getLocalDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const todayStr = getLocalDate();

  const [form, setForm] = useState<BookingState>({
    serviceId: selectedServiceId || services[1]?.id || services[0]?.id || '',
    clientName: '',
    date: todayStr,
    time: '4:00 p.m.',
    barberId: 'any',
    extraNotes: '',
  });

  const [touched, setTouched] = useState({
    clientName: false,
    date: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validar nombre
  const validateClientName = (value: string): string | null => {
    const trimmed = value.trim();

    if (!trimmed) {
      return 'Por favor, introduce tu nombre completo.';
    }

    if (trimmed.length < 2) {
      return 'El nombre debe tener al menos 2 caracteres.';
    }

    return null;
  };

  // Validar fecha
  const validateDate = (value: string): string | null => {
    if (!value) {
      return 'Por favor, selecciona una fecha válida.';
    }

    const selectedDate = new Date(`${value}T00:00:00`);

    if (isNaN(selectedDate.getTime())) {
      return 'Introduce una fecha válida.';
    }

    if (value < todayStr) {
      return 'La fecha no puede ser anterior al día de hoy.';
    }

    return null;
  };

  // Actualizar servicio seleccionado
  useEffect(() => {
    if (selectedServiceId) {
      setForm((prev) => ({
        ...prev,
        serviceId: selectedServiceId,
      }));
    }
  }, [selectedServiceId]);

  const selectedService =
    services.find((s) => s.id === form.serviceId) || services[0];

  const selectedServiceImage =
    selectedService?.image ||
    '/src/assets/images/barber_service_beard_1793125288609.jpg';

  // Horarios disponibles
  const timeOptions = [
    '9:00 a.m.',
    '9:45 a.m.',
    '10:30 a.m.',
    '11:15 a.m.',
    '12:00 p.m.',
    '2:30 p.m.',
    '3:15 p.m.',
    '4:00 p.m.',
    '4:45 p.m.',
    '5:30 p.m.',
    '6:15 p.m.',
    '7:00 p.m.',
    '7:45 p.m.',
    '8:30 p.m.',
  ];

  // Enviar reserva por WhatsApp
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    setTouched({
      clientName: true,
      date: true,
    });

    const nameErr = validateClientName(form.clientName);
    const dateErr = validateDate(form.date);

    if (nameErr || dateErr) {
      setErrorMessage(
        'Por favor, completa los campos requeridos con información válida.'
      );
      return;
    }

    const serviceName =
      selectedService?.name || 'Servicio de barbería';

    const priceFormatted =
      `${config.currencySymbol} ${selectedService?.samplePrice ?? 0}`;

    const [year, month, day] = form.date.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    // Mensaje sin emojis y con etiquetas en negrita
    const message = [
      `Hola ${config.name}!`,
      '',
      'SOLICITUD DE RESERVA',
      '',
      `*Servicio:* ${serviceName}`,
      `*Precio:* ${priceFormatted}`,
      `*Nombre completo:* ${form.clientName.trim()}`,
      `*Fecha:* ${formattedDate}`,
      `*Hora:* ${form.time}`,
      `*Nota adicional:* ${form.extraNotes.trim() || 'Sin nota adicional'}`,
      '',
      'Por favor, quisiera confirmar la disponibilidad de este horario.',
      '',
      'Muchas gracias.',
    ].join('\n');

    const waUrl = buildWhatsAppLink(config.phoneWhatsapp, message);

    setIsSubmitting(true);

    // Abrir WhatsApp
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    setIsSubmitting(false);
  };

  const clientNameError = validateClientName(form.clientName);
  const dateError = validateDate(form.date);

  return (
    <section id="reservas" className="py-16 lg:py-24 bg-[#0a0b0d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#121318] border border-[#22242d] p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* COLUMNA 1: INFORMACIÓN */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[#191b22] border border-[#2c2f3b] flex items-center justify-center text-[#F0B247]">
                    <Calendar className="w-5 h-5" />
                  </div>

                  <h2 className="font-sans font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
                    AGENDA TU CITA
                  </h2>
                </div>

                <p className="text-xs text-neutral-400 mb-8 pl-1">
                  Rápido, fácil y sin complicaciones.
                </p>

                <div className="space-y-5">
                  <div className="flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-[#F0B247] text-black font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase">
                        Selecciona el servicio
                      </h3>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Elige el corte o servicio que deseas.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-[#F0B247] text-black font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase">
                        Elige la fecha y hora
                      </h3>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Disponibilidad coordinada al instante.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-[#F0B247] text-black font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase">
                        Confirma tu cita
                      </h3>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Te contactaremos por WhatsApp.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-800/80 text-[11px] text-neutral-400">
                La cita queda pendiente de confirmación según la agenda en el local.
              </div>
            </div>

            {/* COLUMNA 2: FORMULARIO */}
            <div className="lg:col-span-4 bg-[#171820] p-6 rounded-2xl border border-[#262833]">
              <form onSubmit={handleSubmit} noValidate className="space-y-4">

                {/* Servicio */}
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Servicio
                  </label>

                  <select
                    value={form.serviceId}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        serviceId: e.target.value,
                      }));
                      onSelectServiceId(e.target.value);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1d1f27] border border-[#2f3240] text-white text-xs focus:border-[#F0B247] focus:outline-none transition-colors"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({config.currencySymbol} {s.samplePrice})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nombre */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="booking-client-name"
                      className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider"
                    >
                      Tu Nombre Completo *
                    </label>

                    {touched.clientName && !clientNameError && (
                      <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Válido
                      </span>
                    )}
                  </div>

                  <input
                    id="booking-client-name"
                    type="text"
                    value={form.clientName}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        clientName: e.target.value,
                      }));

                      if (!touched.clientName) {
                        setTouched((prev) => ({
                          ...prev,
                          clientName: true,
                        }));
                      }
                    }}
                    onBlur={() =>
                      setTouched((prev) => ({
                        ...prev,
                        clientName: true,
                      }))
                    }
                    placeholder="Ej. Carlos Mendoza"
                    aria-invalid={touched.clientName && Boolean(clientNameError)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#1d1f27] border border-[#2f3240] text-white placeholder-neutral-500 focus:border-[#F0B247] focus:outline-none"
                  />

                  {touched.clientName && clientNameError && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-red-400 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{clientNameError}</span>
                    </div>
                  )}
                </div>

                {/* Fecha y hora */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="booking-date"
                        className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider truncate"
                      >
                        Fecha *
                      </label>

                      {touched.date && !dateError && (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      )}
                    </div>

                    <input
                      id="booking-date"
                      type="date"
                      min={todayStr}
                      value={form.date}
                      onChange={(e) => {
                        setForm((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }));

                        if (!touched.date) {
                          setTouched((prev) => ({
                            ...prev,
                            date: true,
                          }));
                        }
                      }}
                      onBlur={() =>
                        setTouched((prev) => ({
                          ...prev,
                          date: true,
                        }))
                      }
                      aria-invalid={touched.date && Boolean(dateError)}
                      className="w-full min-w-0 px-2.5 sm:px-3 py-2.5 rounded-xl text-xs font-mono bg-[#1d1f27] border border-[#2f3240] text-white focus:border-[#F0B247] focus:outline-none"
                    />

                    {touched.date && dateError && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-red-400">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{dateError}</span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Hora
                    </label>

                    <select
                      value={form.time}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          time: e.target.value,
                        }))
                      }
                      className="w-full px-2.5 sm:px-3 py-2.5 rounded-xl bg-[#1d1f27] border border-[#2f3240] text-white text-xs font-mono focus:border-[#F0B247] focus:outline-none"
                    >
                      {timeOptions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Nota adicional */}
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Nota adicional (opcional)
                  </label>

                  <input
                    type="text"
                    value={form.extraNotes}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        extraNotes: e.target.value,
                      }))
                    }
                    placeholder="Ej. Corte bajo, quiero diseño..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1d1f27] border border-[#2f3240] text-white placeholder-neutral-500 text-xs focus:border-[#F0B247] focus:outline-none"
                  />
                </div>

                {/* Errores */}
                {errorMessage && (
                  <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800 text-[11px] text-red-300 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* ÚNICO BOTÓN DE RESERVA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-black bg-[#F0B247] hover:bg-[#fabc55] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#F0B247]/20 disabled:opacity-50"
                >
                  <MessageSquare className="w-4 h-4 fill-black" />
                  <span>
                    {isSubmitting ? 'Abriendo WhatsApp...' : 'Reservar por WhatsApp'}
                  </span>
                </button>
              </form>
            </div>

            {/* COLUMNA 3: IMAGEN DEL SERVICIO */}
            <div
              key={selectedService?.id || 'default'}
              className="lg:col-span-4 relative rounded-2xl overflow-hidden bg-black aspect-[4/3] lg:aspect-[3/4] border border-[#282a36]"
            >
              <img
                src={selectedServiceImage}
                alt={selectedService?.name || 'Servicio de barbería FAST CUT'}
                onError={(e) => {
                  const img = e.currentTarget;
                  img.onerror = null;
                  img.src =
                    '/src/assets/images/barber_service_beard_1793125288609.jpg';
                }}
                className="w-full h-full object-cover transition-all duration-500"
                referrerPolicy="no-referrer"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

              {/* LOGOTIPO */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-center">
                <div className="px-4 py-2 rounded-xl bg-black/70 backdrop-blur-md border border-[#F0B247]/40 flex flex-col items-center">
                  <CrownLogo className="w-5 h-5 text-[#F0B247]" />
                  <span className="font-extrabold text-white text-xs tracking-wider">
                    FAST CUT
                  </span>
                  <span className="text-[8px] text-[#F0B247] uppercase tracking-[0.2em] font-medium">
                    BARBER STUDIO
                  </span>
                </div>
              </div>

              {/* TEXTO DINÁMICO DEL SERVICIO */}
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-xs font-bold text-white uppercase tracking-wider">
                  {selectedService?.name || 'Atención Profesional'}
                </p>
                <p className="text-[11px] text-neutral-300 mt-1">
                  {selectedService?.description ||
                    'Cuidado al detalle en cada servicio'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};