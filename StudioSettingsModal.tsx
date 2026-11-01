import React, { useState } from 'react';
import {
  X,
  Save,
  RotateCcw,
  AlertTriangle,
  Check,
  Phone,
  MapPin,
  Clock,
  Share2,
  Star,
  Plus,
  Trash2,
  Scissors,
  Image as ImageIcon,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  Upload,
  Edit2,
  Cloud,
  Database,
  CheckCircle2,
  ExternalLink,
  Store,
  Globe,
  Download,
  Package,
  FileArchive
} from 'lucide-react';
import { StudioConfig, ServiceItem, GalleryItem, Testimonial } from '../types';
import { processImageFile } from '../utils/imageUtils';
import {
  getAdminToken,
  setAdminToken,
  loginAdmin,
  changeAdminPin,
  getAuthStatus,
  setupAdminPin
} from '../services/api';
import { CrownLogo } from './CrownLogo';

interface StudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: StudioConfig;
  onSaveConfig: (newConfig: StudioConfig) => Promise<void> | void;
  services: ServiceItem[];
  onSaveServices: (
    newServices: ServiceItem[],
    action?: 'create' | 'update' | 'delete' | 'set_all',
    item?: ServiceItem,
    id?: string
  ) => Promise<void> | void;
  gallery: GalleryItem[];
  onSaveGallery: (
    newGallery: GalleryItem[],
    action?: 'create' | 'delete' | 'set_all',
    item?: GalleryItem,
    id?: string
  ) => Promise<void> | void;
  testimonials: Testimonial[];
  onSaveTestimonials: (newTestimonials: Testimonial[]) => Promise<void> | void;
  onResetDefaults: () => Promise<void> | void;
}

