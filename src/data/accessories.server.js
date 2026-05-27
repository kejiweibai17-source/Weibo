import { listImagesInPublicDir } from "@/lib/accessoryCarousel";
import mediaManifest from "@/data/accessories-media-manifest.json";
import {
  ACCESSORY_CATALOG,
  ACCESSORY_SERIES,
  toListItem,
  defaultAccessoryDetail,
  resolveSeriesImages,
  PLACEHOLDER_IMG,
} from "@/data/accessories";

function idFromListImage(seriesKey, filename) {
  if (filename.includes("紙袋")) return `${seriesKey.toLowerCase()}-bag`;
  const num = filename.match(/-(\d+)\.[^.]+$/);
  if (num) return `${seriesKey.toLowerCase()}-${num[1]}`;
  const slug = filename.replace(/\.[^.]+$/, "");
  return `${seriesKey.toLowerCase()}-${slug}`;
}

function titleFromListImage(seriesKey, filename) {
  const base = filename.replace(/\.[^.]+$/, "");
  if (seriesKey === "Defender") {
    const m = base.match(/(\d+)/);
    if (m) return `捍衛者禮盒內容 ${m[1]}`;
    return `捍衛者｜${base}`;
  }
  if (seriesKey === "Gentleman") {
    if (base.includes("紙袋")) return "玩美紳士｜專屬紙袋";
    const m = base.match(/完美紳士-(\d+)/);
    if (m) return `玩美紳士禮盒內容 ${m[1]}`;
    return `玩美紳士｜${base}`;
  }
  if (seriesKey === "DarkKnight") {
    if (base.includes("紙袋")) return "黑夜騎士｜專屬紙袋";
    const m = base.match(/(\d+)/);
    if (m) return `黑夜騎士禮盒內容 ${m[1]}`;
    return `黑夜騎士｜${base}`;
  }
  if (seriesKey === "Constellation") {
    const zodiac = base.match(/主圖_(.+)/);
    if (zodiac) return `星座系列電動刮鬍刀禮盒｜${zodiac[1]}`;
    if (base === "24") return "星座系列電動刮鬍刀禮盒｜綜合展示";
    return `星座系列電動刮鬍刀禮盒｜${base}`;
  }
  if (seriesKey === "NoseHair") {
    const m = base.match(/^0*(\d+)$/);
    if (m) return `電動鼻毛修剪器｜內容 ${m[1]}`;
    return `電動鼻毛修剪器｜${base}`;
  }
  if (seriesKey === "LittleKingKong") {
    if (base.includes("紙袋")) return "小金剛旗艦三刀頭｜專屬紙袋";
    const m = base.match(/^(\d+)$/);
    if (m) return `小金剛旗艦三刀頭｜內容 ${m[1]}`;
    return `小金剛旗艦三刀頭｜${base}`;
  }
  return base;
}

function relativeImageNames(imageDir, subdir) {
  const urls = listImagesInPublicDir(`${imageDir}/${subdir}`);
  return urls.map((u) => u.replace(`${imageDir}/`, ""));
}

function relativeFilesByExt(imageDir, subdir, exts) {
  const targetDir = `${imageDir}/${subdir}`;
  const filesInDir = mediaManifest[targetDir] ?? [];
  if (!filesInDir.length) return [];
  const lowerExts = exts.map((e) => e.toLowerCase());
  const files = filesInDir
    .filter((name) => {
      const ext = name.slice(name.lastIndexOf(".")).toLowerCase();
      return lowerExts.includes(ext);
    })
    .sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
    );
  return files.map((name) => `${subdir}/${name}`);
}

function buildManualGuide(imageDir, manualPaths = []) {
  if (!manualPaths.length) return null;
  const [manualDir] = manualPaths;
  const image = relativeFilesByExt(imageDir, manualDir, [
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".gif",
  ])[0];
  const pdf = relativeFilesByExt(imageDir, manualDir, [".pdf"])[0];
  if (!image || !pdf) return null;
  return {
    image,
    pdf,
    label: "下載產品說明書",
  };
}

