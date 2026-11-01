import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { BookingSection } from './components/BookingSection';
import { GallerySection } from './components/GallerySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { AboutSection } from './components/AboutSection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';
import { StudioSettingsModal } from './components/StudioSettingsModal';
import { ScrollReveal } from './components/ScrollReveal';

import {
  INITIAL_STUDIO_CONFIG,
  INITIAL_SERVICES,
  INITIAL_BARBERS,
  INITIAL_GALLERY,
  INITIAL_TESTIMONIALS
} from './data/initialData';

import {
  StudioConfig,
  ServiceItem,
  GalleryItem,
  Testimonial
} from './types';

import {
  fetchContent,
  saveServices,
  saveGallery,
  saveStudioConfig,
  saveTestimonials,
  resetContentToDefaults
} from './services/api';

import { buildWhatsAppLink } from './utils/whatsapp';

export default function App() {
  // Configuración inicial
  const [config, setConfig] = useState<StudioConfig>(() => {
    try {
      const saved = localStorage.getItem('fastcut_studio_config');
      if (saved) return JSON.parse(saved);
    } catch {
      // Usar configuración inicial
    }
    return INITIAL_STUDIO_CONFIG;
  });

  // Servicios
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem('fastcut_studio_services');
      if (saved) return JSON.parse(saved);
    } catch {
      // Usar servicios iniciales
    }
    return INITIAL_SERVICES;
  });

  // Galería
  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('fastcut_studio_gallery');
      if (saved) return JSON.parse(saved);
    } catch {
      // Usar galería inicial
    }
    return INITIAL_GALLERY;
  });

  // Testimonios
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem('fastcut_studio_testimonials');
      if (saved) return JSON.parse(saved);
    } catch {
      // Usar testimonios iniciales
    }
    return INITIAL_TESTIMONIALS;
  });

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    services[1]?.id || 'corte-fade'
  );

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sincronizar con el servidor
  useEffect(() => {
    fetchContent()
      .then((data) => {
        if (data.config) {
          setConfig(data.config);
          localStorage.setItem(
            'fastcut_studio_config',
            JSON.stringify(data.config)
          );
        }

        if (Array.isArray(data.services) && data.services.length > 0) {
          setServices(data.services);
          localStorage.setItem(
            'fastcut_studio_services',
            JSON.stringify(data.services)
          );
        }

        if (Array.isArray(data.gallery) && data.gallery.length > 0) {
          setGallery(data.gallery);
          localStorage.setItem(
            'fastcut_studio_gallery',
            JSON.stringify(data.gallery)
          );
        }

        if (Array.isArray(data.testimonials) && data.testimonials.length > 0) {
          setTestimonials(data.testimonials);
          localStorage.setItem(
            'fastcut_studio_testimonials',
            JSON.stringify(data.testimonials)
          );
        }
      })
      .catch((err) => {
        console.warn(
          'Backend no disponible o usando caché local:',
          err
        );
      });
  }, []);

  // Guardar configuración
  const handleSaveConfig = async (newConfig: StudioConfig) => {
    setConfig(newConfig);

    try {
      localStorage.setItem(
        'fastcut_studio_config',
        JSON.stringify(newConfig)
      );
      await saveStudioConfig(newConfig);
    } catch (err) {
      console.error('Error guardando configuración:', err);
    }
  };

  // Guardar servicios
  const handleSaveServices = async (
    newServices: ServiceItem[],
    action: 'create' | 'update' | 'delete' | 'set_all' = 'set_all',
    item?: ServiceItem,
    id?: string
  ) => {
    setServices(newServices);

    try {
      localStorage.setItem(
        'fastcut_studio_services',
        JSON.stringify(newServices)
      );

      await saveServices(action, {
        service: item,
        serviceId: id,
        services: newServices
      });
    } catch (err) {
      console.error('Error sincronizando servicios:', err);
    }
  };

  // Guardar galería
  const handleSaveGallery = async (
    newGallery: GalleryItem[],
    action: 'create' | 'delete' | 'set_all' = 'set_all',
    item?: GalleryItem,
    id?: string
  ) => {
    setGallery(newGallery);

    try {
      localStorage.setItem(
        'fastcut_studio_gallery',
        JSON.stringify(newGallery)
      );

      await saveGallery(action, {
        item,
        itemId: id,
        gallery: newGallery
      });
    } catch (err) {
      console.error('Error sincronizando galería:', err);
    }
  };

  // Guardar testimonios
  const handleSaveTestimonials = async (
    newTestimonials: Testimonial[]
  ) => {
    setTestimonials(newTestimonials);

    try {
      localStorage.setItem(
        'fastcut_studio_testimonials',
        JSON.stringify(newTestimonials)
      );

      await saveTestimonials(newTestimonials);
    } catch (err) {
      console.error('Error sincronizando testimonios:', err);
    }
  };

  // Registrar una nueva reseña
  const handleClientReviewSubmitted = (
    _newReview: Testimonial,
    allReviews: Testimonial[]
  ) => {
    setTestimonials(allReviews);

    try {
      localStorage.setItem(
        'fastcut_studio_testimonials',
        JSON.stringify(allReviews)
      );
    } catch {
      // Ignorar error de almacenamiento
    }
  };

  // Restaurar valores predeterminados
  const handleResetDefaults = async () => {
    try {
      const data = await resetContentToDefaults();

      if (data.config) setConfig(data.config);
      if (data.services) setServices(data.services);
      if (data.gallery) setGallery(data.gallery);
      if (data.testimonials) setTestimonials(data.testimonials);

      localStorage.setItem(
        'fastcut_studio_config',
        JSON.stringify(data.config)
      );
      localStorage.setItem(
        'fastcut_studio_services',
        JSON.stringify(data.services)
      );
      localStorage.setItem(
        'fastcut_studio_gallery',
        JSON.stringify(data.gallery)
      );
      localStorage.setItem(
        'fastcut_studio_testimonials',
        JSON.stringify(data.testimonials)
      );
    } catch (err) {
      setConfig(INITIAL_STUDIO_CONFIG);
      setServices(INITIAL_SERVICES);
      setGallery(INITIAL_GALLERY);
      setTestimonials(INITIAL_TESTIMONIALS);

      localStorage.removeItem('fastcut_studio_config');
      localStorage.removeItem('fastcut_studio_services');
      localStorage.removeItem('fastcut_studio_gallery');
      localStorage.removeItem('fastcut_studio_testimonials');
    }
  };

  // Actualizar precio de un servicio
  const handleUpdateServicePrice = (
    serviceId: string,
    newPrice: number
  ) => {
    const updated = services.map((s) =>
      s.id === serviceId
        ? { ...s, samplePrice: newPrice }
        : s
    );

    const targetService = updated.find(
      (s) => s.id === serviceId
    );

    handleSaveServices(updated, 'update', targetService);
  };

  // Seleccionar servicio para reservar
  const handleSelectServiceForBooking = (serviceId: string) => {
    setSelectedServiceId(serviceId);
  };

  // Seleccionar estilo desde la galería
  const handleSelectStyleForBooking = (styleTitle: string) => {
    const titleLower = styleTitle.toLowerCase();

    const matchedService = services.find((s) => {
      const sName = s.name.toLowerCase();

      return (
        titleLower.includes(sName) ||
        sName.includes(titleLower) ||
        (titleLower.includes('barba') && s.category === 'barba') ||
        (titleLower.includes('fade') && s.category === 'corte') ||
        (titleLower.includes('diseño') && s.category === 'diseno') ||
        (titleLower.includes('niño') && s.category === 'ninos') ||
        (titleLower.includes('tint') && s.category === 'color')
      );
    });

    if (matchedService) {
      setSelectedServiceId(matchedService.id);
    } else if (services[0]) {
      setSelectedServiceId(services[0].id);
    }
  };

  // Desplazarse hasta las reservas
  const handleScrollToBooking = () => {
    const el = document.getElementById('reservas');

    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Enlace de WhatsApp
  const floatingWhatsAppUrl = buildWhatsAppLink(
    config.phoneWhatsapp,
    `Hola ${config.name}, me gustaría consultar disponibilidad de horarios para un servicio.`
  );

  return (
    <div className="min-h-screen bg-[#080809] text-neutral-100 flex flex-col font-sans pb-16 lg:pb-0 overflow-x-hidden selection:bg-[#F0B247]/30 selection:text-[#F0B247]">

      <Navbar
        config={config}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onSelectBooking={handleScrollToBooking}
      />

      <main className="flex-1">

        <Hero
          config={config}
          onBookClick={handleScrollToBooking}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <ScrollReveal direction="up" duration={700}>
          <ServicesSection
            services={services}
            config={config}
            onSelectServiceForBooking={handleSelectServiceForBooking}
            onUpdateServicePrice={handleUpdateServicePrice}
          />
        </ScrollReveal>

        <ScrollReveal direction="up" duration={700}>
          <BookingSection
            services={services}
            barbers={INITIAL_BARBERS}
            config={config}
            selectedServiceId={selectedServiceId}
            onSelectServiceId={setSelectedServiceId}
          />
        </ScrollReveal>

        <ScrollReveal direction="up" duration={700}>
          <GallerySection
            galleryItems={gallery}
            onSelectStyleForBooking={handleSelectStyleForBooking}
          />
        </ScrollReveal>

        <ScrollReveal direction="up" duration={700}>
          <TestimonialsSection
            testimonials={testimonials}
            config={config}
            services={services}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onBookClick={handleScrollToBooking}
            onReviewSubmitted={handleClientReviewSubmitted}
          />
        </ScrollReveal>

        <ScrollReveal direction="up" duration={700}>
          <AboutSection config={config} />
        </ScrollReveal>

        <ScrollReveal direction="up" duration={700}>
          <LocationSection
            config={config}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        </ScrollReveal>

      </main>

      <Footer
        config={config}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Botón flotante de WhatsApp */}
      <div className="hidden lg:flex fixed bottom-6 right-6 z-40 flex-col items-end gap-2">
        <a
          href={floatingWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir WhatsApp de FAST CUT BARBER STUDIO"
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] text-black font-bold text-xs uppercase tracking-wider shadow-2xl shadow-[#25D366]/40 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <MessageSquare className="w-5 h-5 fill-current" />
          <span>WhatsApp Disponible</span>
        </a>
      </div>

      <StudioSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        services={services}
        onSaveServices={handleSaveServices}
        gallery={gallery}
        onSaveGallery={handleSaveGallery}
        testimonials={testimonials}
        onSaveTestimonials={handleSaveTestimonials}
        onResetDefaults={handleResetDefaults}
      />

    </div>
  );
}