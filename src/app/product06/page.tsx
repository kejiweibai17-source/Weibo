import { createLegacySeriesPage } from "@/lib/createLegacySeriesPage";

const { generateMetadata, default: Page, revalidate } = createLegacySeriesPage("product06");

export { generateMetadata, revalidate };
export default Page;
