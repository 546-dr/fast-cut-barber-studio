import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// High limit to support client image uploads (base64 compressed images)
app.use(express.json({ limit: '20mb' }));

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'studio-store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data if database does not exist (no public demo credentials)
const INITIAL_DATA = {
  adminPinHash: '',
  config: {
    name: "FAST CUT BARBER STUDIO",
    slogan: "ESTILO QUE TE DEFINE",
    tagline: "Cortes modernos, clásicos y personalizados con la mejor atención.",
    phoneWhatsapp: "51927168320",
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
    websiteUrl: "https://fastcutbarber.com"
  },
  services: [
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
  ],
  gallery: [
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
  ],
  testimonials: [
    {
      id: "test-1",
      name: "Rodrigo Vásquez",
      service: "Corte Fade + Perfilado",
      rating: 5,
      comment: "El mejor degradado de la ciudad. La atención es impecable y respetan el turno exacto.",
      date: "Hace 2 días",
      avatarText: "RV"
    },
    {
      id: "test-2",
      name: "Manuel Dávila",
      service: "Perfilado de Barba",
      rating: 5,
      comment: "El ritual con toalla caliente y la precisión con la navaja es de otro nivel. Recomendadísimo.",
      date: "Hace 1 semana",
      avatarText: "MD"
    },
    {
      id: "test-3",
      name: "Christian Ruiz",
      service: "Tinturado Platinado",
      rating: 5,
      comment: "Lograron exactamente el tono cenizo que buscaba sin maltratar mi cabello. Grandes profesionales.",
      date: "Hace 2 semanas",
      avatarText: "CR"
    }
  ]
};

// Helper for secure memory-hard PIN hashing with scrypt and random salt (OWASP recommended)
function hashPinWithScrypt(pin: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(pin.trim(), salt, 64, {
    N: 16384,
    r: 8,
    p: 1,
  });
  return `scrypt$16384$8$1$${salt}$${derivedKey.toString('hex')}`;
}

// Constant-time PIN verification using scrypt and timingSafeEqual
function verifyPinWithScrypt(pin: string, storedHash: string): boolean {
  if (!storedHash || typeof storedHash !== 'string' || !storedHash.startsWith('scrypt$')) {
    return false;
  }
  const parts = storedHash.split('$');
  if (parts.length !== 6) {
    return false;
  }
  const [_, nStr, rStr, pStr, salt, hashHex] = parts;
  const N = parseInt(nStr, 10);
  const r = parseInt(rStr, 10);
  const p = parseInt(pStr, 10);

  if (isNaN(N) || isNaN(r) || isNaN(p) || !salt || !hashHex) {
    return false;
  }

  try {
    const derivedKey = crypto.scryptSync(pin.trim(), salt, 64, { N, r, p });
    const originalKey = Buffer.from(hashHex, 'hex');
    if (derivedKey.length !== originalKey.length) {
      return false;
    }
    return crypto.timingSafeEqual(derivedKey, originalKey);
  } catch {
    return false;
  }
}

// Database helper functions with atomic writes and safe fallbacks
function readStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        let changed = false;
        // Purge any legacy plain adminPin property
        if ('adminPin' in parsed) {
          delete parsed.adminPin;
          changed = true;
        }
        if (changed) {
          writeStore(parsed);
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading data store, reinitializing:', err);
  }
  // Initialize file safely
  try {
    const initialStr = JSON.stringify(INITIAL_DATA, null, 2);
    fs.writeFileSync(DATA_FILE, initialStr, 'utf-8');
  } catch (writeErr) {
    console.error('Error creating initial data file:', writeErr);
  }
  return { ...INITIAL_DATA };
}

function writeStore(data: any) {
  const serialized = JSON.stringify(data, null, 2);
  const tempFile = `${DATA_FILE}.${Date.now()}.${Math.random().toString(36).slice(2, 7)}.tmp`;
  try {
    // Atomic write pattern: write to temporary file first, then atomically rename
    fs.writeFileSync(tempFile, serialized, 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);
  } catch (err) {
    console.error('Error in atomic write, fallback to direct write:', err);
    try {
      fs.writeFileSync(DATA_FILE, serialized, 'utf-8');
    } catch (directErr) {
      console.error('Fatal: Failed to write to store:', directErr);
    }
  }
}

