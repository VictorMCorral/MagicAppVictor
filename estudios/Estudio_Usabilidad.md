# 🧠 Estudio de Usabilidad (UX)

Este estudio analiza la **facilidad de uso** y la **eficiencia del usuario**. A diferencia de la accesibilidad (que permite entrar), la usabilidad trata sobre lo placentera y efectiva que es la estancia en la aplicación.

## ⚖️ Análisis de los 10 Grandes Errores de Usabilidad

A continuación se detallan 10 fallos de UX identificados en la versión **non-usable** y su solución en **accessible-usable**:

| # | Error en `non-usable` | Impacto en el Usuario | Solución en `accessible-usable` |
| :--- | :--- | :--- | :--- |
| **1** | **Layout Fijo (1200px)** | El sitio es inutilizable en teléfonos o tablets. | Layout responsivo con Bootstrap Grid. |
| **2** | **Scroll Horizontal Forzado** | Oculta elementos importantes fuera de la vista inicial. | Adaptación de componentes al ancho de pantalla. |
| **3** | **Búsqueda Exacta Forzada** | No encontrar cartas por pequeños errores de tipeo. | Implementación de **Fuzzy Search** con Fuse.js. |
| **4** | **Sin Guardado Automático** | Pérdida de minutos de trabajo si el navegador falla. | Servicio de **Auto-save** cada 30 segundos. |
| **5** | **Gráficos Estáticos** | Los datos son informativos pero no explorables. | Gráficos reactivos con tooltips y filtros de datos. |
| **6** | **Falta de Agrupación de Duplicados** | Pantallas de mazo desordenadas y largas. | Lógica de agrupación (4x [Nombre de Carta]). |
| **7** | **Acciones Críticas sin Confirmación** | Borrado accidental de mazos o cartas. | Modales de confirmación para acciones destructivas. |
| **8** | **Jerarquía Visual Confusa** | No hay un camino claro para el flujo de usuario. | Uso de colores de acción (oro) para botones principales. |
| **9** | **Filtros Avanzados Deshabilitados** | Obliga al usuario a buscar entre miles de resultados. | Sidebar con filtros por color, rareza y coste. |
| **10** | **Feedback Lento de APIs** | El usuario no sabe si la app está cargando o colgada. | Uso de **Spinners** y estados de carga en botones. |

## 🚀 Puntos de Fricción vs. Fluidez (Detalles)

| Tarea | Esfuerzo en Non-Usable | Esfuerzo en Accessible-Usable |
| :--- | :--- | :--- |
| **Buscar una carta** | Alto (requiere nombre exacto) | Bajo (tolera errores) |
| **Gestionar Mazos** | Alto (riesgo de pérdida) | Mínimo (autoguardado) |
| **Completar Formulario** | Confuso (sin guía) | Rápido (labels claros) |
| **Analizar el Mazo** | Difícil (datos planos) | Intuitivo (gráficos dinámicos) |

## 🏁 Conclusión
Una aplicación puede ser funcional pero ser una "mala" aplicación si la experiencia de usuario es frustrante. La versión `non-usable` nos enseña que el software debe trabajar para el humano, y no al revés. La versión `accessible-usable` optimiza cada paso para que el usuario se centre en el juego y no en el funcionamiento de la herramienta.
