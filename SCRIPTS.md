# Scripts de Desarrollo - MTG Nexus Hub

Este documento contiene scripts útiles para el desarrollo y mantenimiento del proyecto.

## 🚀 Scripts de Inicio Rápido

### Windows PowerShell

#### Script para iniciar Backend y Frontend simultáneamente
Crea un archivo `start-dev.ps1` en la raíz:

```powershell
# start-dev.ps1
Write-Host "🚀 Iniciando MTG Nexus Hub..." -ForegroundColor Green

# Iniciar Backend en nueva ventana
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Esperar 3 segundos
Start-Sleep -Seconds 3

# Iniciar Frontend en nueva ventana
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm start"

Write-Host "✅ Servidores iniciados!" -ForegroundColor Green
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
```

Ejecutar con: `.\start-dev.ps1`

### Linux/Mac (Bash)

#### Script para iniciar Backend y Frontend
Crea un archivo `start-dev.sh`:

```bash
#!/bin/bash
echo "🚀 Iniciando MTG Nexus Hub..."

# Iniciar Backend en background
cd backend && npm run dev &

# Esperar 3 segundos
sleep 3

# Iniciar Frontend
cd ../frontend && npm start
```

Hacer ejecutable y correr:
```bash
chmod +x start-dev.sh
./start-dev.sh
```

## 🗄️ Scripts de Base de Datos

### Resetear Base de Datos (PowerShell)
```powershell
# reset-db.ps1
cd backend

Write-Host "⚠️  Reseteando base de datos..." -ForegroundColor Yellow
Write-Host "Esto eliminará TODOS los datos." -ForegroundColor Red
$confirm = Read-Host "¿Continuar? (s/n)"

if ($confirm -eq 's') {
    npx prisma migrate reset --force
    Write-Host "✅ Base de datos reseteada" -ForegroundColor Green
} else {
    Write-Host "❌ Operación cancelada" -ForegroundColor Red
}
```

### Crear Migración (PowerShell)
```powershell
# create-migration.ps1
cd backend

$name = Read-Host "Nombre de la migración"
npx prisma migrate dev --name $name

Write-Host "✅ Migración '$name' creada" -ForegroundColor Green
```

### Seed Data (Datos de Prueba)
Crea `backend/prisma/seed.js`:

```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Crear usuario de prueba
  const hashedPassword = await bcrypt.hash('test123456', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@mtgnexus.com' },
    update: {},
    create: {
      email: 'demo@mtgnexus.com',
      username: 'demouser',
      password: hashedPassword,
    },
  });

  console.log('✅ Usuario creado:', user.email);

  // Crear mazo de ejemplo
  const deck = await prisma.deck.create({
    data: {
      name: 'Commander Deck - Demo',
      description: 'Mazo de demostración pre-cargado',
      format: 'Commander',
      userId: user.id,
      isPublic: true,
    },
  });

  console.log('✅ Mazo creado:', deck.name);

  console.log('🎉 Seeding completado!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Ejecutar: `cd backend && node prisma/seed.js`

## 🧪 Scripts de Testing

### Test de Conexión a Base de Datos
Crea `backend/test-db-connection.js`:

```javascript
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Conexión a base de datos exitosa!');
    
    const userCount = await prisma.user.count();
    const deckCount = await prisma.deck.count();
    
    console.log(`📊 Usuarios: ${userCount}`);
    console.log(`📊 Mazos: ${deckCount}`);
    
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
```

Ejecutar: `node backend/test-db-connection.js`

### Test de API de Scryfall
Crea `backend/test-scryfall.js`:

```javascript
const scryfallService = require('./src/services/scryfallService');

