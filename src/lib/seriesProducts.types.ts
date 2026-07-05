export type SeriesHeroSlide = {
  image: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
};

export type SeriesFeatureItem = {
  number: string;
  title: string;
  description: string;
  image: string;
};

export type SeriesFeatureSliderBlock = {
  type: "feature_slider";
  sectionEyebrow?: string;
  sectionTitle?: string;
  sectionTitleBold?: string;
  items: SeriesFeatureItem[];
};

export type SeriesShowcaseFeature = {
  title: string;
  bullets: string[];
  boxPosition?: "top_left" | "bottom_left" | "bottom_right" | "top_right";
};

export type SeriesShowcaseItem = {
  badge: string;
  name: string;
  tags: string[];
  thumbUrl: string;
  mainUrl: string;
  features: SeriesShowcaseFeature[];
};

export type SeriesProductShowcaseBlock = {
  type: "product_showcase";
  items: SeriesShowcaseItem[];
};

export type SeriesSpecsPanelBlock = {
  type: "specs_panel";
  title?: string;
  note?: string;
  leftImage: string;
  rightImage: string;
};

export type SeriesParallaxHeroBlock = {
  type: "parallax_hero";
  title: string;
  subtitle?: string;
  backgroundImage: string;
};

export type SeriesTextBannerBlock = {
  type: "text_banner";
  backgroundColor?: string;
  heading?: string;
  body: string;
};

export type SeriesProductVideoBlock = {
  type: "product_video";
  sectionTitle?: string;
  sectionSubtitle?: string;
  productImage: string;
  cableImage?: string;
  markerLabel?: string;
  videoUrl?: string;
  youtubeId: string;
  coverImage?: string;
};

/** @deprecated legacy alias */
export type SeriesTimelineCarouselBlock = SeriesFeatureSliderBlock;

export type SeriesBlock =
  | SeriesFeatureSliderBlock
  | SeriesProductShowcaseBlock
  | SeriesSpecsPanelBlock
  | SeriesParallaxHeroBlock
  | SeriesTextBannerBlock
  | SeriesProductVideoBlock;

export type SeriesNavItem = {
  label: string;
  slug: string;
  href: string;
};

export type SeriesSummary = {
  id: number;
  title: string;
  slug: string;
  order: number;
  seoTitle: string;
  seoDescription: string;
  ogImage?: string;
  featuredImage?: string;
  featuredImages?: string[];
  wcProductId?: number;
  updatedAt?: string;
};

export type SeriesPage = SeriesSummary & {
  blocks: SeriesBlock[];
};
