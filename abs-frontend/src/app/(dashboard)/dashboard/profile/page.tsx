import { requireDashboardUser } from "@/lib/auth";
import { ProfileManagementForm } from "@/components/forms/profile-management-form";

export default async function DashboardProfilePage() {
  const user = await requireDashboardUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">
          Profile &amp; Site Management
        </h1>
        <p className="text-sm text-stone-600">
          Manage your account details and password.
        </p>
      </div>
      <ProfileManagementForm
        initialName={user.name ?? ""}
        initialEmail={user.email ?? ""}
      />
    </div>
  );
}
