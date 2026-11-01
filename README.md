# 💈 FAST CUT BARBER STUDIO - Web & Sistema de Gestión

Sitio web oficial y panel de administración premium para **FAST CUT BARBER STUDIO**. Desarrollado con React 19, TypeScript, Tailwind CSS, Express y almacenamiento de datos persistente.

---

## 🚀 Requisitos Previos

- **Node.js** (versión 18 o superior recomendada, v20+ ideal)
- **npm** (incluido con Node.js), **pnpm** o **bun**

---

## 📦 Instalación y Puesta en Marcha

1. **Descomprime el archivo del proyecto:**
   ```bash
   unzip fastcut-barber-studio.zip
   cd fastcut-barber-studio
   ```

2. **Instala las dependencias del proyecto:**
   ```bash
   npm install
   ```

3. **Inicia el servidor en modo desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abre tu navegador en:**
   ```
   http://localhost:3000
   ```

---

## 🔐 Configuración del PIN de Propietario (Sin Credenciales Públicas)

Por razones estrictas de seguridad, **este proyecto no contiene ningún PIN predeterminado ni credenciales públicas de demostración**.

Existen dos métodos seguros para establecer el PIN privado del propietario:

### Método A: Asistente Inicial en Pantalla (Recomendado para el Cliente)
1. Al abrir la página web por primera vez, haz clic en el candado dorado **"Panel Propietario"** en la esquina superior derecha o en el pie de página.
2. El sistema detectará automáticamente que es la primera instalación y mostrará la pantalla **"Configuración Inicial de Seguridad"**.
3. El propietario ingresa su PIN privado deseado (mínimo 4 dígitos o caracteres) y lo confirma.
4. El backend almacena el PIN protegido con la función de derivación de claves resistente a fuerza bruta **scrypt** (con sal aleatoria criptográfica y verificación segura en tiempo constante) en el archivo de datos del servidor y genera una sesión activa.

### Método B: Variable de Entorno de Despliegue (Hosting en la Nube)
Si despliegas en servicios como Render, Railway, Vercel, VPS o Docker, puedes preconfigurar el PIN configurando la variable de entorno:
```bash
ADMIN_PIN=ClavePrivadaPropietarioSegura
```
El servidor utilizará esta variable de entorno prioritaria para autenticar al propietario.

---

## 🛡️ Seguridad y Control de Sesiones

- **Tokens de Sesión con Vencimiento:** Al iniciar sesión como propietario, el servidor genera un token criptográfico único con caducidad automática de 2 horas (TTL). Los tokens expirados son rechazados de inmediato con código HTTP 401.
- **Protección contra Fuerza Bruta:** Se incluye un limitador de intentos fallidos con bloqueo temporal tras 5 fallos consecutivos por dirección IP.
- **Rutas de API Protegidas:** Todas las acciones de modificación (`/api/content/services`, `/api/content/gallery`, `/api/content/config`, `/api/content/testimonials`, `/api/auth/change-pin`) exigen un token de autorización Bearer válido y no vencido.

---

## 💾 Persistencia de Datos tras Reinicio del Servidor

Todos los cortes, precios, descripciones, fotografías de la galería, reseñas públicas de clientes y configuración del negocio se almacenan permanentemente en:
```
data/studio-store.json
```

### ¿Cómo se garantiza que no se pierdan datos al reiniciar el servidor?
1. **Escritura Atómica Segura:** Cada modificación que realiza el propietario se escribe primero en un archivo temporal (`data/studio-store.json.<timestamp>.tmp`) y se aplica mediante una operación atómica `fs.renameSync()`. Esto previene corrupción de datos en caso de apagados repentinos.
2. **Carga al Arrancar:** Al encender o reiniciar el servidor Node.js/Express, la función `readStore()` carga inmediatamente el estado actualizado desde `data/studio-store.json`.
3. **Persistencia en la Nube:** En hostings como VPS, DigitalOcean o Railway con volúmenes persistentes, los datos se conservan indefinidamente a través de reinicios, despliegues y actualizaciones de código.

---

## 🛠️ Comandos Disponibles

- `npm run dev` - Inicia el servidor fullstack (Express + Vite) en desarrollo en el puerto 3000.
- `npm run build` - Compila el frontend optimizado para producción en `/dist`.
- `npm run start` - Inicia el servidor Node.js en modo producción.
- `npm run lint` - Ejecuta la verificación estática de TypeScript sin emitir código.

---

## 🌐 Guía de Despliegue en Producción

### 1. Render.com / Railway / Fly.io (Recomendado)
- **Tipo de Servicio:** Web Service (Node.js)
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start`
- **Variables de Entorno (Opcionales):**
  - `PORT=3000` (el proveedor asigna su puerto dinámico automáticamente si no se define)
  - `ADMIN_PIN=TuPINSeguro` (opcional; si se omite, se configura desde la pantalla inicial)

### 2. VPS (Ubuntu/Debian con Nginx y PM2)
```bash
# 1. Clonar o subir el proyecto al servidor
cd /var/www/fastcut-barber-studio

# 2. Instalar y compilar
npm install
npm run build

# 3. Iniciar con PM2 (gestor de procesos para reinicio automático)
npm install -g pm2
pm2 start server.ts --name "fastcut-studio" --interpreter ./node_modules/.bin/tsx

# 4. Guardar para que inicie tras reinicio del servidor
pm2 save
pm2 startup
```

---

## 📁 Estructura del Proyecto

```
fastcut-barber-studio/
├── data/
│   └── studio-store.json       # Base de datos local persistente
├── public/                     # Archivos estáticos y paquete descargable
├── src/
│   ├── assets/                 # Imágenes originales de cortes y barbería
│   ├── components/             # Componentes React (Navbar, Hero, Servicios, Galería, Modal Admin, etc.)
│   ├── services/               # Clientes API REST y gestión de tokens
│   ├── types/                  # Definiciones de tipos TypeScript
│   ├── utils/                  # Sanitizadores de WhatsApp e imágenes
│   ├── App.tsx                 # Aplicación principal
│   └── main.tsx                # Entrada React
├── server.ts                   # Servidor Express Full-Stack con endpoints seguros
├── package.json                # Configuración de dependencias
├── tsconfig.json               # Configuración TypeScript
├── vite.config.ts              # Configuración del bundler Vite
└── README.md                   # Esta guía completa
```

FAST CUT BARBER STUDIO © Todos los derechos reservados.
