import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { ServiceItem, StudioConfig } from '../types';

interface ServicesSectionProps {
  services: ServiceItem[];
  config: StudioConfig;
  onSelectServiceForBooking: (serviceId: string) => void;
  onUpdateServicePrice: (serviceId: string, newPrice: number) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  config,
  onSelectServiceForBooking,
}) => {

  const handleServiceClick = (serviceId: string) => {
    onSelectServiceForBooking(serviceId);
    const el = document.getElementById('reservas');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="servicios" className="py-16 lg:py-24 bg-[#0a0b0d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-10">
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
            <Star className="w-3.5 h-3.5 text-[#F0B247] fill-current" />
            <span>NUESTROS SERVICIOS</span>
          </div>

          <h2 className="font-sans font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight">
            CORTES Y ESTILO PARA TI
          </h2>

          <p className="text-sm text-neutral-400 mt-1">
            Elige el servicio que más te guste y agenda tu cita fácilmente.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceClick(service.id)}
              className="group cursor-pointer rounded-2xl bg-[#121318] border border-[#22242d] hover:border-[#F0B247]/60 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-[#F0B247]/10"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-[#181920]">
                <img
                  src={service.image}
                  alt={service.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      '/src/assets/images/barber_service_fade_1793125288978.jpg';
                  }}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-3.5 flex flex-col justify-between flex-1">
                <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-[#F0B247] transition-colors leading-snug line-clamp-1">
                  {service.name}
                </h3>

                <div className="mt-3 flex items-center justify-between">
                  <span className="font-mono font-black text-sm sm:text-base text-neutral-100">
                    {config.currencySymbol} {service.samplePrice}
                  </span>

                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F0B247] group-hover:bg-[#fabc55] flex items-center justify-center text-black shadow-md shadow-[#F0B247]/20 group-hover:translate-x-0.5 transition-all shrink-0">
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};