/** 合併手動 catalog + 各系列資料夾根目錄自動列表（僅該層 .png/.jpg，不含子資料夾） */
export function buildAccessoryCatalog() {
  let catalog = [...ACCESSORY_CATALOG];

  for (const [seriesKey, config] of Object.entries(ACCESSORY_SERIES)) {
    if (!config.autoListFromFolder || !config.imageDir) continue;

    catalog = catalog.filter((item) => item.series !== seriesKey);

    const imageUrls = listImagesInPublicDir(config.imageDir);

    for (const url of imageUrls) {
      const filename = url.split("/").pop();
      const id = idFromListImage(seriesKey, filename);
      const title = titleFromListImage(seriesKey, filename);

      catalog.push({
        id,
        title,
        price: config.listPrice ?? 0,
        series: seriesKey,
        compatibility: [seriesKey],
        category: config.listCategory ?? "Misc",
        imageFiles: [filename],
        detail: {
          rating: 4.7,
          reviews: 24,
          shortDesc: `昔馬 SMASMALL ${config.label ?? seriesKey} — ${title}。`,
          features: [
            {
              title: "禮盒內容物",
              content: "完整呈現玩美紳士系列配件與主機組合。",
            },
          ],
          details: `系列：${config.label ?? seriesKey}\n圖片：${filename}`,
          imageFiles: [filename],
          carouselFromFolders: config.carouselFromFolders ?? false,
          carouselPromoPaths: config.carouselPromoPaths ?? ["文宣"],
          scenarioImageFiles: (config.scenarioPaths ?? []).flatMap((p) =>
            relativeImageNames(config.imageDir, p),
          ),
          manualGuide: buildManualGuide(config.imageDir, config.manualPaths),
        },
      });
    }
  }

  return catalog;
}

export function buildAccessoryProducts() {
  return buildAccessoryCatalog().map(toListItem);
}

export function getAccessoryCatalogItem(id) {
  return buildAccessoryCatalog().find((p) => p.id === id) ?? null;
}

export function getAccessoryDetailFromCatalog(id) {
  const item = getAccessoryCatalogItem(id);
  if (!item) return null;

  const base = defaultAccessoryDetail(item);
  const seriesConfig = ACCESSORY_SERIES[item.series];
  const boxContents = seriesConfig?.boxContents ?? [];
  const boxContentsImages = resolveSeriesImages(item.series, boxContents);

  const rightPanel =
    item.detail?.rightPanel ?? seriesConfig?.rightPanel ?? null;

  if (!item.detail) {
    return { ...base, boxContentsImages, scenarioImages: [], rightPanel };
  }

  const imageFiles = item.detail.imageFiles ?? item.imageFiles;
  const configuredScenarioFiles = item.detail.scenarioImageFiles ?? [];
  const scenarioImageFiles =
    configuredScenarioFiles.length > 0
      ? configuredScenarioFiles
      : (item.detail?.scenarioPaths ?? seriesConfig?.scenarioPaths ?? []).flatMap(
          (p) => relativeImageNames(seriesConfig.imageDir, p),
        );

  const manualGuide =
    item.detail.manualGuide ?? buildManualGuide(seriesConfig.imageDir, seriesConfig.manualPaths);

  return {
    ...base,
    ...item.detail,
    images: resolveSeriesImages(item.series, imageFiles),
    boxContentsImages,
    scenarioImages: resolveSeriesImages(item.series, scenarioImageFiles),
    manualGuide: manualGuide
      ? {
          ...manualGuide,
          imageUrl: resolveSeriesImages(item.series, [manualGuide.image])[0],
          pdfUrl: resolveSeriesImages(item.series, [manualGuide.pdf])[0],
        }
      : null,
    shipping: item.detail.shipping ?? base.shipping,
    carouselFromFolders:
      item.detail.carouselFromFolders ??
      seriesConfig?.carouselFromFolders ??
      false,
    mediaFolder: item.detail.mediaFolder ?? item.mediaFolder ?? null,
    rightPanel,
  };
}
