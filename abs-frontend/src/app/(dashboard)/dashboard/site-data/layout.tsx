import { requireSuperAdmin } from "@/lib/auth";

export default async function SiteDataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSuperAdmin();
  return children;
}
