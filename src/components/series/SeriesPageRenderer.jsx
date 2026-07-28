"use client";

import SeriesHeroSlider from "@/components/series/blocks/SeriesHeroSlider";
import SeriesFeatureSlider from "@/components/series/blocks/SeriesFeatureSlider";
import SeriesProductShowcase from "@/components/series/blocks/SeriesProductShowcase";
import SeriesSpecsPanel from "@/components/series/blocks/SeriesSpecsPanel";
import SeriesParallaxHero from "@/components/series/blocks/SeriesParallaxHero";
import SeriesTextBanner from "@/components/series/blocks/SeriesTextBanner";
import SeriesProductVideo from "@/components/series/blocks/SeriesProductVideo";

function renderBlock(block, index) {
  switch (block.type) {
    case "feature_slider":
      return <SeriesFeatureSlider key={`feature-${index}`} {...block} />;
    case "product_showcase":
      return <SeriesProductShowcase key={`showcase-${index}`} {...block} />;
    case "specs_panel":
      return <SeriesSpecsPanel key={`specs-${index}`} {...block} />;
    case "parallax_hero":
      return <SeriesParallaxHero key={`parallax-${index}`} {...block} />;
    case "text_banner":
      if (block.enabled === false) return null;
      return <SeriesTextBanner key={`banner-${index}`} {...block} />;
    case "product_video":
      if (block.enabled === false) return null;
      return <SeriesProductVideo key={`video-${index}`} {...block} />;
    default:
      return null;
  }
}

export default function SeriesPageRenderer({
  blocks,
  featuredImages,
  featuredImage,
  title,
}) {
  const images =
    featuredImages?.length > 0
      ? featuredImages
      : featuredImage
        ? [featuredImage]
        : [];

  const heroSlides = images.map((image, index) => ({
    image,
    eyebrow: index === 0 ? "SMASMALL" : "",
    title: index === 0 ? title || "" : "",
    subtitle: "",
  }));

  const hasContent = heroSlides.length > 0 || blocks?.length > 0;

  if (!hasContent) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center bg-black px-6 text-center text-white/70">
        <p>此系列產品尚未設定頁面區塊，請至 WordPress 後台編輯。</p>
      </section>
    );
  }

  return (
    <div className="relative w-full bg-black font-sans">
      {heroSlides.length > 0 ? (
        <SeriesHeroSlider slides={heroSlides} autoplaySeconds={4} />
      ) : null}
      {blocks?.map((block, index) => renderBlock(block, index))}
    </div>
  );
}
