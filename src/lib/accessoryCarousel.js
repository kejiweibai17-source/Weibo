import mediaManifest from "@/data/accessories-media-manifest.json";

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

/** 依檔名自然排序（1.jpg, 2.jpg … 10.jpg） */
function naturalSort(files) {
  return [...files].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
  );
}

/**
 * 讀取 public 下某資料夾內所有圖片（png / jpg / jpeg / webp / gif）
 * @param {string} publicUrlPath 例如 /images/accessories/青春版…/文宣
 * @returns {string[]} 完整 URL 路徑
 */
export function listImagesInPublicDir(publicUrlPath) {
  if (!publicUrlPath || publicUrlPath.includes("..")) return [];
  const files = (mediaManifest[publicUrlPath] ?? []).filter((name) => {
    const ext = name.slice(name.lastIndexOf(".")).toLowerCase();
    return IMAGE_EXT.has(ext);
  });

  return naturalSort(files).map((name) => `${publicUrlPath}/${name}`);
}

function resolveFilesAtSeriesRoot(imageDir, files) {
  if (!files?.length) return [];
  const rootFiles = new Set(mediaManifest[imageDir] ?? []);
  return files
    .map((name) => `${imageDir}/${name}`)
    .filter((url) => rootFiles.has(url.split("/").pop()));
}

/**
 * 詳情頁主輪播：禮盒內容物 → 產品內容物 → 文宣
 * @param {string} imageDir 系列根目錄
 * @param {string} mediaFolder 款式子資料夾，如 月光銀
 * @param {string[]} [promoPaths] 文宣子路徑
 * @param {string[]} [boxContentFiles] 禮盒內容物檔名（系列根目錄），無資料夾時使用
 */
export function buildCarouselFromFolders(
  imageDir,
  mediaFolder,
  promoPaths = ["文宣"],
  boxContentFiles = [],
) {
  if (!imageDir) return [];
  if (mediaFolder && mediaFolder.includes("..")) return [];

  // 第一優先：產品內容物資料夾（固定放前幾張）
  const rootContentImages = listImagesInPublicDir(`${imageDir}/產品內容物`);
  const mediaContentImages = mediaFolder
    ? listImagesInPublicDir(`${imageDir}/${mediaFolder}/產品內容物`)
    : [];

  // 第二優先：禮盒內容物（若有）
  const boxFromFolder = listImagesInPublicDir(`${imageDir}/禮盒內容物`);
  const boxImages =
    boxFromFolder.length > 0
      ? boxFromFolder
      : resolveFilesAtSeriesRoot(imageDir, boxContentFiles);

  const promoImages = promoPaths.flatMap((sub) =>
    listImagesInPublicDir(`${imageDir}/${sub}`),
  );

  const merged = [
    ...rootContentImages,
    ...mediaContentImages,
    ...boxImages,
    ...promoImages,
  ].filter((url, idx, arr) => arr.indexOf(url) === idx);
  if (merged.length > 0) return merged;

  if (mediaFolder) {
    const fallback = `${imageDir}/${mediaFolder}.png`;
    const rootFiles = new Set(mediaManifest[imageDir] ?? []);
    if (rootFiles.has(`${mediaFolder}.png`)) return [fallback];
  }

  return [];
}
