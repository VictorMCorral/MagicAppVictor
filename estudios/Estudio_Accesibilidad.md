# ♿ Estudio de Accesibilidad

Este estudio se centra en cómo la falta de estándares de accesibilidad excluye a grupos de usuarios y cómo la versión **accessible-usable** corrige estos fallos críticos presentes en **non-accessible**.

## ⚖️ Análisis de los 10 Grandes Errores de Accesibilidad

A continuación se detallan 10 fallos críticos identificados en la versión **non-accessible** y cómo se han resuelto en la versión **accessible-usable**:

| # | Error en `non-accessible` | Impacto en el Usuario | Solución en `accessible-usable` |
| :--- | :--- | :--- | :--- |
| **1** | **Contraste insuficiente (3.2:1)** | Usuarios con baja visión no pueden leer el texto. | Uso de oro brillante sobre negro profundo (**14.5:1**). |
| **2** | **Falta de Texto Alt en Imágenes** | Los lectores de pantalla ignoran las cartas o leen el nombre del archivo. | Atributos `alt` descriptivos con el nombre de cada carta. |
| **3** | **Inputs sin Etiquetas (Labels)** | Al tabular, el usuario no sabe qué información pide el campo. | Uso estricto de `<Form.Label>` vinculado por ID al input. |
| **4** | **Ausencia de ARIA Labels** | Los botones que solo tienen iconos (como "Borrar") son mudos. | Inclusión de `aria-label="Eliminar mazo"` en todos los botones de icono. |
| **5** | **Zoom Deshabilitado** | El CSS bloquea el zoom del navegador en dispositivos táctiles. | Eliminación de restricciones de escalado en el viewport y CSS. |
| **6** | **Sin Enlaces de Salto (Skip Links)** | Navegación tediosa para usuarios de teclado (repetir toda la navbar). | Implementación de enlaces ocultos para saltar directamente al contenido. |
| **7** | **Semántica Pobre (Div-itis)** | Los lectores de pantalla no detectan regiones como `nav` o `main`. | Uso de etiquetas HTML5 semánticas (`<header>`, `<nav>`, `<main>`). |
| **8** | **Falta de Indicador de Foco** | El usuario de teclado no ve en qué botón está situado. | Estilos `:focus` claros con bordes dorados de alta visibilidad. |
| **9** | **Gestión de Foco en Modales** | Al abrir un modal, el foco se queda en el fondo, no en el formulario. | Uso de `FocusTrap` (vía Bootstrap) para dirigir el foco al modal. |
| **10** | **Feedback solo visual** | Los errores solo se indican con color rojo sin texto de apoyo. | Mensajes de error textuales y uso de `role="alert"` para anuncios. |

## 🛠 Lista de Mejoras Implementadas (Resumen)

| Fallo Identificado | Impacto | Solución en Versión Accesible |
| :--- | :--- | :--- |
| **Bajo Contraste** | Fatiga visual / Ilegibilidad | Ratio > 7:1 (WCAG AAA) |
| **Sin Etiquetas ARIA** | El lector no entiende el botón | `aria-label` en iconos y botones |
| **Forms sin label** | No se sabe qué escribir | Etiquetas `<Form.Label>` vinculadas |
| **Imágenes "mudas"** | Usuario ciego no ve contenido | Texto descriptivo en atributo `alt` |

## 🎯 Conclusión
La accesibilidad no es "añadir extras", es asegurar que nadie se quede fuera. La versión `non-accessible` crea barreras artificiales que desaparecen con una correcta implementación semántica y visual en la versión `accessible-usable`.
