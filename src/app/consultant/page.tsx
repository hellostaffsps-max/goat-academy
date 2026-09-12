import PageClient from "./PageClient";
import { getService } from "@/data/services";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const valid = service && getService(service) ? service : undefined;
  return (
    <PageClient
      key={valid || "general"}
      serviceSlug={valid}
      initialServices={valid ? [valid] : []}
    />
  );
}
