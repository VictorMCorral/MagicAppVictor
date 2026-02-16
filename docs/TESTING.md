# 🧪 Guía de Pruebas - MTG Nexus Hub v1.0

## Checklist de Funcionalidades MVP

### ✅ Autenticación

#### Registro de Usuario
- [ ] Abrir http://localhost:3000/register
- [ ] Rellenar formulario con:
  - Email: test@ejemplo.com
  - Username: testuser
  - Password: test123456
- [ ] Click en "Registrarse"
- [ ] Verificar redirección a /dashboard
- [ ] Verificar que aparece username en navbar

#### Login
- [ ] Abrir http://localhost:3000/login
- [ ] Ingresar credenciales del usuario creado
- [ ] Click en "Iniciar Sesión"
- [ ] Verificar redirección a /dashboard

#### Logout
- [ ] Click en "Salir" en navbar
- [ ] Verificar que se cierra sesión
- [ ] Verificar redirección a página de inicio

### ✅ Búsqueda de Cartas

#### Búsqueda Básica
- [ ] Ir a "Buscar Cartas" en navbar
- [ ] Buscar: "Lightning Bolt"
- [ ] Verificar que aparecen resultados
- [ ] Click en una carta para ver detalles

#### Búsqueda Avanzada
- [ ] Buscar: "type:creature"
- [ ] Buscar: "c:red"
- [ ] Buscar: "commander"
- [ ] Verificar que cada búsqueda retorna resultados correctos

### ✅ Gestión de Mazos

#### Crear Mazo
- [ ] Ir a "Mis Mazos" (requiere login)
- [ ] Click en "Nuevo Mazo"
- [ ] Nombre: "Mi Mazo de Prueba"
- [ ] Formato: "Commander" (opcional)
- [ ] Click en "Crear"
- [ ] Verificar que aparece en la lista

#### Ver Mazo
- [ ] Click en "Ver Mazo" de un mazo creado
- [ ] Verificar que muestra nombre y estadísticas
- [ ] Estadísticas deben mostrar 0 cartas inicialmente

#### Añadir Cartas al Mazo
- [ ] Dentro de un mazo, click en "Añadir Carta"
- [ ] Escribir: "Sol Ring"
- [ ] Click en "Añadir"
- [ ] Verificar que aparece en la lista del mazo
- [ ] Repetir con otras cartas:
  - "Lightning Bolt"
  - "Counterspell"
  - "Command Tower"

#### Eliminar Carta del Mazo
- [ ] Click en el icono de basura de una carta
- [ ] Confirmar eliminación
- [ ] Verificar que desaparece de la lista

#### Actualizar Mazo
- [ ] En la vista del mazo, verificar que las estadísticas se actualizan:
  - Total de cartas
  - Cartas únicas
  - CMC promedio
  - Valor total en EUR (si disponible)

#### Eliminar Mazo
- [ ] En "Mis Mazos", click en icono de basura
- [ ] Confirmar eliminación
- [ ] Verificar que desaparece de la lista

### ✅ Importación/Exportación

#### Importar Mazo desde Texto
- [ ] Crear un mazo nuevo
- [ ] Click en "Importar"
- [ ] Pegar el siguiente texto:
```
4 Lightning Bolt
2 Counterspell
1 Sol Ring
3 Command Tower
```
- [ ] Click en "Importar"
- [ ] Verificar que muestra resultados (éxitos/fallos)
- [ ] Verificar que las cartas aparecen en el mazo

#### Exportar Mazo a Texto
- [ ] En un mazo con cartas, click en "Exportar"
- [ ] Verificar que se descarga archivo .txt
- [ ] Abrir archivo y verificar formato:
```
// Nombre del Mazo
// Formato: ...

// Creature
4 Creature Name

// Instant
4 Lightning Bolt
```

### ✅ Navegación y UI

#### Navegación Pública (sin login)
- [ ] Página de Inicio accesible
- [ ] "Buscar Cartas" accesible
- [ ] "Iniciar Sesión" accesible
- [ ] "Registrarse" accesible
- [ ] "Mis Mazos" redirige a /login

