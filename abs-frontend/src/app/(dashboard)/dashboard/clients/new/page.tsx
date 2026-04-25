import { requireDashboardUser } from "@/lib/auth";
import { ClientForm } from "@/components/forms/client-form";

export default async function NewClientPage() {
  await requireDashboardUser();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">New client</h1>
        <p className="text-sm text-stone-600">Optional logo upload.</p>
      </div>
      <ClientForm mode="create" />
    </div>
  );
}
