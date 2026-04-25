import { ApiError } from "@/lib/fetcher";
import { listPrivateUsers } from "@/services/user.service";
import { UsersTable } from "@/components/dashboard/users-table";
import { AddUserForm } from "@/components/forms/add-user-form";

export default async function UsersPage() {
  const { rows: users, error } = await listPrivateUsers().then(
    (rows) => ({ rows, error: null as string | null }),
    (e: unknown) => ({
      rows: [],
      error:
        e instanceof ApiError
          ? e.message
          : "Unable to load users. Check API configuration.",
    }),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Users</h1>
        <p className="text-sm text-stone-600">
          As a Superadmin, you can add or remove users.
        </p>
      </div>
      <AddUserForm />
      {error ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </p>
      ) : null}
      <UsersTable users={users} />
    </div>
  );
}