// Helper to determine if the owner PIN has been set
function isPinConfigured(): boolean {
  if (process.env.ADMIN_PIN && process.env.ADMIN_PIN.trim().length >= 4) {
    return true;
  }
  const store = readStore();
  return Boolean(store.adminPinHash && store.adminPinHash.length > 0);
}

// Active session tokens with expiration tracking (2 hours TTL)
interface AdminSession {
  token: string;
  createdAt: number;
  expiresAt: number;
}

const TOKEN_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours validity
const activeSessions = new Map<string, AdminSession>();

function generateSessionToken(): string {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  activeSessions.set(token, {
    token,
    createdAt: now,
    expiresAt: now + TOKEN_TTL_MS,
  });
  return token;
}

// Periodic cleanup of expired session tokens
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of activeSessions.entries()) {
    if (now > session.expiresAt) {
      activeSessions.delete(token);
    }
  }
}, 15 * 60 * 1000).unref();

// Failed login attempt tracking for brute-force protection
const failedLoginAttempts = new Map<string, { count: number; lockedUntil: number }>();

// Middleware to authenticate owner requests and enforce token expiration
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso denegado: se requiere autenticación de administrador.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado: token no proporcionado.' });
  }

  const session = activeSessions.get(token);
  if (!session) {
    return res.status(401).json({ error: 'Sesión no autorizada o token inexistente.' });
  }

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return res.status(401).json({ error: 'Sesión expirada. Por favor vuelve a ingresar tu PIN de propietario.' });
  }

  return next();
}

/* ========================================================
   API ROUTES & DOWNLOADS
======================================================== */

// Direct download endpoints for the project package
app.get(['/download', '/api/download', '/api/download/zip', '/fastcut-barber-studio.zip'], (_req, res) => {
  const publicZip = path.join(__dirname, 'public', 'fastcut-barber-studio.zip');
  const rootZip = path.join(__dirname, 'fastcut-barber-studio.zip');
  const zipPath = fs.existsSync(publicZip) ? publicZip : fs.existsSync(rootZip) ? rootZip : null;
  
  if (zipPath) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="fastcut-barber-studio.zip"');
    return res.sendFile(zipPath);
  }
  return res.status(404).send('Archivo ZIP no encontrado.');
});

app.get(['/api/download/tar', '/fastcut-barber-studio.tar.gz'], (_req, res) => {
  const publicTar = path.join(__dirname, 'public', 'fastcut-barber-studio.tar.gz');
  const rootTar = path.join(__dirname, 'fastcut-barber-studio.tar.gz');
  const tarPath = fs.existsSync(publicTar) ? publicTar : fs.existsSync(rootTar) ? rootTar : null;
  
  if (tarPath) {
    res.setHeader('Content-Type', 'application/gzip');
    res.setHeader('Content-Disposition', 'attachment; filename="fastcut-barber-studio.tar.gz"');
    return res.sendFile(tarPath);
  }
  return res.status(404).send('Archivo TAR.GZ no encontrado.');
});

// Public endpoint: Fetch all content
app.get('/api/content', (_req, res) => {
  const store = readStore();
  return res.json({
    success: true,
    config: store.config,
    services: store.services,
    gallery: store.gallery,
    testimonials: store.testimonials,
  });
});

// Public endpoint: Check if owner PIN has been configured
app.get('/api/auth/status', (_req, res) => {
  return res.json({
    isConfigured: isPinConfigured()
  });
});

// Secure Onboarding: Initial Owner PIN Setup (only available when no PIN is set)
app.post('/api/auth/setup-pin', (req, res) => {
  if (isPinConfigured()) {
    return res.status(400).json({
      error: 'El PIN de propietario ya está configurado. Por favor inicia sesión con tu PIN privado.'
    });
  }

  const { pin } = req.body;
  if (!pin || typeof pin !== 'string' || pin.trim().length < 4) {
    return res.status(400).json({ error: 'El PIN de seguridad debe tener al menos 4 caracteres o dígitos.' });
  }

  const trimmedPin = pin.trim();
  const store = readStore();
  store.adminPinHash = hashPinWithScrypt(trimmedPin);
  delete store.adminPin;
  writeStore(store);

  const token = generateSessionToken();

  return res.json({
    success: true,
    token,
    message: 'PIN de propietario configurado exitosamente.',
  });
});