async function testScryfall() {
  console.log('🔍 Probando Scryfall API...\n');

  try {
    // Test 1: Búsqueda
    console.log('Test 1: Búsqueda de "Lightning Bolt"');
    const searchResult = await scryfallService.searchCards('Lightning Bolt');
    console.log(`✅ Encontradas ${searchResult.total_cards} cartas\n`);

    // Test 2: Búsqueda por nombre exacto
    console.log('Test 2: Carta específica "Sol Ring"');
    const cardResult = await scryfallService.getCardByName('Sol Ring');
    console.log(`✅ Carta: ${cardResult.data.name}`);
    console.log(`   Precio EUR: €${cardResult.data.priceEur}\n`);

    // Test 3: Autocompletado
    console.log('Test 3: Autocompletado "command"');
    const autocomplete = await scryfallService.autocomplete('command');
    console.log(`✅ Sugerencias: ${autocomplete.data.slice(0, 5).join(', ')}\n`);

    console.log('🎉 Todos los tests pasaron!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testScryfall();
```

Ejecutar: `node backend/test-scryfall.js`

## 📦 Scripts de Instalación

### Instalación Completa (PowerShell)
```powershell
# install-all.ps1
Write-Host "📦 Instalando dependencias..." -ForegroundColor Green

Write-Host "`n🔧 Backend..." -ForegroundColor Cyan
cd backend
npm install

Write-Host "`n🎨 Frontend..." -ForegroundColor Cyan
cd ../frontend
npm install

Write-Host "`n✅ Instalación completada!" -ForegroundColor Green
Write-Host "Siguiente paso: Configurar .env y ejecutar migraciones" -ForegroundColor Yellow
```

### Setup Inicial Completo (PowerShell)
```powershell
# setup.ps1
Write-Host "🚀 Setup inicial de MTG Nexus Hub" -ForegroundColor Green

# Instalar dependencias
Write-Host "`n📦 Instalando dependencias..."
cd backend
npm install
cd ../frontend
npm install
cd ..

# Configurar .env
Write-Host "`n⚙️  Configurando archivos .env..."
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env

Write-Host "`n⚠️  Edita los archivos .env con tus configuraciones" -ForegroundColor Yellow
Write-Host "   - backend\.env: DATABASE_URL, JWT_SECRET"
Write-Host "   - frontend\.env: REACT_APP_API_URL"

$continue = Read-Host "`n¿Continuar con las migraciones? (s/n)"

if ($continue -eq 's') {
    Write-Host "`n🗄️  Ejecutando migraciones de Prisma..."
    cd backend
    npx prisma generate
    npx prisma migrate dev --name init
    
    Write-Host "`n✅ Setup completado!" -ForegroundColor Green
    Write-Host "Ejecuta 'npm run dev' en backend y 'npm start' en frontend" -ForegroundColor Cyan
}
```

## 🧹 Scripts de Limpieza

### Limpiar node_modules y reinstalar
```powershell
# clean-install.ps1
Write-Host "🧹 Limpiando y reinstalando..." -ForegroundColor Yellow

Remove-Item -Recurse -Force backend\node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force frontend\node_modules -ErrorAction SilentlyContinue

Write-Host "📦 Reinstalando backend..."
cd backend
npm install

Write-Host "📦 Reinstalando frontend..."
cd ../frontend
npm install

Write-Host "✅ Limpieza completada!" -ForegroundColor Green
```

## 📊 Scripts de Monitoreo

### Ver Logs en Tiempo Real (PowerShell)
```powershell
# watch-logs.ps1
# Asume que backend guarda logs en backend/logs/app.log

Get-Content backend/logs/app.log -Wait -Tail 50
```

### Estadísticas de Base de Datos
Crea `backend/db-stats.js`:

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getStats() {
  console.log('📊 Estadísticas de Base de Datos\n');
  console.log('='.repeat(50));

  const users = await prisma.user.count();
  const decks = await prisma.deck.count();
  const cards = await prisma.deckCard.count();

  const totalCards = await prisma.deckCard.aggregate({
    _sum: { quantity: true }
  });

  const avgDeckSize = await prisma.$queryRaw`
    SELECT AVG(card_count) as avg
    FROM (
      SELECT SUM(quantity) as card_count
      FROM deck_cards
      GROUP BY "deckId"
    ) as deck_sizes
  `;

  console.log(`👥 Usuarios registrados: ${users}`);
  console.log(`📚 Mazos creados: ${decks}`);
  console.log(`🃏 Entradas de cartas únicas: ${cards}`);
  console.log(`🎴 Total de cartas (con cantidad): ${totalCards._sum.quantity || 0}`);
  console.log(`📈 Promedio de cartas por mazo: ${avgDeckSize[0]?.avg || 0}`);
  console.log('='.repeat(50));

  await prisma.$disconnect();
}

getStats();
```

## 🔄 Scripts de Respaldo

### Backup de Base de Datos (PowerShell)
```powershell
# backup-db.ps1
$date = Get-Date -Format "yyyy-MM-dd_HH-mm"
$filename = "backup_$date.sql"

Write-Host "💾 Creando backup..." -ForegroundColor Cyan

pg_dump -U postgres -d mtg_nexus -f "backups/$filename"

Write-Host "✅ Backup creado: $filename" -ForegroundColor Green
```

## 📝 Añadir Scripts a package.json

### Backend package.json
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "prisma:migrate": "npx prisma migrate dev",
    "prisma:generate": "npx prisma generate",
    "prisma:studio": "npx prisma studio",
    "prisma:reset": "npx prisma migrate reset",
    "seed": "node prisma/seed.js",
    "test:db": "node test-db-connection.js",
    "test:scryfall": "node test-scryfall.js"
  }
}
```

### Frontend package.json
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

---

**Nota:** Todos estos scripts son opcionales pero facilitan enormemente el desarrollo diario.