export const StudioSettingsModal: React.FC<StudioSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  services,
  onSaveServices,
  gallery,
  onSaveGallery,
  testimonials,
  onSaveTestimonials,
  onResetDefaults,
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(getAdminToken()));
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Initial Onboarding PIN Setup state (when no PIN is configured on the server)
  const [isPinConfigured, setIsPinConfigured] = useState<boolean | null>(null);
  const [setupPinInput, setSetupPinInput] = useState('');
  const [confirmSetupPinInput, setConfirmSetupPinInput] = useState('');
  const [setupPinError, setSetupPinError] = useState<string | null>(null);
  const [isSettingUpPin, setIsSettingUpPin] = useState(false);

  // Active Tab: cuts & services, gallery, business info, testimonials, security & cloud
  const [activeTab, setActiveTab] = useState<'services' | 'gallery' | 'business' | 'testimonials' | 'security'>('services');

  // Business config form
  const [configForm, setConfigForm] = useState<StudioConfig>({ ...config });

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Service form state (for Add / Edit)
  const [isEditingService, setIsEditingService] = useState(false);
  const [serviceFormData, setServiceFormData] = useState<Partial<ServiceItem>>({
    id: '',
    name: '',
    category: 'corte',
    description: '',
    samplePrice: 25,
    durationMinutes: 40,
    image: '',
    badge: '',
  });

  // Gallery form state (for Add photo)
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [galleryFormData, setGalleryFormData] = useState<Partial<GalleryItem>>({
    title: '',
    category: 'Fade',
    image: '',
    description: '',
  });

  // Security tab state
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinChangeError, setPinChangeError] = useState<string | null>(null);
  const [pinChangeSuccess, setPinChangeSuccess] = useState<string | null>(null);

  // Check auth setup status whenever modal opens
  React.useEffect(() => {
    if (isOpen) {
      getAuthStatus()
        .then((status) => {
          setIsPinConfigured(status.isConfigured);
        })
        .catch(() => {
          setIsPinConfigured(true);
        });
    }
  }, [isOpen]);

  // Sync config when prop updates
  React.useEffect(() => {
    setConfigForm({ ...config });
  }, [config]);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  /* ========================================================
     AUTHENTICATION HANDLERS
  ======================================================== */
  const handleSetupPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupPinError(null);

    const pin = setupPinInput.trim();
    if (pin.length < 4) {
      setSetupPinError('El PIN debe tener al menos 4 caracteres o dígitos.');
      return;
    }
    if (pin !== confirmSetupPinInput.trim()) {
      setSetupPinError('Los PINs no coinciden. Verifícalos con atención.');
      return;
    }

    setIsSettingUpPin(true);
    try {
      await setupAdminPin(pin);
      setIsAuthenticated(true);
      setIsPinConfigured(true);
      setSetupPinInput('');
      setConfirmSetupPinInput('');
      showNotification('¡PIN de propietario establecido exitosamente!');
    } catch (err: any) {
      setSetupPinError(err.message || 'Error al configurar el PIN. Intenta nuevamente.');
    } finally {
      setIsSettingUpPin(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!pinInput.trim()) {
      setAuthError('Por favor ingresa tu PIN de propietario.');
      return;
    }

    setIsLoggingIn(true);
    try {
      await loginAdmin(pinInput.trim());
      setIsAuthenticated(true);
      setPinInput('');
      showNotification('¡Acceso concedido! Bienvenido al panel de administración.');
    } catch (err: any) {
      setAuthError(err.message || 'PIN de acceso incorrecto. Verifica el código e intenta nuevamente.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setAdminToken(null);
    setIsAuthenticated(false);
    setPinInput('');
    showNotification('Sesión de propietario cerrada.');
    getAuthStatus().then((s) => setIsPinConfigured(s.isConfigured)).catch(() => {});
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeError(null);
    setPinChangeSuccess(null);

    if (newPinInput.length < 4) {
      setPinChangeError('El nuevo PIN debe tener al menos 4 dígitos o caracteres.');
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setPinChangeError('Los PINs no coinciden. Verifícalos.');
      return;
    }

    try {
      await changeAdminPin(newPinInput);
      setPinChangeSuccess('¡PIN de administrador actualizado exitosamente!');
      setNewPinInput('');
      setConfirmPinInput('');
    } catch (err: any) {
      setPinChangeError(err.message || 'Error al cambiar el PIN.');
    }
  };

  /* ========================================================
     SERVICE & CUTS HANDLERS
  ======================================================== */
  const handleOpenAddService = () => {
    setServiceFormData({
      id: '',
      name: '',
      category: 'corte',
      description: '',
      samplePrice: 25,
      durationMinutes: 40,
      image: '/src/assets/images/barber_service_fade_1793125288978.jpg',
      badge: 'Nuevo',
    });
    setIsEditingService(true);
  };

  const handleStartEditService = (service: ServiceItem) => {
    setServiceFormData({ ...service });
    setIsEditingService(true);
  };

  const handleServiceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showNotification('Procesando fotografía...');
      const compressedDataUrl = await processImageFile(file, 900, 0.82);
      setServiceFormData((prev) => ({ ...prev, image: compressedDataUrl }));
      showNotification('Foto cargada y optimizada exitosamente.');
    } catch (err: any) {
      alert(err.message || 'Error al procesar la imagen.');
    }
  };

  const handleSaveServiceForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceFormData.name?.trim()) {
      alert('Por favor ingresa el nombre del corte o servicio.');
      return;
    }

    setIsSaving(true);
    try {
      const priceVal = Number(serviceFormData.samplePrice) || 20;
      const durationVal = Number(serviceFormData.durationMinutes) || 35;
      const isNew = !serviceFormData.id;

      const itemToSave: ServiceItem = {
        id: serviceFormData.id || `corte-${Date.now()}`,
        name: serviceFormData.name.trim(),
        category: (serviceFormData.category as any) || 'corte',
        description: serviceFormData.description?.trim() || 'Servicio profesional de barbería.',
        samplePrice: priceVal,
        durationMinutes: durationVal,
        image: serviceFormData.image || '/src/assets/images/barber_service_fade_1793125288978.jpg',
        badge: serviceFormData.badge?.trim() || undefined,
      };

      let updatedList: ServiceItem[];
      if (isNew) {
        updatedList = [...services, itemToSave];
        await onSaveServices(updatedList, 'create', itemToSave);
        showNotification(`¡Corte "${itemToSave.name}" agregado con éxito!`);
      } else {
        updatedList = services.map((s) => (s.id === itemToSave.id ? itemToSave : s));
        await onSaveServices(updatedList, 'update', itemToSave);
        showNotification(`¡Corte "${itemToSave.name}" actualizado con éxito!`);
      }

      setIsEditingService(false);
    } catch (err: any) {
      alert('Error al guardar: ' + (err.message || 'Error desconocido'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (service: ServiceItem) => {
    if (confirm(`¿Estás seguro de que deseas eliminar el corte "${service.name}"? Esta acción no se puede deshacer.`)) {
      try {
        const updatedList = services.filter((s) => s.id !== service.id);
        await onSaveServices(updatedList, 'delete', undefined, service.id);
        showNotification(`Corte "${service.name}" eliminado.`);
      } catch (err: any) {
        alert('Error al eliminar: ' + err.message);
      }
    }
  };

  /* ========================================================
     GALLERY HANDLERS
  ======================================================== */
  const handleOpenAddGallery = () => {
    setGalleryFormData({
      title: '',
      category: 'Fade',
      image: '/src/assets/images/barber_service_fade_1793125288978.jpg',
      description: 'Trabajo realizado en FAST CUT BARBER STUDIO.',
    });
    setIsAddingGallery(true);
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showNotification('Procesando fotografía...');
      const compressedDataUrl = await processImageFile(file, 1000, 0.82);
      setGalleryFormData((prev) => ({ ...prev, image: compressedDataUrl }));
      showNotification('Fotografía lista para la galería.');
    } catch (err: any) {
      alert(err.message || 'Error al procesar la imagen.');
    }
  };

  const handleSaveGalleryForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryFormData.title?.trim()) {
      alert('Por favor ingresa un título para el trabajo.');
      return;
    }
    if (!galleryFormData.image) {
      alert('Por favor selecciona o sube una fotografía.');
      return;
    }

    setIsSaving(true);
    try {
      const newItem: GalleryItem = {
        id: `gal-${Date.now()}`,
        title: galleryFormData.title.trim(),
        category: (galleryFormData.category as any) || 'Fade',
        image: galleryFormData.image,
        description: galleryFormData.description?.trim() || 'Trabajo profesional en el estudio.',
      };

      const updatedGallery = [newItem, ...gallery];
      await onSaveGallery(updatedGallery, 'create', newItem);
      setIsAddingGallery(false);
      showNotification('¡Fotografía agregada a la galería pública!');
    } catch (err: any) {
      alert('Error al guardar en galería: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteGalleryItem = async (item: GalleryItem) => {
    if (confirm(`¿Eliminar la foto "${item.title}" de la galería?`)) {
      try {
        const updatedGallery = gallery.filter((g) => g.id !== item.id);
        await onSaveGallery(updatedGallery, 'delete', undefined, item.id);
        showNotification('Foto eliminada de la galería.');
      } catch (err: any) {
        alert('Error al eliminar: ' + err.message);
      }
    }
  };

  /* ========================================================
     BUSINESS CONFIG HANDLERS
  ======================================================== */
  const handleSaveBusinessConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveConfig(configForm);
      showNotification('¡Datos de la barbería guardados permanentemente!');
    } catch (err: any) {
      alert('Error al guardar datos: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  /* ========================================================
     TESTIMONIALS HANDLERS
  ======================================================== */
  const handleAddTestimonial = () => {
    const newT: Testimonial = {
      id: `test-${Date.now()}`,
      name: 'Cliente Satisfecho',
      service: 'Corte Fade',
      rating: 5,
      comment: 'Excelente atención, puntualidad y corte impecable.',
      date: 'Reciente',
      avatarText: 'CS',
    };
    const updated = [newT, ...testimonials];
    onSaveTestimonials(updated);
    showNotification('Reseña agregada.');
  };

  const handleDeleteTestimonial = (id: string) => {
    const updated = testimonials.filter((t) => t.id !== id);
    onSaveTestimonials(updated);
    showNotification('Reseña eliminada.');
  };

  const handleUpdateTestimonial = (id: string, field: keyof Testimonial, val: any) => {
    const updated = testimonials.map((t) => (t.id === id ? { ...t, [field]: val } : t));
    onSaveTestimonials(updated);
  };

  /* ========================================================
     RESET TO DEFAULTS
  ======================================================== */
  const handleFactoryReset = async () => {
    const code = prompt('Para confirmar el restablecimiento completo de fábrica, escribe "CONFIRMAR":');
    if (code === 'CONFIRMAR') {
      try {
        await onResetDefaults();
        showNotification('Datos restablecidos a los valores originales de fábrica.');
      } catch (err: any) {
        alert('Error al restablecer: ' + err.message);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative my-4 sm:my-8 w-full max-w-4xl rounded-3xl bg-[#111216] border border-[#2b2e38] shadow-2xl p-4 sm:p-7 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#F0B247] text-black font-bold text-xs px-4 py-2 rounded-full shadow-xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-neutral-800 shrink-0 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-black border border-[#F0B247]/40 flex items-center justify-center shrink-0">
              <CrownLogo className="w-4 h-4 sm:w-5 sm:h-5 text-[#F0B247]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-lg text-white tracking-tight truncate">
                  PANEL DE ADMINISTRACIÓN
                </h3>
                {isAuthenticated && (
                  <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 shrink-0">
                    <Check className="w-3 h-3" /> Propietario Autenticado
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-400 truncate">
                FAST CUT BARBER STUDIO • Gestión del Negocio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/fastcut-barber-studio.zip"
              download="fastcut-barber-studio.zip"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F0B247]/15 hover:bg-[#F0B247]/25 border border-[#F0B247]/40 text-xs font-bold text-[#F0B247] transition-all shadow-sm"
              title="Descargar código del proyecto (.ZIP)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Descargar .ZIP</span>
            </a>

            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 hover:text-red-400 transition-colors"
                title="Cerrar sesión de administrador"
              >
                <span>Salir</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ----------------------------------------------------
            SCREEN 1: AUTHENTICATION GATE (IF NOT LOGGED IN)
        ---------------------------------------------------- */}
        {!isAuthenticated ? (
          isPinConfigured === false ? (
            /* SCREEN 1A: INITIAL ONBOARDING - OWNER PIN CREATION */
            <div className="py-10 px-4 flex flex-col items-center justify-center text-center my-auto">
              <div className="w-16 h-16 rounded-2xl bg-[#181920] border border-[#F0B247]/50 flex items-center justify-center text-[#F0B247] mb-5 shadow-xl shadow-[#F0B247]/10">
                <Shield className="w-8 h-8" />
              </div>

              <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
                Configuración Inicial de Seguridad
              </h4>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-md mb-6 leading-relaxed">
                Bienvenido a <span className="text-[#F0B247] font-semibold">FAST CUT BARBER STUDIO</span>. Establece tu PIN privado de propietario para proteger cortes, precios, fotos y reservas.
              </p>

              <form onSubmit={handleSetupPin} className="w-full max-w-xs space-y-3.5">
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={setupPinInput}
                    onChange={(e) => setSetupPinInput(e.target.value)}
                    placeholder="Crear PIN (mín. 4 dígitos)"
                    className="w-full px-4 py-3 rounded-xl bg-[#191b24] border border-[#2d303d] text-white text-center font-mono text-sm tracking-widest focus:border-[#F0B247] focus:outline-none pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
                    tabIndex={-1}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div>
                  <input
                    type="password"
                    value={confirmSetupPinInput}
                    onChange={(e) => setConfirmSetupPinInput(e.target.value)}
                    placeholder="Confirmar PIN"
                    className="w-full px-4 py-3 rounded-xl bg-[#191b24] border border-[#2d303d] text-white text-center font-mono text-sm tracking-widest focus:border-[#F0B247] focus:outline-none"
                  />
                </div>

                {setupPinError && (
                  <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-center justify-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                    <span>{setupPinError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSettingUpPin}
                  className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-black bg-[#F0B247] hover:bg-[#fabc55] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#F0B247]/20 disabled:opacity-50"
                >
                  <span>{isSettingUpPin ? 'Guardando PIN...' : 'Establecer PIN y Entrar'}</span>
                </button>
              </form>

              <div className="mt-6 p-3 rounded-xl bg-[#14151a] border border-neutral-800/80 text-[11px] text-neutral-400 max-w-sm">
                <p className="font-semibold text-neutral-300 flex items-center justify-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#F0B247]" />
                  <span>Seguridad sin credenciales públicas</span>
                </p>
                <p className="mt-1 leading-normal">
                  Tu PIN se almacena cifrado con SHA-256 en el backend y solo tú tendrás acceso para modificar el estudio.
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-800/50 flex items-center justify-center gap-3">
                <a
                  href="/fastcut-barber-studio.zip"
                  download="fastcut-barber-studio.zip"
                  className="inline-flex items-center gap-1.5 text-xs text-[#F0B247] hover:underline"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Descargar código del proyecto (.ZIP)</span>
                </a>
              </div>
            </div>
          ) : (
            /* SCREEN 1B: STANDARD OWNER LOGIN (PIN CONFIGURED) */
            <div className="py-12 px-4 flex flex-col items-center justify-center text-center my-auto">
              <div className="w-16 h-16 rounded-2xl bg-[#181920] border border-[#F0B247]/50 flex items-center justify-center text-[#F0B247] mb-5 shadow-xl shadow-[#F0B247]/10">
                <KeyRound className="w-8 h-8" />
              </div>

              <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
                Acceso Restringido al Propietario
              </h4>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-md mb-6 leading-relaxed">
                Ingresa tu PIN privado de administrador para gestionar cortes, precios, imágenes y la información del estudio.
              </p>

              <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="PIN de Propietario"
                    className="w-full px-4 py-3 rounded-xl bg-[#191b24] border border-[#2d303d] text-white text-center font-mono text-base tracking-widest focus:border-[#F0B247] focus:outline-none pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
                    tabIndex={-1}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {authError && (
                  <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-center justify-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-black bg-[#F0B247] hover:bg-[#fabc55] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#F0B247]/20 disabled:opacity-50"
                >
                  <span>{isLoggingIn ? 'Verificando...' : 'Ingresar al Panel'}</span>
                </button>
              </form>

              <div className="mt-8 pt-4 border-t border-neutral-800/50 flex items-center justify-center gap-3">
                <a
                  href="/fastcut-barber-studio.zip"
                  download="fastcut-barber-studio.zip"
                  className="inline-flex items-center gap-1.5 text-xs text-[#F0B247] hover:underline"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Descargar archivo del proyecto (.ZIP)</span>
                </a>
              </div>
            </div>
          )
        ) : (
          /* ----------------------------------------------------
              SCREEN 2: FULL ADMIN WORKSPACE
          ---------------------------------------------------- */
          <div className="flex-1 overflow-hidden flex flex-col pt-4">
            
            {/* Tabs Navigation */}
            <div className="flex items-center gap-1 sm:gap-2 pb-3 border-b border-neutral-800 overflow-x-auto shrink-0 no-scrollbar w-full touch-pan-x">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('services');
                  setIsEditingService(false);
                }}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeTab === 'services'
                    ? 'bg-[#F0B247] text-black shadow-md shadow-[#F0B247]/20'
                    : 'bg-[#181921] text-neutral-400 hover:text-white border border-[#262833]'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Cortes y Servicios ({services.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('gallery');
                  setIsAddingGallery(false);
                }}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeTab === 'gallery'
                    ? 'bg-[#F0B247] text-black shadow-md shadow-[#F0B247]/20'
                    : 'bg-[#181921] text-neutral-400 hover:text-white border border-[#262833]'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Galería ({gallery.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('business')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeTab === 'business'
                    ? 'bg-[#F0B247] text-black shadow-md shadow-[#F0B247]/20'
                    : 'bg-[#181921] text-neutral-400 hover:text-white border border-[#262833]'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Datos y Horarios</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('testimonials')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeTab === 'testimonials'
                    ? 'bg-[#F0B247] text-black shadow-md shadow-[#F0B247]/20'
                    : 'bg-[#181921] text-neutral-400 hover:text-white border border-[#262833]'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>Reseñas ({testimonials.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeTab === 'security'
                    ? 'bg-[#F0B247] text-black shadow-md shadow-[#F0B247]/20'
                    : 'bg-[#181921] text-neutral-400 hover:text-white border border-[#262833]'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Seguridad y Nube</span>
              </button>
            </div>

            {/* Scrollable Tab Content */}
            <div className="flex-1 overflow-y-auto py-4 pr-1">
              
              {/* ====================================================
                  TAB 1: CORTES Y SERVICIOS
              ==================================================== */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  {/* Top action bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#16171f] p-4 rounded-2xl border border-[#252834]">
                    <div>
                      <h4 className="font-bold text-white text-sm sm:text-base">
                        Catálogo de Cortes y Servicios
                      </h4>
                      <p className="text-xs text-neutral-400">
                        Los cortes añadidos aparecen inmediatamente en la web pública y en el selector de reservas.
                      </p>
                    </div>

                    {!isEditingService && (
                      <button
                        type="button"
                        onClick={handleOpenAddService}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F0B247] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#fabc55] transition-all shadow-md shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Agregar Nuevo Corte</span>
                      </button>
                    )}
                  </div>

                  {/* Add / Edit Service Form */}
                  {isEditingService && (
                    <div className="bg-[#181923] p-5 sm:p-6 rounded-2xl border border-[#F0B247]/50 shadow-xl space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                        <h5 className="font-bold text-white text-sm flex items-center gap-2">
                          <Scissors className="w-4 h-4 text-[#F0B247]" />
                          <span>{serviceFormData.id ? 'Editar Corte / Servicio' : 'Nuevo Corte / Servicio'}</span>
                        </h5>
                        <button
                          type="button"
                          onClick={() => setIsEditingService(false)}
                          className="text-xs text-neutral-400 hover:text-white"
                        >
                          Cancelar
                        </button>
                      </div>

                      <form onSubmit={handleSaveServiceForm} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Name */}
                          <div>
                            <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                              Nombre del corte / servicio *
                            </label>
                            <input
                              type="text"
                              required
                              value={serviceFormData.name || ''}
                              onChange={(e) => setServiceFormData({ ...serviceFormData, name: e.target.value })}
                              placeholder="Ej. Taper Fade Moderno"
                              className="w-full px-3 py-2 rounded-xl bg-[#14151b] border border-[#2f3240] text-white text-xs focus:border-[#F0B247] focus:outline-none"
                            />
                          </div>

                          {/* Price */}
                          <div>
                            <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                              Precio ({config.currencySymbol}) *
                            </label>
                            <input
                              type="number"
                              required
                              min="0"
                              step="0.5"
                              value={serviceFormData.samplePrice ?? ''}
                              onChange={(e) => setServiceFormData({ ...serviceFormData, samplePrice: parseFloat(e.target.value) || 0 })}
                              placeholder="Ej. 25"
                              className="w-full px-3 py-2 rounded-xl bg-[#14151b] border border-[#2f3240] text-white text-xs font-mono focus:border-[#F0B247] focus:outline-none"
                            />
                          </div>

                          {/* Category */}
                          <div>
                            <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                              Categoría *
                            </label>
                            <select
                              value={serviceFormData.category || 'corte'}
                              onChange={(e) => setServiceFormData({ ...serviceFormData, category: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-[#14151b] border border-[#2f3240] text-white text-xs focus:border-[#F0B247] focus:outline-none"
                            >
                              <option value="corte">Corte / Degradado</option>
                              <option value="barba">Perfilado de Barba</option>
                              <option value="color">Tinturado / Color</option>
                              <option value="diseno">Diseño Freestyle</option>
                              <option value="ninos">Corte de Niño</option>
                              <option value="combo">Combo VIP</option>
                            </select>
                          </div>

                          {/* Duration & Badge */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                                Duración (min)
                              </label>
                              <input
                                type="number"
                                min="10"
                                step="5"
                                value={serviceFormData.durationMinutes ?? 35}
                                onChange={(e) => setServiceFormData({ ...serviceFormData, durationMinutes: parseInt(e.target.value) || 30 })}
                                className="w-full px-3 py-2 rounded-xl bg-[#14151b] border border-[#2f3240] text-white text-xs font-mono focus:border-[#F0B247] focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                                Etiqueta / Badge
                              </label>
                              <input
                                type="text"
                                value={serviceFormData.badge || ''}
                                onChange={(e) => setServiceFormData({ ...serviceFormData, badge: e.target.value })}
                                placeholder="Ej. Más pedido"
                                className="w-full px-3 py-2 rounded-xl bg-[#14151b] border border-[#2f3240] text-white text-xs focus:border-[#F0B247] focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Image Upload or URL */}
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                            Fotografía del Corte
                          </label>
                          <div className="flex flex-col sm:flex-row items-center gap-4 p-3 rounded-xl bg-[#13141a] border border-[#2c2f3c]">
                            {/* Preview thumbnail */}
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-black border border-neutral-700 shrink-0 relative">
                              {serviceFormData.image ? (
                                <img
                                  src={serviceFormData.image}
                                  alt="Vista previa"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-600">
                                  <ImageIcon className="w-6 h-6" />
                                </div>
                              )}
                            </div>

                            {/* Upload buttons & text input */}
                            <div className="flex-1 w-full space-y-2">
                              <div className="flex items-center gap-2">
                                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#F0B247]/20 hover:bg-[#F0B247]/30 border border-[#F0B247]/40 text-[#F0B247] text-xs font-bold transition-all">
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>Subir foto desde este dispositivo</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleServiceImageUpload}
                                    className="hidden"
                                  />
                                </label>
                                <span className="text-[11px] text-neutral-400">o ingresa un enlace:</span>
                              </div>

                              <input
                                type="text"
                                value={serviceFormData.image || ''}
                                onChange={(e) => setServiceFormData({ ...serviceFormData, image: e.target.value })}
                                placeholder="https://ejemplo.com/foto-corte.jpg"
                                className="w-full px-3 py-1.5 rounded-lg bg-[#191a21] border border-[#2b2e3a] text-white text-xs focus:border-[#F0B247] focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                            Descripción del corte
                          </label>
                          <textarea
                            rows={2}
                            value={serviceFormData.description || ''}
                            onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                            placeholder="Describe el estilo, detalles de la navaja o técnica aplicada..."
                            className="w-full px-3 py-2 rounded-xl bg-[#14151b] border border-[#2f3240] text-white text-xs focus:border-[#F0B247] focus:outline-none"
                          />
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsEditingService(false)}
                            className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 hover:text-white"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="px-5 py-2 rounded-xl bg-[#F0B247] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#fabc55] shadow-md flex items-center gap-1.5"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{isSaving ? 'Guardando...' : 'Guardar Corte'}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* List of existing services */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {services.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-[#15161e] border border-[#242733] flex flex-col justify-between hover:border-[#F0B247]/40 transition-all group"
                      >
                        <div>
                          <div className="flex items-start gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/src/assets/images/barber_service_fade_1793125288978.jpg';
                              }}
                              className="w-14 h-14 rounded-xl object-cover bg-black border border-neutral-800 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <h5 className="font-bold text-xs sm:text-sm text-white truncate">
                                  {item.name}
                                </h5>
                                <span className="font-mono font-bold text-xs text-[#F0B247] shrink-0">
                                  {config.currencySymbol} {item.samplePrice}
                                </span>
                              </div>
                              <span className="inline-block mt-0.5 text-[10px] text-neutral-400 uppercase tracking-wider">
                                {item.category} • {item.durationMinutes} min
                              </span>
                              {item.badge && (
                                <span className="inline-block ml-1 px-1.5 py-0.2 rounded text-[9px] bg-[#F0B247]/20 text-[#F0B247] font-semibold">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="mt-2 text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* Card actions */}
                        <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => handleStartEditService(item)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-300 hover:text-[#F0B247] transition-colors"
                          >
                            <Edit2 className="w-3 h-3 text-[#F0B247]" />
                            <span>Editar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteService(item)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ====================================================
                  TAB 2: GALERÍA DE TRABAJOS
              ==================================================== */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  {/* Top action bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#16171f] p-4 rounded-2xl border border-[#252834]">
                    <div>
                      <h4 className="font-bold text-white text-sm sm:text-base">
                        Galería de Trabajos Reales
                      </h4>
                      <p className="text-xs text-neutral-400">
                        Sube fotografías de cortes para mostrar tu portafolio a los clientes.
                      </p>
                    </div>

                    {!isAddingGallery && (
                      <button
                        type="button"
                        onClick={handleOpenAddGallery}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F0B247] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#fabc55] transition-all shadow-md shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Subir Nueva Fotografía</span>
                      </button>
                    )}
                  </div>

                  {/* Add Photo Form */}
                  {isAddingGallery && (
                    <div className="bg-[#181923] p-5 sm:p-6 rounded-2xl border border-[#F0B247]/50 shadow-xl space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                        <h5 className="font-bold text-white text-sm flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-[#F0B247]" />
                          <span>Subir Fotografía a la Galería</span>
                        </h5>
                        <button
                          type="button"
                          onClick={() => setIsAddingGallery(false)}
                          className="text-xs text-neutral-400 hover:text-white"
                        >
                          Cancelar
                        </button>
                      </div>

                      <form onSubmit={handleSaveGalleryForm} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Title */}
                          <div>
                            <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                              Título del corte / trabajo *
                            </label>
                            <input
                              type="text"
                              required
                              value={galleryFormData.title || ''}
                              onChange={(e) => setGalleryFormData({ ...galleryFormData, title: e.target.value })}
                              placeholder="Ej. Low Fade + Diseño de Rayas"
                              className="w-full px-3 py-2 rounded-xl bg-[#14151b] border border-[#2f3240] text-white text-xs focus:border-[#F0B247] focus:outline-none"
                            />
                          </div>

                          {/* Category */}
                          <div>
                            <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                              Categoría de filtro *
                            </label>
                            <select
                              value={galleryFormData.category || 'Fade'}
                              onChange={(e) => setGalleryFormData({ ...galleryFormData, category: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-[#14151b] border border-[#2f3240] text-white text-xs focus:border-[#F0B247] focus:outline-none"
                            >
                              <option value="Fade">Cortes / Fade</option>
                              <option value="Clásico">Clásico</option>
                              <option value="Barba">Barba</option>
                              <option value="Diseños">Diseños</option>
                              <option value="Tinturados">Tinturados / Color</option>
                              <option value="Niños">Niños</option>
                            </select>
                          </div>
                        </div>

                        {/* Image picker */}
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                            Fotografía *
                          </label>
                          <div className="flex flex-col sm:flex-row items-center gap-4 p-3 rounded-xl bg-[#13141a] border border-[#2c2f3c]">
                            <div className="w-24 h-24 rounded-xl overflow-hidden bg-black border border-neutral-700 shrink-0 relative">
                              {galleryFormData.image ? (
                                <img
                                  src={galleryFormData.image}
                                  alt="Vista previa"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-600">
                                  <ImageIcon className="w-6 h-6" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 w-full space-y-2">
                              <div className="flex items-center gap-2">
                                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#F0B247]/20 hover:bg-[#F0B247]/30 border border-[#F0B247]/40 text-[#F0B247] text-xs font-bold transition-all">
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>Subir foto desde celular o PC</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleGalleryImageUpload}
                                    className="hidden"
                                  />
                                </label>
                                <span className="text-[11px] text-neutral-400">o ingresa un enlace:</span>
                              </div>

                              <input
                                type="text"
                                value={galleryFormData.image || ''}
                                onChange={(e) => setGalleryFormData({ ...galleryFormData, image: e.target.value })}
                                placeholder="https://ejemplo.com/mi-corte.jpg"
                                className="w-full px-3 py-1.5 rounded-lg bg-[#191a21] border border-[#2b2e3a] text-white text-xs focus:border-[#F0B247] focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                            Breve descripción
                          </label>
                          <input
                            type="text"
                            value={galleryFormData.description || ''}
                            onChange={(e) => setGalleryFormData({ ...galleryFormData, description: e.target.value })}
                            placeholder="Ej. Degradado a navaja libre con texturizado superior."
                            className="w-full px-3 py-2 rounded-xl bg-[#14151b] border border-[#2f3240] text-white text-xs focus:border-[#F0B247] focus:outline-none"
                          />
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsAddingGallery(false)}
                            className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 hover:text-white"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="px-5 py-2 rounded-xl bg-[#F0B247] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#fabc55] shadow-md flex items-center gap-1.5"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{isSaving ? 'Guardando...' : 'Guardar en Galería'}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Existing gallery grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {gallery.map((item) => (
                      <div
                        key={item.id}
                        className="group relative rounded-2xl overflow-hidden bg-[#15161e] border border-[#232630] aspect-[3/4] flex flex-col justify-end p-3"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/src/assets/images/barber_service_fade_1793125288978.jpg';
                          }}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                        {/* Category badge */}
                        <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-[#F0B247] border border-[#F0B247]/30">
                          {item.category}
                        </span>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteGalleryItem(item)}
                          className="absolute top-2 right-2 z-10 p-1.5 rounded-lg bg-red-950/80 hover:bg-red-800 text-red-200 border border-red-700 transition-all opacity-80 group-hover:opacity-100"
                          title="Eliminar de la galería"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="relative z-10">
                          <h6 className="font-bold text-xs text-white line-clamp-1">
                            {item.title}
                          </h6>
                          <p className="text-[10px] text-neutral-300 line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ====================================================
                  TAB 3: DATOS Y HORARIOS
              ==================================================== */}
              {activeTab === 'business' && (
                <form onSubmit={handleSaveBusinessConfig} className="space-y-5">
                  <div className="bg-[#16171f] p-4 rounded-2xl border border-[#252834]">
                    <h4 className="font-bold text-white text-sm sm:text-base">
                      Información del Estudio y Contacto
                    </h4>
                    <p className="text-xs text-neutral-400">
                      Actualiza el nombre, textos, números de WhatsApp y horarios de atención.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        Nombre del Estudio
                      </label>
                      <input
                        type="text"
                        value={configForm.name}
                        onChange={(e) => setConfigForm({ ...configForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#14151b] border border-[#2f3240] text-white text-xs focus:border-[#F0B247] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        Eslogan
                      </label>
                      <input
                        type="text"
                        value={configForm.slogan}
                        onChange={(e) => setConfigForm({ ...configForm, slogan: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#14151b] border border-[#2f3240] text-white text-xs focus:border-[#F0B247] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        Texto de Presentación / Tagline
                      </label>
                      <input
                        type="text"
                        value={configForm.tagline}
                        onChange={(e) => setConfigForm({ ...configForm, tagline: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#14151b] border border-[#2f3240] text-white text-xs focus:border-[#F0B247] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        Teléfono WhatsApp (solo números, con código de país)
                      </label>
                      <input
                        type="text"
                        value={configForm.phoneWhatsapp}
                        onChange={(e) => setConfigForm({ ...configForm, phoneWhatsapp: e.target.value })}
                        placeholder="51927168320"
                        className="w-full px-3 py-2 rounded-xl bg-[#14151b] border border-[#2f3240] text-white text-xs font-mono focus:border-[#F0B247] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        Teléfono Visible en Web
                      </label>
                      <input
                        type="text"
                        value={configForm.phoneDisplay}
                        onChange={(e) => setConfigForm({ ...configForm, phoneDisplay: e.target.value })}
                        placeholder="+51 927 168 320"
                        className="w-full px-3 py-2 rounded-xl bg-[#14151b] border border-[#2f3240] text-white text-xs font-mono focus:border-[#F0B247] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        Dirección del Local
                      </label>
                      <input
                        type="text"
                        value={configForm.address}
                        onChange={(e) => setConfigForm({ ...configForm, address: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#14151b] border border-[#2f3240] text-white text-xs focus:border-[#F0B247] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        Referencia o Ciudad
                      </label>
                      <input
                        type="text"
                        value={configForm.city}
                        onChange={(e) => setConfigForm({ ...configForm, city: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#14151b] border border-[#2f3240] text-white text-xs focus:border-[#F0B247] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        Horario Lunes a Sábado
                      </label>
                      <input
                        type="text"
                        value={configForm.scheduleWeekday}
                        onChange={(e) => setConfigForm({ ...configForm, scheduleWeekday: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#14151b] border border-[#2f3240] text-white text-xs focus:border-[#F0B247] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        Horario Domingos
                      </label>
                      <input
                        type="text"
                        value={configForm.scheduleSunday}
                        onChange={(e) => setConfigForm({ ...configForm, scheduleSunday: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#14151b] border border-[#2f3240] text-white text-xs focus:border-[#F0B247] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        Símbolo de Moneda
                      </label>
                      <input
                        type="text"
                        value={configForm.currencySymbol}
                        onChange={(e) => setConfigForm({ ...configForm, currencySymbol: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#14151b] border border-[#2f3240] text-white text-xs font-mono focus:border-[#F0B247] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                        Instagram
                      </label>
                      <input
                        type="text"
                        value={configForm.instagram}
                        onChange={(e) => setConfigForm({ ...configForm, instagram: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#14151b] border border-[#2f3240] text-white text-xs focus:border-[#F0B247] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-[#F0B247]" />
                        <span>URL del Dominio o Sitio Web Oficial</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://barberiafastcut.com"
                        value={configForm.websiteUrl || ''}
                        onChange={(e) => setConfigForm({ ...configForm, websiteUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#14151b] border border-[#2f3240] text-white text-xs font-mono focus:border-[#F0B247] focus:outline-none"
                      />
                      <p className="text-[10px] text-neutral-400 mt-1">
                        Ingresa aquí el dominio propio de tu cliente (ej. <code className="text-[#F0B247]">https://barberiafastcut.com</code>).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2.5 rounded-xl bg-[#F0B247] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#fabc55] shadow-md flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSaving ? 'Guardando...' : 'Guardar Información'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* ====================================================
                  TAB 4: RESEÑAS
              ==================================================== */}
              {activeTab === 'testimonials' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-[#16171f] p-4 rounded-2xl border border-[#252834]">
                    <div>
                      <h4 className="font-bold text-white text-sm sm:text-base">
                        Opiniones de Clientes
                      </h4>
                      <p className="text-xs text-neutral-400">
                        Administra los testimonios visibles en la sección de reseñas.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddTestimonial}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F0B247] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#fabc55] transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Nueva Reseña</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {testimonials.map((t) => (
                      <div
                        key={t.id}
                        className="p-4 rounded-2xl bg-[#15161e] border border-[#232630] space-y-3"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-[10px] text-neutral-400 uppercase font-semibold">
                                Nombre Cliente
                              </label>
                              {t.avatarUrl && (
                                <span className="text-[9px] text-[#F0B247] bg-[#F0B247]/15 px-1.5 py-0.5 rounded font-mono">
                                  Con Foto
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {t.avatarUrl && (
                                <img
                                  src={t.avatarUrl}
                                  alt={t.name}
                                  className="w-8 h-8 rounded-full object-cover border border-[#F0B247]/50 shrink-0"
                                />
                              )}
                              <input
                                type="text"
                                value={t.name}
                                onChange={(e) => handleUpdateTestimonial(t.id, 'name', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg bg-[#111217] border border-neutral-700 text-white text-xs focus:border-[#F0B247] focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] text-neutral-400 uppercase font-semibold mb-1">
                              Servicio recibido
                            </label>
                            <input
                              type="text"
                              value={t.service}
                              onChange={(e) => handleUpdateTestimonial(t.id, 'service', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-[#111217] border border-neutral-700 text-white text-xs focus:border-[#F0B247] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-neutral-400 uppercase font-semibold mb-1">
                              Estrellas (1 - 5)
                            </label>
                            <select
                              value={t.rating}
                              onChange={(e) => handleUpdateTestimonial(t.id, 'rating', parseInt(e.target.value))}
                              className="w-full px-3 py-1.5 rounded-lg bg-[#111217] border border-neutral-700 text-white text-xs focus:border-[#F0B247] focus:outline-none"
                            >
                              <option value={5}>⭐⭐⭐⭐⭐ (5 estrellas)</option>
                              <option value={4}>⭐⭐⭐⭐ (4 estrellas)</option>
                              <option value={3}>⭐⭐⭐ (3 estrellas)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-neutral-400 uppercase font-semibold mb-1">
                            Comentario
                          </label>
                          <textarea
                            rows={2}
                            value={t.comment}
                            onChange={(e) => handleUpdateTestimonial(t.id, 'comment', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#111217] border border-neutral-700 text-white text-xs focus:border-[#F0B247] focus:outline-none"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleDeleteTestimonial(t.id)}
                            className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Eliminar reseña</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ====================================================
                  TAB 5: SEGURIDAD Y NUBE
              ==================================================== */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  {/* Download Project Code Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#201a0e] via-[#161720] to-[#12131a] border border-[#F0B247]/40 space-y-3.5 shadow-lg shadow-black/40">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0B247]/20 border border-[#F0B247]/40 text-[#F0B247] text-[10px] font-bold uppercase tracking-wider mb-1.5">
                          <Package className="w-3.5 h-3.5" />
                          <span>Descarga & Entrega al Cliente</span>
                        </div>
                        <h5 className="font-bold text-white text-sm sm:text-base">
                          Descargar Código Fuente Completo del Proyecto
                        </h5>
                        <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                          Descarga el archivo empaquetado con todo el código fuente listo para entregar a tu cliente o desplegar en cualquier hosting (React + TypeScript + Vite + Tailwind + Express + Base de datos local + Imágenes y README con instrucciones).
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      <a
                        href="/fastcut-barber-studio.zip"
                        download="fastcut-barber-studio.zip"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F0B247] to-[#d4962b] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-md shadow-[#F0B247]/20 transition-all"
                      >
                        <Download className="w-4 h-4 text-black" />
                        <span>Descargar Archivo .ZIP (Recomendado)</span>
                      </a>

                      <a
                        href="/fastcut-barber-studio.tar.gz"
                        download="fastcut-barber-studio.tar.gz"
                        className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1b1c26] hover:bg-[#232533] border border-[#373a4d] text-neutral-300 hover:text-white font-medium text-xs transition-all"
                      >
                        <FileArchive className="w-3.5 h-3.5 text-[#F0B247]" />
                        <span>Formato Linux/Mac (.tar.gz)</span>
                      </a>
                    </div>
                  </div>

                  {/* Status Banner */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 flex items-start gap-3">
                    <Database className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-sm text-emerald-300">
                        Almacenamiento Persistente en Servidor Activo
                      </h5>
                      <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                        El backend Express guarda todos tus cortes, precios, imágenes y datos en el archivo de base de datos del servidor (<code className="text-emerald-400 font-mono text-[11px]">/data/studio-store.json</code>). Cada cambio que guardas aquí se refleja inmediatamente en tiempo real para cualquier visitante desde computadoras y celulares.
                      </p>
                    </div>
                  </div>

                  {/* Change PIN Box */}
                  <div className="p-5 rounded-2xl bg-[#16171f] border border-[#252834] space-y-4">
                    <div>
                      <h5 className="font-bold text-white text-sm flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-[#F0B247]" />
                        <span>Cambiar PIN de Acceso del Propietario</span>
                      </h5>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Elige un PIN seguro para evitar que personas no autorizadas modifiquen tus precios o eliminen cortes.
                      </p>
                    </div>

                    <form onSubmit={handleChangePin} className="space-y-3 max-w-sm">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                          Nuevo PIN (mínimo 4 caracteres o números)
                        </label>
                        <input
                          type="password"
                          required
                          value={newPinInput}
                          onChange={(e) => setNewPinInput(e.target.value)}
                          placeholder="Nuevo PIN"
                          className="w-full px-3 py-2 rounded-xl bg-[#111217] border border-neutral-700 text-white font-mono text-xs focus:border-[#F0B247] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                          Confirmar Nuevo PIN
                        </label>
                        <input
                          type="password"
                          required
                          value={confirmPinInput}
                          onChange={(e) => setConfirmPinInput(e.target.value)}
                          placeholder="Repite el nuevo PIN"
                          className="w-full px-3 py-2 rounded-xl bg-[#111217] border border-neutral-700 text-white font-mono text-xs focus:border-[#F0B247] focus:outline-none"
                        />
                      </div>

                      {pinChangeError && (
                        <p className="text-xs text-red-400">{pinChangeError}</p>
                      )}
                      {pinChangeSuccess && (
                        <p className="text-xs text-emerald-400">{pinChangeSuccess}</p>
                      )}

                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#F0B247] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#fabc55] transition-all"
                      >
                        Actualizar PIN
                      </button>
                    </form>
                  </div>

                  {/* Cloud Architecture Guide */}
                  <div className="p-5 rounded-2xl bg-[#14151c] border border-[#232530] space-y-3">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <Cloud className="w-4 h-4 text-[#F0B247]" />
                      <span>Guía de Servicios Cloud para Escalabilidad Futura</span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      La solución actual opera de forma autónoma con persistencia local en Node.js sin costos recurrentes ni claves externas. Si en el futuro deseas expandirte a una infraestructura multi-sucursal distribuida con CDN global:
                    </p>
                    <ul className="space-y-2 text-xs text-neutral-400 pl-4 list-disc">
                      <li>
                        <strong className="text-neutral-200">Firebase Firestore:</strong> Base de datos NoSQL en tiempo real sin servidor para sincronizar citas y barberos entre múltiples sedes con nivel gratuito amplio.
                      </li>
                      <li>
                        <strong className="text-neutral-200">Firebase Auth:</strong> Permite crear cuentas individuales para cada barbero con roles (Administrador vs. Barbero).
                      </li>
                      <li>
                        <strong className="text-neutral-200">Cloudinary o Supabase Storage:</strong> Para almacenar miles de fotos de alta resolución con optimización y compresión web automática.
                      </li>
                    </ul>
                  </div>

                  {/* Custom Domain Guide */}
                  <div className="p-5 rounded-2xl bg-[#14151c] border border-[#2b2f3e] space-y-3">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <Globe className="w-4 h-4 text-[#F0B247]" />
                      <span>Cómo Conectar el Dominio del Cliente (ej: tudominio.com)</span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Para que tu cliente use su propio nombre de dominio (<code className="text-[#F0B247]">www.barberiafastcut.com</code> o <code className="text-[#F0B247]">barberiafastcut.pe</code>):
                    </p>
                    <ol className="space-y-2 text-xs text-neutral-300 pl-4 list-decimal">
                      <li>
                        <strong className="text-white">Opción 1: En Cloudflare (Recomendado y Gratis)</strong>
                        <p className="text-neutral-400 mt-0.5">
                          Agrega el dominio a Cloudflare y en la pestaña <strong>DNS</strong> crea un registro tipo <code className="text-[#F0B247]">CNAME</code> con Nombre: <code className="text-[#F0B247]">@</code> o <code className="text-[#F0B247]">www</code> apuntando a la URL del servidor de la aplicación con Proxy activado (nube naranja).
                        </p>
                      </li>
                      <li>
                        <strong className="text-white">Opción 2: En Google Cloud Run (Directo)</strong>
                        <p className="text-neutral-400 mt-0.5">
                          En la consola de Google Cloud &gt; Cloud Run &gt; Administrar dominios personalizados &gt; Agregar asignación. Te dará los registros DNS para copiarlos en GoDaddy, Namecheap o Hostinger.
                        </p>
                      </li>
                      <li>
                        <strong className="text-white">Opción 3: Despliegue en Vercel, Render o VPS</strong>
                        <p className="text-neutral-400 mt-0.5">
                          Conecta el repositorio a Vercel o Render, ve a <em>Settings &gt; Domains</em>, escribe el dominio del cliente y añade el registro CNAME o registro A que te indique la plataforma.
                        </p>
                      </li>
                    </ol>
                  </div>

                  {/* Factory Reset */}
                  <div className="p-4 rounded-2xl bg-red-950/20 border border-red-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h6 className="font-bold text-xs text-red-400">
                        Restablecer Valores de Fábrica
                      </h6>
                      <p className="text-[11px] text-neutral-400">
                        Restaura los 6 cortes iniciales, fotos y textos originales del prototipo.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleFactoryReset}
                      className="px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 text-xs font-bold transition-all shrink-0"
                    >
                      Restablecer Todo
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
