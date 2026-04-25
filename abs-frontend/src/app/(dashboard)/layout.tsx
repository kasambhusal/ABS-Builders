import { requireDashboardUser } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireDashboardUser();

  return (
    <div className="flex min-h-screen bg-[#faf8f5] text-stone-900">
      <Sidebar user={user} role={user.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-4 pb-12 pt-20 md:px-8 md:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
