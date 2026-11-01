import { ServiceItem, GalleryItem, StudioConfig, Testimonial } from '../types';

const ADMIN_TOKEN_KEY = 'fastcut_admin_token';

export function getAdminToken(): string | null {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string | null) {
  try {
    if (token) {
      sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
  } catch {
    // ignore
  }
}

function getAuthHeaders(): HeadersInit {
  const token = getAdminToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function fetchContent() {
  const res = await fetch('/api/content');
  if (!res.ok) {
    throw new Error('No se pudo cargar la información del servidor');
  }
  return await res.json();
}

export async function getAuthStatus(): Promise<{ isConfigured: boolean }> {
  try {
    const res = await fetch('/api/auth/status');
    if (!res.ok) return { isConfigured: true };
    return await res.json();
  } catch {
    return { isConfigured: true };
  }
}

export async function setupAdminPin(pin: string) {
  const res = await fetch('/api/auth/setup-pin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Error al configurar el PIN de seguridad');
  }
  if (data.token) {
    setAdminToken(data.token);
  }
  return data;
}

export async function loginAdmin(pin: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'PIN incorrecto');
  }
  setAdminToken(data.token);
  return data;
}

export async function changeAdminPin(newPin: string) {
  const res = await fetch('/api/auth/change-pin', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ newPin })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'No se pudo cambiar el PIN');
  }
  if (data.token) {
    setAdminToken(data.token);
  }
  return data;
}

export async function saveServices(action: 'create' | 'update' | 'delete' | 'set_all', payload: {
  service?: ServiceItem;
  serviceId?: string;
  services?: ServiceItem[];
}) {
  const res = await fetch('/api/content/services', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ action, ...payload })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Error al guardar el servicio');
  }
  return data.services as ServiceItem[];
}

export async function saveGallery(action: 'create' | 'delete' | 'set_all', payload: {
  item?: GalleryItem;
  itemId?: string;
  gallery?: GalleryItem[];
}) {
  const res = await fetch('/api/content/gallery', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ action, ...payload })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Error al actualizar la galería');
  }
  return data.gallery as GalleryItem[];
}

export async function saveStudioConfig(config: StudioConfig) {
  const res = await fetch('/api/content/config', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ config })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Error al guardar la configuración');
  }
  return data.config as StudioConfig;
}

export async function saveTestimonials(testimonials: Testimonial[]) {
  const res = await fetch('/api/content/testimonials', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ testimonials })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Error al guardar testimonios');
  }
  return data.testimonials as Testimonial[];
}

export async function resetContentToDefaults() {
  const res = await fetch('/api/content/reset', {
    method: 'POST',
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Error al restablecer valores de fábrica');
  }
  return data;
}

export async function submitClientTestimonial(data: {
  name: string;
  rating: number;
  comment: string;
  service?: string;
  avatarUrl?: string;
}) {
  const res = await fetch('/api/testimonials/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Error al publicar la reseña');
  }
  return json as {
    success: boolean;
    message: string;
    testimonial: Testimonial;
    testimonials: Testimonial[];
  };
}
