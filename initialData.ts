import { ServiceItem, GalleryItem, Barber, StudioConfig } from '../types';

export const INITIAL_STUDIO_CONFIG: StudioConfig = {
  name: "FAST CUT BARBER STUDIO",
  slogan: "ESTILO QUE TE DEFINE",
  tagline: "Cortes modernos, clásicos y personalizados con la mejor atención.",
  phoneWhatsapp: "51927168320", // Exactly from reference: +51 927 168 320
  phoneDisplay: "+51 927 168 320",
  address: "San Juan, Iquitos",
  city: "Referencia: Av. Principal",
  scheduleWeekday: "Lun - Sáb: 9:00 a.m. - 9:00 p.m.",
  scheduleSaturday: "Lun - Sáb: 9:00 a.m. - 9:00 p.m.",
  scheduleSunday: "Dom: 10:00 a.m. - 6:00 p.m.",
  instagram: "@fastcut.barberstudio",
  facebook: "FastCutBarberStudio",
  tiktok: "@fastcutbarber",
  currencySymbol: "S/",
  googleMapsQuery: "San Juan, Iquitos",
  websiteUrl: "https://fastcutbarber.com",
};

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: "corte-clasico",
    name: "Corte Clásico",
    category: "corte",
    description: "Corte tradicional a tijera y máquina con pulido en contornos y acabado impecable.",
    durationMinutes: 35,
    samplePrice: 20,
    image: "/src/assets/images/barber_service_classic_1793125290112.jpg",
    badge: "Clásico"
  },
  {
    id: "corte-fade",
    name: "Corte Fade",
    category: "corte",
    description: "Degradado de alta precisión (Low, Mid o High Fade) con navaja y textura superior.",
    durationMinutes: 45,
    samplePrice: 25,
    image: "/src/assets/images/barber_service_fade_1793125288978.jpg",
    badge: "Más pedido"
  },
  {
    id: "perfilado-barba",
    name: "Perfilado de Barba",
    category: "barba",
    description: "Esculpido milimétrico a navaja libre con toalla caliente y loción balsámica.",
    durationMinutes: 30,
    samplePrice: 15,
    image: "/src/assets/images/barber_service_beard_1793125288609.jpg",
    badge: "Ritual"
  },
  {
    id: "tinturado",
    name: "Tinturado",
    category: "color",
    description: "Decoloración, matiz platinado o plata cenizo y camuflaje de canas para look moderno.",
    durationMinutes: 60,
    samplePrice: 30,
    image: "/src/assets/images/barber_service_tinturado_1793125303659.jpg",
    badge: "Color"
  },
  {
    id: "disenos",
    name: "Diseños",
    category: "diseno",
    description: "Rayas de precisión, líneas geométricas y arte freestyle esculpido a navaja.",
    durationMinutes: 30,
    samplePrice: 25,
    image: "/src/assets/images/barber_service_disenos_1793125304602.jpg",
    badge: "Hair Art"
  },
  {
    id: "corte-nino",
    name: "Corte Niño",
    category: "ninos",
    description: "Atención paciente y amigable con las últimas tendencias de corte para los más pequeños.",
    durationMinutes: 30,
    samplePrice: 15,
    image: "/src/assets/images/barber_service_nino_1793125304137.jpg",
    badge: "Niños"
  }
];

export const INITIAL_BARBERS: Barber[] = [
  {
    id: "any",
    name: "Cualquier barbero disponible",
    role: "Primer turno libre",
    experience: "Máxima disponibilidad"
  },
  {
    id: "barbero-1",
    name: "Master Barber Principal",
    role: "Especialista en Fades",
    experience: "Técnica de navaja avanzada"
  },
  {
    id: "barbero-2",
    name: "Estilista Senior",
    role: "Barbas y Diseños",
    experience: "Precisión y Visagismo"
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Low Taper Fade",
    category: "Fade",
    image: "/src/assets/images/barber_service_fade_1793125288978.jpg",
    description: "Degradado bajo con textura superior definida."
  },
  {
    id: "gal-2",
    title: "Executive Side Part",
    category: "Clásico",
    image: "/src/assets/images/barber_service_classic_1793125290112.jpg",
    description: "Corte clásico con tijera y peinado estructurado."
  },
  {
    id: "gal-3",
    title: "Perfilado a Navaja",
    category: "Barba",
    image: "/src/assets/images/barber_service_beard_1793125288609.jpg",
    description: "Líneas de barba limpias y toalla caliente."
  },
  {
    id: "gal-4",
    title: "Hair Art Freestyle",
    category: "Diseños",
    image: "/src/assets/images/barber_service_disenos_1793125304602.jpg",
    description: "Diseño geométrico tallado sobre skin fade."
  },
  {
    id: "gal-5",
    title: "Platino Cenizo Crop",
    category: "Fade",
    image: "/src/assets/images/barber_service_tinturado_1793125303659.jpg",
    description: "Coloración platinada con texturizado francés."
  },
  {
    id: "gal-6",
    title: "Degradado Juvenil",
    category: "Niños",
    image: "/src/assets/images/barber_service_nino_1793125304137.jpg",
    description: "Corte moderno fresco y cómodo."
  }
];

export const STUDIO_BENEFITS = [
  {
    title: "Asesoría de Visagismo",
    description: "Analizamos la morfología de tu rostro para sugerirte el corte y la forma de barba ideales.",
    icon: "Sparkles"
  },
  {
    title: "Higiene Grado Quirúrgico",
    description: "Esterilizamos cuchillas, peines y navajas individuales descartables para cada cliente.",
    icon: "ShieldCheck"
  },
  {
    title: "Ambiente VIP",
    description: "Bebida de bienvenida, café recién molido y ambiente relajante para tu turno.",
    icon: "Coffee"
  },
  {
    title: "Puntualidad & Garantía",
    description: "Respetamos estrictamente tu horario para una experiencia ágil y sin esperas.",
    icon: "Clock"
  }
];

export const TRUST_FEATURES = [
  {
    title: "Estilo Único",
    subtitle: "Cortes personalizados",
    icon: "Diamond"
  },
  {
    title: "Barberos Profesionales",
    subtitle: "Atención de calidad",
    icon: "Scissors"
  },
  {
    title: "Clientes Satisfechos",
    subtitle: "Confianza y experiencia",
    icon: "Star"
  },
  {
    title: "Ambiente Seguro",
    subtitle: "Tu comodidad es prioridad",
    icon: "Shield"
  }
];

export const INITIAL_TESTIMONIALS = [
  {
    id: "test-1",
    name: "Rodrigo Morales",
    service: "Corte Fade & Perfilado",
    rating: 5,
    comment: "La atención es de otro nivel. El desvanecido quedó milimétrico y el ritual con toalla caliente para la barba es una experiencia obligatoria.",
    date: "Hace 3 días",
    avatarText: "RM"
  },
  {
    id: "test-2",
    name: "Alejandro Vega",
    service: "Corte Clásico Ejecutivo",
    rating: 5,
    comment: "Excelente puntualidad. Llegué con cita previa por WhatsApp y me atendieron al instante sin esperar. El ambiente y la música están impecables.",
    date: "Hace 1 semana",
    avatarText: "AV"
  },
  {
    id: "test-3",
    name: "Mateo Carranza",
    service: "Diseños & Freestyle",
    rating: 5,
    comment: "Gran precisión con la navaja libre. Le mostré una foto de lo que quería y lo dejó idéntico. Totalmente recomendado en Iquitos.",
    date: "Hace 2 semanas",
    avatarText: "MC"
  }
];
