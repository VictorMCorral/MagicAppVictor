# Protocolo de Agentes de Desarrollo (AGENTS.md)

Este documento establece las directrices obligatorias para GitHub Copilot y otros agentes de IA que trabajen en este repositorio.

## 1. Implementación de Funcionalidades
- **TDD (Test Driven Development) Recomendado**: Cada nueva funcionalidad o corrección debe ir acompañada de sus respectivos tests (Unitarios, Integración o E2E según corresponda).
- **Calidad de Código**: El código debe seguir las mejores prácticas, ser modular y estar documentado.

## 2. Validación Pre-Commit
- **Ejecución de Tests**: Antes de realizar cualquier commit, se deben ejecutar **todos** los tests del proyecto (`backend` y `frontend`).
- **Cero Errores**: Todos los tests deben pasar exitosamente (`correctos`). Si un test falla, el commit debe abortarse y el error debe corregirse.

## 3. Flujo de Trabajo y Consentimiento (CRÍTICO)
- **Control del Usuario**: NUNCA se realizará un commit sin el consentimiento explícito del usuario.
- **Evaluación Manual**: Antes de proceder al commit, el agente debe:
    1. Mostrar un resumen de los cambios.
    2. Confirmar que los tests han pasado.
    3. Notificar al usuario que la aplicación está lista para ser evaluada manualmente.
    4. Esperar el veredicto del usuario.

## 4. Estándar de Commit y Etiquetas
- Cada commit debe incluir etiquetas descriptivas para clasificar el cambio.
- **Formato Sugerido**: `[TIPO][ETIQUETA] Descripción del cambio`
- **Etiquetas comunes**:
    - `[FEAT]`: Nueva funcionalidad.
    - `[FIX]`: Corrección de errores.
    - `[TEST]`: Añadir o modificar tests.
    - `[REFACTOR]`: Mejora del código sin cambiar funcionalidad.
    - `[DOCS]`: Cambios en documentación.
    - `[CHORE]`: Tareas de mantenimiento.

---
**REGLA DE ORO:** NO HACER NINGÚN COMMIT SIN EL CONSENTIMIENTO EXPLÍCITO DEL USUARIO.
