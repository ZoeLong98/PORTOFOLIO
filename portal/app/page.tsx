import { getSiteData } from "@/lib/data";
import ClientPage from "./ClientPage";

export default async function Home() {
  const siteData = await getSiteData();

  return <ClientPage siteData={siteData} />;
}
