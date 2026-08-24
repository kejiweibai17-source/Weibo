/**
 * 將 public/3d/01/*.png 批次轉為 WebP（滾動序列用）
 * 用法：node scripts/convert-3d-frames.mjs [--delete-png]
 */
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const FRAMES_DIR = path.join(process.cwd(), "public/3d/01");
const QUALITY = 80;
const DELETE_PNG = process.argv.includes("--delete-png");

async function main() {
  const files = (await fs.readdir(FRAMES_DIR))
    .filter((f) => f.endsWith(".png"))
    .sort();

  if (files.length === 0) {
    console.log("No PNG files found.");
    return;
  }

  let totalIn = 0;
  let totalOut = 0;

  for (const file of files) {
    const input = path.join(FRAMES_DIR, file);
    const output = path.join(FRAMES_DIR, file.replace(/\.png$/i, ".webp"));
    const inStat = await fs.stat(input);
    totalIn += inStat.size;

    await sharp(input)
      .webp({ quality: QUALITY, effort: 4 })
      .toFile(output);

    const outStat = await fs.stat(output);
    totalOut += outStat.size;

    if (DELETE_PNG) {
      await fs.unlink(input);
    }
  }

  const ratio = ((1 - totalOut / totalIn) * 100).toFixed(1);
  console.log(`Converted ${files.length} frames → WebP q${QUALITY}`);
  console.log(
    `Size: ${(totalIn / 1024 / 1024).toFixed(1)}MB → ${(totalOut / 1024 / 1024).toFixed(1)}MB (−${ratio}%)`,
  );
  if (DELETE_PNG) console.log("Original PNG files removed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
