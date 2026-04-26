const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, 'public', 'images');
const MAX_SIZE = 1024 * 1024; // 1MB
const MIN_QUALITY = 40; // Don't go below this quality

async function compressToWebpUnder1MB(inputPath, outputPath) {
  let quality = 80;
  let buffer;
  while (quality >= MIN_QUALITY) {
    buffer = await sharp(inputPath)
      .webp({ quality })
      .toBuffer();
    if (buffer.length <= MAX_SIZE) {
      await fs.promises.writeFile(outputPath, buffer);
      return quality;
    }
    quality -= 10;
  }
  // If we exit the loop, save the lowest quality version
  await fs.promises.writeFile(outputPath, buffer);
  return quality;
}

(async () => {
  const files = await fs.promises.readdir(imagesDir);
  const jpgFiles = files.filter(f => /\.jpe?g$/i.test(f));

  for (const file of jpgFiles) {
    const inputPath = path.join(imagesDir, file);
    const outputFile = file.replace(/\.jpe?g$/i, '.webp');
    const outputPath = path.join(imagesDir, outputFile);
    try {
      const finalQuality = await compressToWebpUnder1MB(inputPath, outputPath);
      const stats = await fs.promises.stat(outputPath);
      console.log(`Converted: ${file} -> ${outputFile} | Size: ${(stats.size/1024).toFixed(1)}KB | Quality: ${finalQuality}`);
    } catch (err) {
      console.error(`Failed to convert ${file}:`, err);
    }
  }
})();