// Admin login endpoint with brute-force rate-limiting
app.post('/api/auth/login', (req, res) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const attemptRecord = failedLoginAttempts.get(clientIp);

  if (attemptRecord && attemptRecord.lockedUntil > now) {
    const remainingSeconds = Math.ceil((attemptRecord.lockedUntil - now) / 1000);
    return res.status(429).json({
      error: `Demasiados intentos fallidos. Por seguridad, espera ${remainingSeconds} segundos antes de volver a intentar.`
    });
  }

  if (!isPinConfigured()) {
    return res.status(400).json({
      error: 'El PIN de propietario aún no ha sido configurado. Por favor completa la configuración inicial.'
    });
  }

  const { pin } = req.body;
  if (!pin || typeof pin !== 'string') {
    return res.status(400).json({ error: 'Por favor ingresa el PIN de acceso.' });
  }

  const trimmedPin = pin.trim();
  const store = readStore();

  // Authenticate against ADMIN_PIN environment variable or securely stored scrypt hash
  let isMatch = false;
  if (process.env.ADMIN_PIN && process.env.ADMIN_PIN.trim() === trimmedPin) {
    isMatch = true;
  }
  if (store.adminPinHash && verifyPinWithScrypt(trimmedPin, store.adminPinHash)) {
    isMatch = true;
  }

  if (!isMatch) {
    const currentCount = (attemptRecord?.count || 0) + 1;
    let lockedUntil = 0;
    if (currentCount >= 5) {
      lockedUntil = now + 60 * 1000; // 1-minute lockout after 5 consecutive failures
    }
    failedLoginAttempts.set(clientIp, { count: currentCount, lockedUntil });
    return res.status(401).json({ error: 'PIN de acceso incorrecto. Verifica el código e intenta nuevamente.' });
  }

  // Clear failed attempt counter on successful login
  failedLoginAttempts.delete(clientIp);

  const token = generateSessionToken();

  return res.json({
    success: true,
    token,
    message: 'Bienvenido al panel de control de FAST CUT BARBER STUDIO.',
  });
});

// Change admin PIN (protected by requireAdmin with expiring token)
app.post('/api/auth/change-pin', requireAdmin, (req, res) => {
  const { newPin } = req.body;
  if (!newPin || typeof newPin !== 'string' || newPin.trim().length < 4) {
    return res.status(400).json({ error: 'El PIN debe tener al menos 4 caracteres o dígitos.' });
  }

  const store = readStore();
  store.adminPinHash = hashPinWithScrypt(newPin.trim());
  delete store.adminPin;
  writeStore(store);

  // Invalidate previous sessions and issue a fresh session token
  activeSessions.clear();
  const newToken = generateSessionToken();

  return res.json({ success: true, token: newToken, message: 'PIN de seguridad actualizado correctamente.' });
});

function sanitizeService(s: any) {
  if (!s || typeof s !== 'object') return null;
  return {
    id: String(s.id || `servicio-${Date.now()}`),
    name: String(s.name || 'Servicio').trim(),
    category: String(s.category || 'corte').trim(),
    description: String(s.description || '').trim(),
    durationMinutes: Math.max(5, parseInt(s.durationMinutes) || 30),
    samplePrice: Math.max(0, typeof s.samplePrice === 'number' ? s.samplePrice : (parseFloat(s.samplePrice) || 0)),
    image: String(s.image || '/src/assets/images/barber_service_fade_1793125288978.jpg').trim(),
    badge: s.badge ? String(s.badge).trim() : undefined,
  };
}

// Manage Cuts & Services (Add, Edit, Delete)
app.post('/api/content/services', requireAdmin, (req, res) => {
  const { action, service, serviceId, services } = req.body;
  const store = readStore();

  if (action === 'set_all' && Array.isArray(services)) {
    store.services = services.map(sanitizeService).filter(Boolean);
  } else if (action === 'create' && service) {
    const clean = sanitizeService(service);
    if (clean) {
      store.services.push(clean);
    }
  } else if (action === 'update' && service && service.id) {
    const clean = sanitizeService(service);
    if (clean) {
      const idx = store.services.findIndex((s: any) => s.id === clean.id);
      if (idx !== -1) {
        store.services[idx] = { ...store.services[idx], ...clean };
      } else {
        store.services.push(clean);
      }
    }
  } else if (action === 'delete' && serviceId) {
    store.services = store.services.filter((s: any) => s.id !== serviceId);
  } else {
    return res.status(400).json({ error: 'Acción de servicio no reconocida.' });
  }

  writeStore(store);
  return res.json({ success: true, services: store.services });
});

