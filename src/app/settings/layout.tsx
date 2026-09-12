import { privateMetadata } from "@/lib/seo";
export const dynamic = "force-dynamic";
export const metadata = privateMetadata;
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
