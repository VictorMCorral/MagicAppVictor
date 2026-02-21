# 📱 Estudio de Responsividad

Este estudio analiza la capacidad de la aplicación para adaptarse a diferentes tamaños de pantalla, comparando la versión **accessible-usable** con la versión **non-usable**.

## 🔍 Análisis Comparativo

### 1. La Barrera del Layout Fijo (`non-usable`)
En la versión `non-usable`, se ha implementado deliberadamente una restricción de ancho que rompe la experiencia en dispositivos móviles.

*   **Implementación Técnica:**
    ```css
    /* apps/non-usable/src/index.css */
    html {
      min-width: 1200px;
      overflow-x: scroll;
    }
    body {
      width: 1200px;
      margin: 0 auto;
    }
    ```
*   **Problema:** Al forzar un ancho de 1200px, los usuarios de teléfonos inteligentes o tablets se ven obligados a realizar un **scroll horizontal** constante. Esto oculta información crítica y dificulta la navegación básica.
*   **Impacto en Usuario:** Frustración, pérdida de contexto visual y abandono de la página si el elemento buscado está fuera del campo de visión inicial.

### 2. La Solución Fluida (`accessible-usable`)
La versión `accessible-usable` utiliza un sistema de rejilla flexible (basado en Bootstrap y CSS moderno) que garantiza que el contenido se reorganice según el espacio disponible.

*   **Buenas prácticas implementadas:**
    *   **Uso de Bootstrap Grid System:** Utiliza componentes `<Container>`, `<Row>` y `<Col>` para estructurar la información. Por ejemplo, en el dashboard, los mazos se muestran en 1 columna en móviles, 2 en tablets y 3 en pantallas grandes (`md={2} lg={3}`).
    *   **Navegación Inteligente:** El componente `Navbar` utiliza la propiedad `expand="lg"` para transformarse automáticamente en un menú colapsable (hamburguesa) en pantallas menores a 992px, protegiendo el espacio vertical.
    *   **Imágenes Proporcionales:** Las cartas de Magic utilizan `max-width: 100%` y `height: auto`, asegurando que nunca se desborden de su contenedor, independientemente de la resolución.
    *   **SVG con ViewBox:** En el mapa web (`/sitemap`), se utiliza el atributo `viewBox` para que el diagrama de nodos y conexiones escale de forma proporcional, manteniendo la integridad visual sin introducir scroll horizontal.
    *   **Tipografía Fluida:** Uso de unidades `rem` y `clamp()` para asegurar que los títulos sean grandes en desktop pero se ajusten automáticamente en pantallas pequeñas sin romper el layout.

## 📊 Tabla Comparativa

| Característica | Versión Non-Usable | Versión Accessible-Usable |
| :--- | :--- | :--- |
| **Ancho de Contenedor** | Fijo (1200px) | Fluido (100%) |
| **Scroll Horizontal** | Obligatorio en móviles | Inexistente (se adapta) |
| **Menú de Navegación** | Siempre visible (se corta) | Colapsable (Hamburguesa) |
| **Experiencia Móvil** | Inutilizable | Óptima |

## 💡 Conclusión
La responsividad no es solo una característica visual, es un requisito de usabilidad. La versión `non-usable` demuestra que incluso una web con buen contenido puede ser rechazada si obliga al usuario a luchar contra la interfaz para ver la información.