// Manage Gallery Items (Add, Delete)
app.post('/api/content/gallery', requireAdmin, (req, res) => {
  const { action, item, itemId, gallery } = req.body;
  const store = readStore();

  if (action === 'set_all' && Array.isArray(gallery)) {
    store.gallery = gallery;
  } else if (action === 'create' && item) {
    const newItem = {
      ...item,
      id: item.id || `gal-${Date.now()}`
    };
    store.gallery.unshift(newItem); // put at start
  } else if (action === 'delete' && itemId) {
    store.gallery = store.gallery.filter((g: any) => g.id !== itemId);
  } else {
    return res.status(400).json({ error: 'Acción de galería no reconocida.' });
  }

  writeStore(store);
  return res.json({ success: true, gallery: store.gallery });
});

// Manage Studio Config
app.post('/api/content/config', requireAdmin, (req, res) => {
  const { config } = req.body;
  if (!config) {
    return res.status(400).json({ error: 'Configuración requerida.' });
  }

  const store = readStore();
  store.config = { ...store.config, ...config };
  writeStore(store);

  return res.json({ success: true, config: store.config });
});

// Manage Testimonials
app.post('/api/content/testimonials', requireAdmin, (req, res) => {
  const { testimonials } = req.body;
  if (!Array.isArray(testimonials)) {
    return res.status(400).json({ error: 'Lista de testimonios inválida.' });
  }

  const store = readStore();
  store.testimonials = testimonials;
  writeStore(store);

  return res.json({ success: true, testimonials: store.testimonials });
});

// Client Public Submission: Add Review
app.post('/api/testimonials/submit', (req, res) => {
  const { name, rating, comment, service, avatarUrl } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Por favor ingresa tu nombre (mínimo 2 letras).' });
  }

  if (!comment || typeof comment !== 'string' || comment.trim().length < 5) {
    return res.status(400).json({ error: 'Por favor escribe tu reseña (mínimo 5 caracteres).' });
  }

  const cleanRating = Math.min(5, Math.max(1, Math.round(Number(rating) || 5)));
  const cleanName = name.trim().slice(0, 50);
  const cleanComment = comment.trim().slice(0, 600);
  const cleanService = (service && typeof service === 'string' && service.trim())
    ? service.trim().slice(0, 50)
    : 'Corte & Estilo';

  // Generate initials for avatarText
  const parts = cleanName.split(/\s+/).filter(Boolean);
  const avatarText = parts.length > 1
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : cleanName.slice(0, 2).toUpperCase();

  const store = readStore();
  if (!Array.isArray(store.testimonials)) {
    store.testimonials = [];
  }

  // Format today's date in local readable format
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const dateFormatted = `${day}/${month}/${year}`;

  const newTestimonial = {
    id: `test-${Date.now()}`,
    name: cleanName,
    service: cleanService,
    rating: cleanRating,
    comment: cleanComment,
    date: `Hoy (${dateFormatted})`,
    avatarText,
    avatarUrl: (avatarUrl && typeof avatarUrl === 'string' && (avatarUrl.startsWith('data:image') || avatarUrl.startsWith('http') || avatarUrl.startsWith('/')))
      ? avatarUrl
      : undefined
  };

  store.testimonials.unshift(newTestimonial);
  writeStore(store);

  return res.json({
    success: true,
    message: '¡Gracias por tu reseña! Ha sido publicada exitosamente.',
    testimonial: newTestimonial,
    testimonials: store.testimonials
  });
});

// Restore Factory Defaults
app.post('/api/content/reset', requireAdmin, (_req, res) => {
  const store = readStore();
  const currentPinHash = store.adminPinHash; // preserve owner pin hash
  const resetData = {
    ...INITIAL_DATA,
    adminPinHash: currentPinHash
  };
  writeStore(resetData);

  return res.json({
    success: true,
    message: 'Datos restaurados a los valores iniciales de fábrica.',
    config: resetData.config,
    services: resetData.services,
    gallery: resetData.gallery,
    testimonials: resetData.testimonials
  });
});

/* ========================================================
   FRONTEND VITE INTEGRATION
======================================================== */
async function startServer() {
  const distPath = path.join(__dirname, 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd && hasDist) {
    // Serve production static build
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Vite middleware in dev or when dist is not built
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FAST CUT BARBER STUDIO] Full-stack Server running at http://0.0.0.0:${PORT} (env: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();
