import { notFound } from "next/navigation";
import { requireDashboardUser } from "@/lib/auth";
import { getPrivateClient } from "@/services/client.service";
import { ClientForm } from "@/components/forms/client-form";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireDashboardUser();
  const { id } = await params;
  const num = Number(id);
  if (!Number.isFinite(num)) notFound();
  const client = await getPrivateClient(num);
  if (!client) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Edit client</h1>
        <p className="text-sm text-stone-600">{client.name}</p>
      </div>
      <ClientForm mode="edit" client={client} />
    </div>
  );
}
