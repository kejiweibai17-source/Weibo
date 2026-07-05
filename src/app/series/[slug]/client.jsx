"use client";

import SeriesPageRenderer from "@/components/series/SeriesPageRenderer";

export default function SeriesPageClient({ page }) {
  return (
    <SeriesPageRenderer
      blocks={page.blocks}
      featuredImages={page.featuredImages}
      featuredImage={page.featuredImage}
      title={page.title}
    />
  );
}
