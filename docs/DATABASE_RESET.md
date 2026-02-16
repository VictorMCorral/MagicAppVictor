# 🔄 Reinicio de Base de Datos - Cambio de Dispositivo

Si cambias de dispositivo o necesitas resetear la base de datos con el usuario admin, sigue estos pasos:

## 📋 Prerequisitos

- PostgreSQL debe estar corriendo y accesible
- El archivo `.env` en `backend/` debe tener la `DATABASE_URL` correcta
- Node.js debe estar instalado

## ⚡ Opción Rápida (Recomendado)

### Windows (Command Prompt)
```bash
reset-db.bat
```

### Windows (PowerShell)
```powershell
.\reset-db.ps1
```

### Linux/Mac
```bash
chmod +x reset-db.sh
./reset-db.sh
```

## 🛠️ Opción Manual

Si los scripts no funcionan, ejecuta manualmente:

```bash
# Navega a la carpeta backend
cd backend

# Ejecuta el reinicio de base de datos
npm run db:reset
```

## ✅ Verificar que Todo Funciona

Después del reinicio, deberías ver:
```
═══════════════════════════════════════
✨ REINICIO DE BASE DE DATOS COMPLETADO
═══════════════════════════════════════

👤 Credenciales de acceso:
   Usuario: admin
   Email: admin@magicapp.local
   Contraseña: admin
```

## 🔐 Credenciales Después del Reset

- **Usuario:** `admin`
- **Email:** `admin@magicapp.local`
- **Contraseña:** `admin`

## 📦 Qué se Carga al Resetear

✅ Base de datos limpia con esquema actualizado
✅ Usuario admin (admin/admin)
✅ 2 mazos de ejemplo:
- Demo - Mono Red Aggro
- Demo - Azorius Control
✅ Cartas de ejemplo en cada mazo

## 🚀 Siguientes Pasos

1. Inicia el backend: `cd backend && npm run dev`
2. Inicia el frontend: `cd frontend && npm start`
3. Accede a http://localhost:3000
4. Login con admin/admin
5. ¡Explora la aplicación!

## ❌ Solución de Problemas

### "psql: command not found"
- PostgreSQL no está instalado o no está en el PATH
- [Descarga e instala PostgreSQL](https://www.postgresql.org/download/)

### "connection refused" o "ECONNREFUSED"
- PostgreSQL no está corriendo
- En Windows: Busca "Services" y reinicia PostgreSQL
- En Linux/Mac: Ejecuta `brew services restart postgresql` (si usas Homebrew)

### "database does not exist"
- Asegúrate de haber creado la base de datos `mtg_nexus`
- Ejecuta en psql:
```sql
CREATE DATABASE mtg_nexus;
```

### Error con migraciones
1. Borra la carpeta `backend/node_modules`
2. Ejecuta `npm install` en backend
3. Intenta el reset nuevamente

## 📝 Variables de Entorno Requeridas

Asegúrate de que tu `backend/.env` contiene:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/mtg_nexus?schema=public"
JWT_SECRET="tu_secreto_aqui"
PORT=5000
NODE_ENV=development
```

Si no existe, cópialo de `.env.example`:
```bash
cd backend
cp .env.example .env
# Edita .env si es necesario
```

---

¿Necesitas ayuda? Revisa [INSTALLATION.md](./INSTALLATION.md) para más detalles.
