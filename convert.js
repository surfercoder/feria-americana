const fs = require('fs');
const path = require('path');
const heicConvert = require('heic-convert');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, 'public', 'images');
const MAX_SIZE = 1024 * 1024; // 1MB
const MIN_QUALITY = 40;

async function convertHeicToWebp(filePath) {
  const inputBuffer = fs.readFileSync(filePath);
  const jpegBuffer = await heicConvert({
    buffer: inputBuffer,
    format: 'JPEG',
    quality: 0.9,
  });

  let quality = 80;
  let webpBuffer;
  while (quality >= MIN_QUALITY) {
    webpBuffer = await sharp(jpegBuffer)
      .webp({ quality })
      .toBuffer();
    if (webpBuffer.length <= MAX_SIZE) break;
    quality -= 10;
  }

  const webpPath = filePath.replace(/\.heic$/i, '.webp');
  fs.writeFileSync(webpPath, webpBuffer);
  const sizeKB = (webpBuffer.length / 1024).toFixed(1);
  console.log(`Converted: ${path.basename(filePath)} -> ${path.basename(webpPath)} | ${sizeKB}KB | q${quality}`);
}

async function main() {
  const files = fs.readdirSync(imagesDir);
  const heicFiles = files.filter(f => f.match(/\.heic$/i));
  if (heicFiles.length === 0) {
    console.log('No HEIC files found.');
    return;
  }
  console.log(`Found ${heicFiles.length} HEIC files. Converting...`);
  for (const file of heicFiles) {
    const filePath = path.join(imagesDir, file);
    try {
      await convertHeicToWebp(filePath);
    } catch (err) {
      console.error(`Failed to convert ${file}:`, err);
    }
  }

  // Delete HEIC files after successful conversion
  for (const file of heicFiles) {
    const filePath = path.join(imagesDir, file);
    const webpPath = filePath.replace(/\.heic$/i, '.webp');
    if (fs.existsSync(webpPath)) {
      fs.unlinkSync(filePath);
    }
  }

  // Rename all webp files sequentially: 1.webp, 2.webp, ...
  const allWebp = fs.readdirSync(imagesDir)
    .filter(f => f.endsWith('.webp'))
    .sort((a, b) => {
      const numA = parseInt(a);
      const numB = parseInt(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });

  const tmpDir = path.join(imagesDir, '_tmp_rename');
  fs.mkdirSync(tmpDir, { recursive: true });
  allWebp.forEach((file, i) => {
    fs.copyFileSync(path.join(imagesDir, file), path.join(tmpDir, `${i + 1}.webp`));
  });
  // Remove old webps and move renamed ones back
  allWebp.forEach(file => fs.unlinkSync(path.join(imagesDir, file)));
  const renamed = fs.readdirSync(tmpDir);
  renamed.forEach(file => {
    fs.renameSync(path.join(tmpDir, file), path.join(imagesDir, file));
  });
  fs.rmdirSync(tmpDir);

  console.log(`Done! ${allWebp.length} total webp images, renamed 1.webp through ${allWebp.length}.webp`);
}

main();
