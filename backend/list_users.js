const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log('--- LISTA DE USUARIOS REGISTRADOS ---');
    if (users.length === 0) {
      console.log('No hay usuarios registrados.');
    } else {
      users.forEach(user => {
        console.log(`Email: ${user.email} | Username: ${user.username} | Password (Hasshed): ${user.password}`);
      });
    }
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
