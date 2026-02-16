# 🔍 Mejoras en el Motor OCR - Documentación

## 📋 Cambios Realizados

Se han implementado mejoras significativas en el reconocimiento óptico de caracteres (OCR) para mejorar la detección de cartas Magic cuando se usan cámara o se suben imágenes.

## 🎯 Mejoras Implementadas

### 1. **Pre-procesamiento de Imagen** (`preprocessImageForOCR`)
- ✅ Conversión a escala de grises para mejor contraste
- ✅ Aumento de contraste (factor 2.0) para mejorar legibilidad
- ✅ Normalización de píxeles para OCR más preciso
- ✅ Optimización especial para cartas con fondos coloridos

### 2. **Configuración Mejorada de Tesseract**
- ✅ Whitelist de caracteres específicos para cartas MTG
- ✅ PSM (Page Segmentation Mode) automático para mejor detección
- ✅ Mayor compresión JPEG (0.95) sin perder calidad

### 3. **Extracción Inteligente de Nombre** (`extractCardName`)
- ✅ Extrae el nombre de la carta del texto OCR reconocido
- ✅ Filtra líneas vacías y símbolos especiales
- ✅ Busca la primera línea que contenga caracteres alfabéticos válidos
- ✅ Prioriza buscar el nombre en las primeras líneas

### 4. **Función Centralizada OCR** (`performOCR`)
- ✅ Centraliza toda la lógica de reconocimiento
- ✅ Manejo consistente de errores
- ✅ Logging de progreso cada 10% en lugar de cada paso
- ✅ Retorna texto procesado para búsqueda mejorada

## 🔄 Flujo de Procesamiento

```
Imagen Capturada
    ↓
[Pre-procesamiento]
  - Escala de grises
  - Aumento de contraste
  - Normalización
    ↓
[OCR con Tesseract]
  - Reconocimiento de texto
  - Extracción de caracteres válidos
    ↓
[Post-procesamiento]
  - Extracción del nombre de carta
  - Combinación de nombre + texto completo
    ↓
[Búsqueda de Cartas]
  - Busca por nombre extraído primero
  - Si falla, intenta con texto completo
```

## 🛠️ Funciones Clave

### `preprocessImageForOCR(canvas: HTMLCanvasElement)`
Pre-procesa la imagen para mejorar OCR:
- Convierte a escala de grises
- Aumenta contraste (factor 2.0)
- Optimizado para cartas MTG

### `extractCardName(ocrText: string): string`
Extrae el nombre probable de la carta del texto OCR:
- Filtra líneas vacías
- Busca primera línea válida
- Descarta símbolos especiales

### `performOCR(imageDataUrl: string): Promise<string>`
Realiza OCR completo:
- Usa Tesseract con configuración optimizada
- Maneja errores gracefully
- Retorna texto procesado

## 📊 Comparación Antes/Después

### Antes:
- OCR básico sin procesamiento
- Problemas con contraste en fondos coloridos
- Caracteres especiales interfieren en búsqueda
- Logging verboso en cada paso

### Después:
- Imagen pre-procesada para mejor OCR
- Manejo consistente de fondos variados
- Extracción inteligente de nombre de carta
- Logging más limpio (cada 10%)

## ⚙️ Configuración de Tesseract

```javascript
{
  // Caracteres permitidos (optimizado para MTG)
  tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 \n\t,—\'"–-(),/',
  
  // Modo de segmentación de página automático
  tessedit_pageseg_mode: Tesseract.PSM.AUTO,
}
```

## 🎬 Cómo Usar

### Captura desde Cámara:
1. Click en "Escanear Carta"
2. Click en "📷 Usar Cámara"
3. Apunta a la carta
4. Click en "📸 Capturar y Escanear"
5. Valida las cartas detectadas

### Upload de Imagen:
1. Click en "Escanear Carta"
2. Click en "📁 Subir Imagen"
3. Selecciona archivo .jpg/.png
4. El sistema procesa y busca automáticamente

## 💡 Consejos para Mejores Resultados

✅ **Iluminación:** Usa luz natural o bien distribuida
✅ **Ángulo:** Captura perpendicular la carta (0° idealmente)
✅ **Distancia:** Acerca la cámara sin que se desenfoqueUsar imágenes nítidas y sin reflejos
✅ **Fondo:** Evita fondos muy coloridos detrás de la carta
✅ **Formato:** JPG/PNG de buena calidad (no comprimido)

## 🐛 Solución de Problemas

### Las cartas no se detectan
- Intenta con mejor iluminación
- Acerca más la cámara
- Toma foto recta (no en ángulo)

### El OCR reconoce caracteres raros
- Esto es normal, el post-procesamiento lo filtra
- El nombre de la carta se extrae de forma inteligente
- La búsqueda por nombre funcionará correctamente

### La búsqueda falla incluso con nombre extraído
- El nombre podría estar escrito diferente en Scryfall
- Intenta manualmente en la barra de búsqueda
- Escribe el nombre completo de la carta

## 🔮 Mejoras Futuras

- [ ] Detección de ángulo y rotación automática
- [ ] Integración con imagen recognition API de Scryfall
- [ ] Machine Learning para detección de cartas
- [ ] Caché de cartas reconocidas recientemente
- [ ] Ajustes de contraste manual en interfaz

---

**Versión:** 1.0  
**Fecha:** Febrero 2026  
**Tecnología:** Tesseract.js v5.x, Canvas 2D API
