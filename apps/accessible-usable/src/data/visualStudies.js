const video = (number, title, description, filename, category) => ({
  number,
  title,
  description,
  filename,
  category
});

export const visualStudiesVideos = [
  video(
    1,
    'Video 1 — Demo completo de la app',
    'Recorrido integral por Home, búsqueda, mazos e inventario para mostrar el flujo diseñado de punta a punta.',
    '01_Demo.mkv',
    'demo'
  ),
  video(
    2,
    'Video 2 — Layout fluido en flujo base',
    'Redimensiono Home y Dashboard para evidenciar cómo Container, Row y Col mantienen la tarea legible.',
    '02_Layout.mkv',
    'responsabilidad'
  ),
  video(
    3,
    'Video 3 — Grid de tarjetas adaptativo',
    'El grid pasa de una a cuatro columnas en cards e inventario respetando la lectura rápida.',
    '03_Row_cols.mkv',
    'responsabilidad'
  ),
  video(
    4,
    'Video 4 — Navegación colapsable en móvil',
    'El navbar expand="lg" colapsa, permite abrir secciones y mantener descubribilidad en pantallas pequeñas.',
    '04_breakpoints.mkv',
    'responsabilidad'
  ),
  video(
    5,
    'Video 5 — Imágenes adaptativas',
    'Las cartas conservan el ratio 63/88 tanto en cards como en el modal para no deformar el contenido.',
    '05_display.mkv',
    'responsabilidad'
  ),
  video(
    6,
    'Video 6 — Modal responsive en escáner',
    'El modal del escáner prioriza CTA principales y evita scroll interminable en móvil.',
    '06_object_fit.mkv',
    'responsabilidad'
  ),
  video(
    7,
    'Video 7 — Reflujo de botones y acciones',
    'Botones y toolbars se apilan con utilidades flex y gap para dejar clara la acción primaria.',
    '07_flex_directions.mkv',
    'responsabilidad'
  ),
  video(
    8,
    'Video 8 — Estadísticas con layout adaptable',
    'Las tarjetas de métricas usan grids auto-fit para seguir siendo comparables sin importar el ancho.',
    '08_Padding.mkv',
    'responsabilidad'
  ),
  video(
    9,
    'Video 9 — Resiliencia frente a orientación',
    'Inventario y listados funcionan igual en portrait y landscape, sin romper flujos.',
    '09_Z-index.mkv',
    'responsabilidad'
  ),
  video(
    10,
    'Video 10 — Contraste y legibilidad en responsive',
    'Tipografía jerárquica y contraste asegurado en mobile evitan lecturas forzadas.',
    '10_clamp.mkv',
    'responsabilidad'
  ),
  video(
    11,
    'Video 11 — Comparativa con flujos degradados',
    'Muestro la diferencia entre layout fluido y los flujos rígidos -no-accessible/-no-usable.',
    '11_aspect_ratio.mkv',
    'responsabilidad'
  ),
  video(
    12,
    'Video 12 — Falta de texto alternativo',
    'Imágenes sin alt dejan al lector de pantalla sin referencia; muestro el impacto y la corrección.',
    '12_alt.mkv',
    'accesibilidad'
  ),
  video(
    13,
    'Video 13 — Navegación solo con ratón',
    'TAB y Enter dejan de funcionar en el flujo degradado, rompiendo tareas clave.',
    '13_flujo.mkv',
    'accesibilidad'
  ),
  video(
    14,
    'Video 14 — Dependencia exclusiva del color',
    'Estados solo diferenciados por color generan ambigüedad; propongo redundancia semántica.',
    '14_color.mkv',
    'accesibilidad'
  ),
  video(
    15,
    'Video 15 — Contraste insuficiente',
    'En móviles el contraste baja y el contenido deja de ser legible; analizo cómo corregirlo.',
    '15_Contraste.mkv',
    'accesibilidad'
  ),
  video(
    16,
    'Video 16 — Etiquetas de formularios ocultas',
    'Sin labels visibles el usuario adivina qué completar; enseño la asociación correcta.',
    '16_labels.mkv',
    'accesibilidad'
  ),
  video(
    17,
    'Video 17 — Indicador de foco eliminado',
    'Navegar con teclado sin foco visible es imposible; restauro estilos consistentes.',
    '17_aria_live.mkv',
    'accesibilidad'
  ),
  video(
    18,
    'Video 18 — Regiones aria-live desactivadas',
    'El sistema no anuncia cambios; agrego regiones vivas para feedback crítico.',
    '18_zoom.mkv',
    'accesibilidad'
  ),
  video(
    19,
    'Video 19 — Zoom deshabilitado',
    'Bloquear gestos de zoom limita autonomía; muestro la restricción y cómo revertirla.',
    '19_reflow.mkv',
    'accesibilidad'
  ),
  video(
    20,
    'Video 20 — Sin mecanismo para saltar bloques',
    'Sin skip links el teclado recorre navegación eterna; describo el impacto y la solución.',
    '20_blink.mkv',
    'accesibilidad'
  ),
  video(
    21,
    'Video 21 — Layout fijo que rompe acceso móvil',
    'Layout rígido obliga a hacer scroll horizontal; comparo con la versión fluida.',
    '21_lang.mkv',
    'accesibilidad'
  ),
  video(
    22,
    'Video 22 — Búsqueda solo exacta',
    'El buscador rechaza variaciones mínimas, aumentando la frustración del usuario.',
    '22_buscador.mkv',
    'usabilidad'
  ),
  video(
    23,
    'Video 23 — Layout desktop-only',
    'El flujo -no-usable impone ancho fijo en móvil obligando a micro scroll lateral.',
    '23_Layout.mkv',
    'usabilidad'
  ),
  video(
    24,
    'Video 24 — Sin guardado automático en inventario',
    'Tras recargar la página se pierde el trabajo porque se desactiva localStorage.',
    '24_persistencia.mkv',
    'usabilidad'
  ),
  video(
    25,
    'Video 25 — Duplicados no agrupados en mazo',
    'Cada copia aparece como tarjeta aislada, dificultando contar cantidades.',
    '25_duplicados.mkv',
    'usabilidad'
  ),
  video(
    26,
    'Video 26 — Importación con formato propietario',
    'Solo se acepta el patrón MTG|Carta|Cantidad; rechazo formatos habituales.',
    '26_formatos.mkv',
    'usabilidad'
  ),
  video(
    27,
    'Video 27 — Información de ayuda oculta',
    'Los microcopys desaparecen y el usuario debe adivinar cada paso.',
    '27_ayuda.mkv',
    'usabilidad'
  ),
  video(
    28,
    'Video 28 — Jerarquía visual confusa',
    'Todo se ve como botón premium en Home -no-usable, sin claras prioridades.',
    '28_botones.mkv',
    'usabilidad'
  ),
  video(
    29,
    'Video 29 — Escáner sin feedback ni vista previa',
    'El escáner oculta la imagen cargada y los botones no indican progreso.',
    '29_procesando.mkv',
    'usabilidad'
  ),
  video(
    30,
    'Video 30 — Métricas de inventario congeladas',
    'Los KPIs siempre muestran 1 carta y 0 € aunque la colección crezca.',
    '31_metricas.mkv',
    'usabilidad'
  ),
  video(
    31,
    'Video 31 — Sin detalle al tocar cartas en la búsqueda',
    'En -no-usable las tarjetas del buscador dejan de abrir el modal con información.',
    '30_detalle_Carta.mkv',
    'usabilidad'
  )
];

export const visualStudySections = [
  {
    key: 'responsabilidad',
    title: 'Sección 1: Responsabilidad',
    summary: '10 clips centrados en responsive design y continuidad de uso.'
  },
  {
    key: 'accesibilidad',
    title: 'Sección 2: Accesibilidad',
    summary: '10 errores intencionales en el recorrido -no-accesible con sus correcciones.'
  },
  {
    key: 'usabilidad',
    title: 'Sección 3: Usabilidad',
    summary: '10 hallazgos de UX en el flujo -no-usable con su impacto.'
  }
];
