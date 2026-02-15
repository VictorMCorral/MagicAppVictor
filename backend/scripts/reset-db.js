const { execSync } = require('child_process');
const path = require('path');

async function resetDatabase() {
  try {
    console.log('🔄 Iniciando reinicio de la base de datos...\n');

    console.log('📋 Paso 1: Ejecutando migraciones de Prisma...');
    execSync('npx prisma migrate deploy', {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });
    console.log('✅ Migraciones completadas.\n');

    console.log('🌱 Paso 2: Cargando datos de prueba...');
    execSync('node scripts/seed-demo-data.js', {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });
    console.log('✅ Datos de prueba cargados.\n');

    console.log('═══════════════════════════════════════');
    console.log('✨ REINICIO DE BASE DE DATOS COMPLETADO');
    console.log('═══════════════════════════════════════');
    console.log('\n👤 Credenciales de acceso:');
    console.log('   Usuario: admin');
    console.log('   Email: admin@magicapp.local');
    console.log('   Contraseña: admin\n');
  } catch (error) {
    console.error('❌ Error durante el reinicio:', error.message);
    process.exit(1);
  }
}

resetDatabase();
