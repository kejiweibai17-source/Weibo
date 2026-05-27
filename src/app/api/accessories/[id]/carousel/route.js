import { NextResponse } from "next/server";
import { ACCESSORY_SERIES } from "@/data/accessories";
import { getAccessoryCatalogItem } from "@/data/accessories.server";
import { buildCarouselFromFolders } from "@/lib/accessoryCarousel";

export async function GET(_request, { params }) {
  const { id } = await params;
  const item = getAccessoryCatalogItem(id);

  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const mediaFolder = item.detail?.mediaFolder ?? item.mediaFolder;
  const useAuto =
    item.detail?.carouselFromFolders ??
    ACCESSORY_SERIES[item.series]?.carouselFromFolders;

  if (!useAuto) {
    return NextResponse.json({ images: [], auto: false });
  }

  const imageDir = ACCESSORY_SERIES[item.series]?.imageDir;
  const promoPaths =
    item.detail?.carouselPromoPaths ??
    ACCESSORY_SERIES[item.series]?.carouselPromoPaths ??
    ["文宣"];

  const boxContentFiles =
    item.detail?.boxContents ??
    ACCESSORY_SERIES[item.series]?.boxContents ??
    [];

  const images = buildCarouselFromFolders(
    imageDir,
    mediaFolder,
    promoPaths,
    boxContentFiles,
  );

  return NextResponse.json({
    auto: true,
    images,
    folders: {
      box: `${imageDir}/禮盒內容物`,
      content: `${imageDir}/${mediaFolder}/產品內容物`,
      promo: promoPaths.map((p) => `${imageDir}/${p}`),
    },
  });
}
