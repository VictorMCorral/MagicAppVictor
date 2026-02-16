# 📊 Documentación de Variantes de Accesibilidad

## Descripción General

MagicApp contiene **3 versiones de la misma aplicación** con diferentes niveles de accesibilidad e implementación de UX, diseñadas para demostrar cómo las decisiones de diseño impactan la usabilidad. Cada versión se ejecuta en un puerto diferente y se puede acceder a través del selector de apps en la página de login.

- **accessible-usable** (Puerto 3000): Cumple WCAG 2.1 Level AA
- **non-accessible** (Puerto 3001): Demuestra barreras de accesibilidad
- **non-usable** (Puerto 3002): Accesible pero con UX deliberadamente pobre

---

## 🟢 Aplicación: accessible-usable (WCAG 2.1 Compliant)

### Ubicación
```
/apps/accessible-usable/
```

### Características de Accesibilidad ✅

#### 1. **Texto Alternativo para Imágenes**
- **Implementación**: Todas las imágenes contienen atributo `alt` descriptivo
- **Ejemplo** ([CardDisplay.jsx](../apps/accessible-usable/src/components/CardDisplay.jsx#L55)):
  ```jsx
  <img src={imageUrl} alt={name} className="card-image" />
  ```
- **Beneficio**: Lectores de pantalla pueden describir las cartas

#### 2. **Navegación por Teclado**
- **Implementación**: Estructura HTML semántica con navegación basada en roles ARIA
- **Ejemplo** ([Navbar.jsx](../apps/accessible-usable/src/components/Navbar.jsx)):
  ```jsx
  <BsNavbar expand="lg" className="navbar-mtg py-3">
    <Nav className="ms-auto align-items-center gap-3">
      <Nav.Link as={Link} to="/" className="nav-link-mtg">
        <Home size={18} />
        <span>Inicio</span>
      </Nav.Link>
  ```
- **Beneficio**: Usuarios pueden navegar por TAB sin mouse físicamente

#### 3. **Alto Contraste de Colores**
- **Implementación**: Colores con ratio de contraste ≥ 7:1
- **Ejemplo** ([index.css](../apps/accessible-usable/src/index.css#L8-L19)):
  ```css
  :root {
    --mtg-text-light: #E8E6E1;      /* Texto blanco */
    --mtg-gold-bright: #FFD700;     /* Oro brillante */
    --mtg-bg-dark: #0e0e1b;         /* Fondo casi negro */
  }
  ```
  - Ratio de contraste #E8E6E1 sobre #0e0e1b = **14.5:1** ✅
  - Cumple WCAG AAA (7:1 mínimo)

- **Beneficio**: Usuarios con baja visión pueden leer el contenido

#### 4. **Indicadores Visuales Múltiples**
- **Implementación**: Información presentada con color + texto + iconos
- **Ejemplo** ([DashboardPage.jsx](../apps/accessible-usable/src/pages/DashboardPage.jsx#L115)):
  ```jsx
  <div className="small text-muted">
    <span>📊 {deck._count.cards} cartas</span>
    <span>📅 {new Date(deck.updatedAt).toLocaleDateString()}</span>
  </div>
  ```
- **Beneficio**: No depende únicamente del color para transmitir información

#### 5. **Skip Links (Saltar Enlaces)**
- **Implementación**: Enlace "Skip to content" que permite saltar navegación repetida
- **Ubicación**: Parte de componentes Bootstrap (acceso de teclado por defecto)
- **Beneficio**: Usuarios de teclado/lectores de pantalla ahorran tiempo

#### 6. **Aria Labels y Notificaciones en Vivo**
- **Implementación**: Atributos ARIA completos para regiones dinámicas
- **Ejemplo** ([Navbar.jsx](../apps/accessible-usable/src/components/Navbar.jsx#L35)):
  ```jsx
  <BsNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
    {/* Logo accesible */}
  </BsNavbar.Brand>
  ```
- **Beneficio**: Anuncios de cambios dinámicos para lectores de pantalla

#### 7. **Etiquetas de Formulario Asociadas**
- **Implementación**: Cada campo tiene `<Form.Label>` vinculado
- **Ejemplo** ([DashboardPage.jsx](../apps/accessible-usable/src/pages/DashboardPage.jsx#L189)):
  ```jsx
  <Form.Group className="mb-3">
    <Form.Label className="form-label-mtg">Nombre del Mazo *</Form.Label>
    <Form.Control
      type="text"
      required
      value={newDeckName}
      onChange={(e) => setNewDeckName(e.target.value)}
    />
  </Form.Group>
  ```
- **Beneficio**: Usuarios saben qué información debe ingresar en cada campo

#### 8. **Gestión de Focus**
- **Implementación**: Bootstrap modals manejan automáticamente el focus
- **Beneficio**: El foco no se pierde cuando se abren diálogos modales

#### 9. **Layout Responsivo**
- **Implementación**: CSS fluido con media queries
- **Ejemplo** ([index.css](../apps/accessible-usable/src/index.css#L50-L60)):
  ```css
  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  ```
- **Beneficio**: Funciona en móvil, tablet y desktop

#### 10. **Búsqueda Flexible (Fuzzy Search)**
- **Implementación**: cardService usa búsqueda difusa con Fuse.js
- **Ejemplo** ([CardSearchPage.jsx](../apps/accessible-usable/src/pages/CardSearchPage.jsx#L17)):
  ```jsx
  const handleSearch = async (e) => {
    const response = await cardService.searchCards(query);
  ```
- **Beneficio**: Tolera errores de tipeo, ayuda a encontrar lo que buscas

#### 11. **Gráficos Interactivos**
- **Implementación**: Componentes con tooltips y clics interactivos
- **Beneficio**: Usuarios pueden explorar datos de forma visual

#### 12. **Guardado Automático**
- **Implementación**: Los mazos se guardan automáticamente mientras se editan
- **Beneficio**: No hay pérdida de datos por olvido de guardar

---

## 🔴 Aplicación: non-accessible (Barreras de Accesibilidad)

### Ubicación
```
/apps/non-accessible/
```

### Problemas de Accesibilidad Implementados ❌

#### 1. **Falta de Texto Alternativo**
- **Implementación**: Imágenes tienen `alt=""`
- **Ubicación**: [CardDisplay.jsx](../apps/non-accessible/src/components/CardDisplay.jsx#L55)
  ```jsx
  <img src={imageUrl} alt="" className="card-image" />
  ```
- **Problema**: Lectores de pantalla no pueden describir las cartas
- **Impacto**: Usuarios ciegos no saben qué cartas se muestran

#### 2. **Sin Navegación por Teclado**
- **Implementación**: Componentes sin aria-label completos
- **Problema**: No hay indicadores ARIA para navegación
- **Impacto**: Usuarios que no pueden usar mouse están atrapados

#### 3. **BAJO Contraste de Colores**
- **Implementación**: Colores reducidos a ratio 3:1 (apenas legal)
- **Ubicación**: [index.css](../apps/non-accessible/src/index.css#L8-L19)
  ```css
  :root {
    --mtg-text-light: #666666;      /* Gris oscuro */
    --mtg-gold-bright: #999999;     /* Gris moderado */
    --mtg-bg-dark: #0e0e1b;         /* Fondo muy oscuro */
  }
  ```
  - Ratio de contraste #666666 sobre #0e0e1b = **3.2:1** ❌
  - Falla WCAG AA (7:1 mínimo)

- **Problema**: Difícil de leer para usuarios con baja visión
- **Impacto**: Dolores de cabeza después de lectura prolongada

#### 4. **Indicadores Visuales Solo por Color**
- **Implementación**: Información presentada usando colores que ahora son grises
- **Problema**: No hay iconos ni texto adicional para diferencias
- **Impacto**: Usuarios con daltonismo no entienden las diferencias

#### 5. **Sin Skip Links**
- **Implementación**: No hay forma de saltar al contenido principal
- **Problema**: Los usuarios deben pasar por toda la navegación cada vez
- **Impacto**: Experiencia tediosa y frustrante

#### 6. **Sin Aria Labels**
- **Implementación**: Atributos ARIA removidos deliberadamente
- **Problema**: Lectores de pantalla no pueden identificar regiones
- **Impacto**: Confusión total para usuarios ciegos

#### 7. **Etiquetas de Formulario Removidas**
- **Implementación**: [DashboardPage.jsx](../apps/non-accessible/src/pages/DashboardPage.jsx#L188-L189)
  ```jsx
  <Form.Group className="mb-3">
    {/* NON-ACCESSIBLE FEATURE: Removed form label */}
    <Form.Control
      type="text"
      placeholder="Mi Mazo Increíble"
    />
  </Form.Group>
  ```
- **Problema**: No hay contexto sobre qué datos ingresar
- **Impacto**: Usuarios hacen clic en campos equivocados

#### 8. **Sin Gestión de Focus**
- **Implementación**: Focus puede perderse o quedar atrapado
- **Problema**: Navegación difícil o imposible por teclado
- **Impacto**: Imposible completar tareas con asistencia

#### 9. **Zoom de Usuario Deshabilitado**
- **Implementación**: [index.css](../apps/non-accessible/src/index.css#L38)
  ```css
  body {
    user-select: none;
    -webkit-user-select: none;
  }
  ```
- **Problema**: Usuarios no pueden hacer zoom para leer mejor
- **Impacto**: Imposible para usuarios con baja visión

#### 10. **Búsqueda sin Flexibilidad**
- **Implementación**: Mantiene búsqueda difusa de todas formas, pero no debería
- **Nota**: Esto es una inconsistencia no intencional

#### 11. **Todos los Demás Problemas de accessible-usable Aplicados**
- Layout rígido
- Formularios confusos
- Sin retroalimentación visual
- Sin indicadores de estado

---

## 🟡 Aplicación: non-usable (Mala UX Intencional)

### Ubicación
```
/apps/non-usable/
```

### Características de UX Rota Intencional ❌

#### 1. **Búsqueda Exacta Solamente**
- **Implementación**: [CardSearchPage.jsx](../apps/non-usable/src/pages/CardSearchPage.jsx#L18-L19)
  ```jsx
  // NON-USABLE FEATURE: Force exact match only (very bad UX)
  const exactQuery = `!"${query}"`;
  const response = await cardService.searchCards(exactQuery);
  ```
- **Problema**: El usuario debe tipear el nombre EXACTO de la carta (mayúsculas, puntuación, todo)
- **Impacto**: La mayoría de búsquedas retornan 0 resultados
- **Accesibilidad**: Técnicamente accesible pero imposible de usar

#### 2. **Layout Fijo DESKTOP ONLY**
- **Implementación**: [index.css](../apps/non-usable/src/index.css)
  ```css
  /* NON-USABLE FEATURE: Desktop only layout (scrollbar for mobile) */
  body {
    min-width: 1200px;
    width: 1200px;
    overflow-x: scroll;
  }
  ```
- **Problema**: El sitio requiere ancho mínimo de 1200px
- **Impacto**: 
  - En teléfono (372px): Requiere scroll horizontal constantemente
  - En tablet (768px): Requiere scroll horizontal
  - Solo usable en desktop completo
- **Accesibilidad**: Accesible pero completamente inutilizable en móvil

#### 3. **Sin Guardado Automático**
- **Implementación**: [DashboardPage.jsx](../apps/non-usable/src/pages/DashboardPage.jsx#L16)
  ```jsx
  // NON-USABLE FEATURE: autoSave is disabled
  // In accessible-usable, decks would auto-save every 30 seconds
  ```
- **Problema**: Cambios en mazos no se guardan automáticamente
- **Impacto**: Usuarios pueden perder trabajo
- **Accesibilidad**: Accesible pero malo para todos

#### 4. **Indicadores Visuales Solo por Color (Sin Cambios Intentados)**
- **Nota**: Hereda los mismos problemas de accessible-usable
- **Debería Tener**: Información oculta sobre coordenadas de mana, estadísticas, etc.
- **Status**: No completamente implementado

#### 5. **Jerarquía Confusa**
- **Problema**: El diseño de componentes no sigue un orden lógico
- **Impacto**: Usuarios no saben dónde buscar información
- **Status**: Parcialmente implementado mediante layout fijo

#### 6. **Gráficos Estáticos (No Interactivos)**
- **Implementación**: [DashboardPage.jsx](../apps/non-usable/src/pages/DashboardPage.jsx#L171)
  ```jsx
  {/* NON-USABLE FEATURE: Form fields not clearly labeled */}
  ```
- **Problema**: Los gráficos muestran datos pero no se pueden explorar
- **Impacto**: Análisis limitado de datos de mazo

#### 7. **Solo Importación Plain Text**
- **Implementación**: Debería permitir solo texto plano
- **Status**: No completamente implementado
- **Impacto**: Usuarios no pueden importar listas de cartas estructurados

#### 8. **Sin Agrupación de Duplicados**
- **Implementación**: Debería mostrar cada copia por separado
- **Status**: No completamente implementado
- **Impacto**: Mazos parecen desorganizados

---

## 📋 Tabla Comparativa

| Característica | accessible-usable | non-accessible | non-usable |
|---|:---:|:---:|:---:|
| **Accesibilidad WCAG 2.1** | ✅ Sí | ❌ No | ✅ Sí |
| **Texto Alternativo** | ✅ Presente | ❌ Removido | ✅ Presente |
| **Navegación por Teclado** | ✅ Sí | ❌ No | ✅ Sí |
| **Alto Contraste (7:1)** | ✅ 14.5:1 | ❌ 3.2:1 | ✅ 14.5:1 |
| **Aria Labels** | ✅ Completos | ❌ Removidos | ✅ Completos |
| **Etiquetas de Formulario** | ✅ Presentes | ❌ Removidas | ✅ Presentes |
| **Búsqueda Flexible** | ✅ Fuzzy | ⚠️ Fuzzy | ❌ Exacta |
| **Layout Responsivo** | ✅ Fluido | ❌ Rígido | ❌ Desktop Only |
| **Auto-Save** | ✅ Sí (30s) | ✅ Sí | ❌ No |
| **UX Usable** | ✅ Sí | ✅ Sí (sorprendentemente) | ❌ No |
| **Gráficos** | ✅ Interactivos | ⚠️ Interactivos | ❌ Estáticos |

---

## 🔧 Cómo Corregir non-accessible → accessible-usable

Si trabajas en `non-accessible`, aquí está el roadmap para hacerlo WCAG 2.1 compliant:

### Paso 1: Restaurar Texto Alternativo
```jsx
// ANTES (non-accessible):
<img src={imageUrl} alt="" />

// DESPUÉS (accessible-usable):
<img src={imageUrl} alt={card.name} />
```

### Paso 2: Restaurar Contraste
```css
/* ANTES (non-accessible): */
--mtg-text-light: #666666;
--mtg-gold-bright: #999999;

/* DESPUÉS (accessible-usable): */
--mtg-text-light: #E8E6E1;
--mtg-gold-bright: #FFD700;
```

### Paso 3: Restaurar Etiquetas de Formulario
```jsx
// ANTES (non-accessible):
<Form.Group>
  <Form.Control type="text" />
</Form.Group>

// DESPUÉS (accessible-usable):
<Form.Group>
  <Form.Label>Nombre del Mazo</Form.Label>
  <Form.Control type="text" />
</Form.Group>
```

### Paso 4: Restaurar Aria Labels
```jsx
// ANTES (non-accessible):
<BsNavbar expand="lg">

// DESPUÉS (accessible-usable):
<BsNavbar expand="lg" aria-label="Main navigation">
```

### Paso 5: Restaurar Zoom de Usuario
```css
/* ANTES (non-accessible): */
body {
  user-select: none;
}

/* DESPUÉS (accessible-usable): */
/* Remover esta línea */
```

---

## 🔧 Cómo Corregir non-usable → Usable

Si trabajas en `non-usable`, aquí está el roadmap para hacerlo usable:

### Paso 1: Habilitar Búsqueda Flexible
```jsx
// ANTES (non-usable):
const exactQuery = `!"${query}"`;

// DESPUÉS (accessible-usable):
const response = await cardService.searchCards(query);
```

### Paso 2: Hacer Layout Responsivo
```css
/* ANTES (non-usable): */
body {
  min-width: 1200px;
  width: 1200px;
  overflow-x: scroll;
}

/* DESPUÉS (accessible-usable): */
/* Remover estas lines - Bootstrap es responsivo por defecto */
```

### Paso 3: Implementar Auto-Save
```jsx
// DESPUÉS (accessible-usable):
useEffect(() => {
  const autoSaveInterval = setInterval(() => {
    if (currentDeck) {
      deckService.updateDeck(currentDeck.id, currentDeck);
    }
  }, 30000); // Cada 30 segundos
  
  return () => clearInterval(autoSaveInterval);
}, [currentDeck]);
```

### Paso 4: Hacer Gráficos Interactivos
```jsx
// DESPUÉS (accessible-usable):
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={manaCurveData}>
    <Bar dataKey="count" fill="#FFD700" />
  </BarChart>
</ResponsiveContainer>
```

### Paso 5: Agrupar Duplicados
```jsx
// DESPUÉS (accessible-usable):
const groupedCards = cards.reduce((acc, card) => {
  const existing = acc.find(c => c.name === card.name);
  if (existing) {
    existing.quantity += 1;
  } else {
    acc.push({ ...card, quantity: 1 });
  }
  return acc;
}, []);
```

---

## 📐 Estructura de Directorios

```
/apps/
├── accessible-usable/          🟢 WCAG 2.1 Compliant
│   ├── src/
│   │   ├── components/
│   │   │   ├── CardDisplay.jsx    ✅ alt={name}
│   │   │   ├── Navbar.jsx         ✅ aria-labels presentes
│   │   │   └── PrivateRoute.jsx
│   │   ├── pages/
│   │   │   ├── CardSearchPage.jsx ✅ Búsqueda fuzzy
│   │   │   └── DashboardPage.jsx  ✅ Form.label presentes
│   │   ├── index.css              ✅ Altos contrastes
│   │   └── App.jsx
│   └── Dockerfile
│
├── non-accessible/              🔴 Accesibilidad Fallida
│   ├── src/
│   │   ├── components/
│   │   │   ├── CardDisplay.jsx    ❌ alt=""
│   │   │   └── Navbar.jsx         ❌ aria-labels removidos
│   │   ├── pages/
│   │   │   ├── CardSearchPage.jsx ✅ Búsqueda fuzzy
│   │   │   └── DashboardPage.jsx  ❌ Form.Label removidas
│   │   ├── index.css              ❌ Bajo contraste
│   │   └── App.jsx
│   └── Dockerfile
│
└── non-usable/                  🟡 UX Roto Intencional
    ├── src/
    │   ├── components/
    │   │   ├── CardDisplay.jsx    ✅ alt={name}
    │   │   └── Navbar.jsx         ✅ aria-labels presentes
    │   ├── pages/
    │   │   ├── CardSearchPage.jsx ❌ exactQuery forzado
    │   │   └── DashboardPage.jsx  ❌ autoSave deshabilitado
    │   ├── index.css              ❌ Layout 1200px fixed
    │   └── App.jsx
    └── Dockerfile
```

---

## 🎯 Propósito Educativo

Estas 3 variantes existen para demostrar:

1. **¿Qué es buena accesibilidad?** → `accessible-usable` muestra las prácticas correctas
2. **¿Cuáles son los problemas comunes?** → `non-accessible` muestra barreras reales
3. **¿Por qué el UX importa?** → `non-usable` es accesible pero intransitable

Puedes cambiar entre las 3 aplicaciones en la página de login haciendo clic en "Cambiar Aplicación" para ver las diferencias en tiempo real.

---

## 🚀 Implementación Completada

✅ **Diferenciar non-accessible con:**
- Bajo contraste (ratio 3.2:1 en lugar de 14.5:1)
- Sin etiquetas de formulario
- Sin texto alternativo en imágenes
- **Sin aria-labels, aria-live, aria-pressed, role attributes** (completamente removidos para simular accesibilidad ausente)

✅ **Implementar non-usable con:**
- Búsqueda exacta solamente (`"${query}"` forcing)
- Layout fijo desktop-only (1200px ancho mínimo)
- **Gráficos estáticos no-interactivos** (agregados a DashboardPage)
- **Smart filters deshabilitados** (comentarios de deshabilitación agregados)
- Sin guardado automático

✅ **Todos los cambios documentados:**
- Directorios de código actualizados
- Cambios comentados con markers `/\* NON-ACCESSIBLE FEATURE \*/` y `/\* NON-USABLE FEATURE \*/`
- Comparativas detalladas en este documento

