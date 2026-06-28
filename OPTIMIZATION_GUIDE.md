# Guía de Optimización de Multimedia

## Estado Actual
- **hero-bg.mp4**: 9.8MB (demasiado grande para web)
- **logo.png**: 27KB (aceptable)

## Recomendaciones de Optimización

### 1. Video de Fondo (hero-bg.mp4)

**Problema:** 9.8MB es demasiado grande para una web profesional. Afecta:
- Tiempo de carga inicial
- Experiencia de usuario en conexiones lentas
- SEO (Core Web Vitals - LCP)

**Soluciones:**

#### Opción A: Comprimir el video (Recomendado)
Usar FFmpeg para comprimir el video:
```bash
ffmpeg -i hero-bg.mp4 -vcodec libx264 -crf 28 -preset slow -vf "scale=1920:1080" hero-bg-compressed.mp4
```

Objetivo: Reducir a <2MB manteniendo calidad aceptable.

#### Opción B: Usar formato WebM (Más eficiente)
```bash
ffmpeg -i hero-bg.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -vf "scale=1920:1080" hero-bg.webm
```

WebM suele ser 30-50% más pequeño que MP4 con misma calidad.

#### Opción C: Crear versión móvil
Crear versión más pequeña para móviles:
```bash
ffmpeg -i hero-bg.mp4 -vcodec libx264 -crf 30 -preset slow -vf "scale=854:480" hero-bg-mobile.mp4
```

#### Opción D: Usar placeholder con carga diferida
- Mostrar gradiente primero (ya implementado)
- Cargar video solo cuando esté visible
- Usar `loading="lazy"` en el elemento video

### 2. Logo (logo.png)

**Estado:** 27KB - Aceptable

**Mejoras opcionales:**
- Convertir a WebP: ~15-20KB
- Usar SVG para escalabilidad perfecta
- Crear versión retina (2x) para pantallas de alta densidad

### 3. Implementación de Lazy Loading

Ya implementado fallback con gradiente. Mejorar con:
```typescript
const [videoLoaded, setVideoLoaded] = useState(false);

<video
  preload="none"
  onLoadedData={() => setVideoLoaded(true)}
  className={videoLoaded ? "opacity-100" : "opacity-0"}
/>
```

### 4. CDN y Caching

Para producción:
- Usar CDN (Cloudflare, Vercel, etc.)
- Configurar cache headers para assets estáticos
- Implementar service worker para caching offline

## Métricas Objetivo

### Core Web Vitals
- **LCP (Largest Contentful Paint):** <2.5s
- **FID (First Input Delay):** <100ms
- **CLS (Cumulative Layout Shift):** <0.1

### Tamaños Objetivo
- **Video hero:** <2MB (ideal <1MB)
- **Logo:** <20KB
- **Total inicial:** <500KB comprimido

## Herramientas Recomendadas

### Compresión
- **FFmpeg:** Para videos
- **TinyPNG / Squoosh:** Para imágenes
- **SVGO:** Para SVGs

### Análisis
- **Lighthouse:** Auditoría de performance
- **WebPageTest:** Análisis detallado
- **GTmetrix:** Métricas y sugerencias

### Monitoreo
- **Sentry:** Error tracking (ya configurado)
- **Google Analytics:** Analytics (ya configurado)
- **PageSpeed Insights:** Core Web Vitals

## Próximos Pasos

1. Comprimir video hero-bg.mp4 a <2MB
2. Convertir logo a WebP
3. Implementar lazy loading agresivo
4. Configurar CDN para producción
5. Auditar con Lighthouse después de cambios
