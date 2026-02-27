const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const sourceDir = path.join(rootDir, 'Recursos');
const targetDir = path.join(rootDir, 'apps', 'accessible-usable', 'public', 'videos', 'visual-studies');

if (!fs.existsSync(sourceDir)) {
  console.error(`Directorio de origen inexistente: ${sourceDir}`);
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });

const copied = [];

fs.readdirSync(sourceDir)
  .filter((file) => file.toLowerCase().endsWith('.mkv'))
  .forEach((file) => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    fs.copyFileSync(sourcePath, targetPath);
    copied.push(file);
  });

console.log(`Videos sincronizados en ${targetDir}`);
copied.forEach((file) => console.log(` - ${file}`));
console.log(`Total: ${copied.length} archivos`);