#### Navegación Privada (con login)
- [ ] Todas las páginas públicas siguen accesibles
- [ ] "Mis Mazos" accesible
- [ ] Botón "Salir" visible
- [ ] Username visible en navbar

#### Responsive Design
- [ ] Abrir en móvil (o DevTools modo responsive)
- [ ] Verificar que navbar se adapta
- [ ] Verificar que cards grid se adapta
- [ ] Verificar que formularios son usables

## 🔧 Pruebas de API (con Postman/cURL)

### Health Check
```bash
curl http://localhost:5000/health
```
Debe retornar:
```json
{
  "success": true,
  "message": "MTG-Nexus-Hub API is running",
  "timestamp": "...",
  "version": "1.0.0"
}
```

### Registro
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api@test.com",
    "username": "apiuser",
    "password": "test123456"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api@test.com",
    "password": "test123456"
  }'
```
Guardar el token retornado para siguientes requests.

### Buscar Cartas
```bash
curl "http://localhost:5000/api/cards/search?q=lightning"
```

### Crear Mazo (requiere token)
```bash
curl -X POST http://localhost:5000/api/decks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "name": "Deck API Test",
    "format": "Modern"
  }'
```

### Listar Mazos (requiere token)
```bash
curl http://localhost:5000/api/decks \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

## 🐛 Casos de Error a Verificar

### Validaciones Frontend
- [ ] Registro con email inválido → Muestra error
- [ ] Registro con contraseña < 6 caracteres → Muestra error
- [ ] Registro con contraseñas no coincidentes → Muestra error
- [ ] Login con credenciales incorrectas → Muestra error

### Validaciones Backend
- [ ] POST /api/decks sin nombre → Error 400
- [ ] POST /api/decks sin token → Error 401
- [ ] GET /api/decks/:id con ID inexistente → Error 404
- [ ] POST /api/decks/:id/cards sin scryfallId → Error 400

### Manejo de Scryfall
- [ ] Buscar carta inexistente → Retorna array vacío
- [ ] Importar con nombre incorrecto → Marca como fallida en resultados

## 📊 Métricas de Performance

### Tiempos de Respuesta Esperados
- Búsqueda de cartas: < 2 segundos
- Crear/Listar mazos: < 500ms
- Añadir carta a mazo: < 3 segundos (incluye Scryfall)
- Importar 20 cartas: < 10 segundos

### Límites
- Scryfall API: Max 10 requests por segundo
- JWT Token: Expira en 7 días
- Importación: Recomendado < 50 cartas por lote

## ✨ Checklist de Calidad de Código

### Backend
- [ ] Todas las rutas tienen manejo de errores
- [ ] Contraseñas hasheadas con bcrypt
- [ ] JWT secrets en variables de entorno
- [ ] Validaciones con express-validator
- [ ] Respuestas consistentes (success, message, data)

### Frontend
- [ ] Componentes reutilizables (CardDisplay, Navbar)
- [ ] Servicios separados (authService, deckService)
- [ ] Context para autenticación
- [ ] Loading states en peticiones async
- [ ] Error handling en formularios

### Base de Datos
- [ ] Migraciones aplicadas correctamente
- [ ] Índices en foreign keys
- [ ] Constraints (unique, not null) definidas
- [ ] Relaciones cascade correctas

## 📝 Reporte de Pruebas

Fecha: ___________
Tester: ___________

| Funcionalidad | Estado | Notas |
|--------------|--------|-------|
| Registro | ☐ | |
| Login | ☐ | |
| Búsqueda cartas | ☐ | |
| Crear mazo | ☐ | |
| Añadir cartas | ☐ | |
| Importar mazo | ☐ | |
| Exportar mazo | ☐ | |
| Eliminar mazo | ☐ | |

---

**Criterio de Aceptación MVP v1.0:**
- ✅ Todas las funcionalidades principales completadas
- ✅ Sin errores críticos
- ✅ Performance aceptable
- ✅ UI responsive y usable
