import { createLegacySeriesPage } from "@/lib/createLegacySeriesPage";

const { generateMetadata, default: Page, revalidate } = createLegacySeriesPage("product04");

export { generateMetadata, revalidate };
export default Page;
