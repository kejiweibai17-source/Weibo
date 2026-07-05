import { createLegacySeriesPage } from "@/lib/createLegacySeriesPage";

const { generateMetadata, default: Page, revalidate } = createLegacySeriesPage("product02");

export { generateMetadata, revalidate };
export default Page;
