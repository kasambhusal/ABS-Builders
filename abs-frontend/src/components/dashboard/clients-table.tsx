"use client";

import { useMemo, useState } from "react";
import { deleteClientAction } from "@/actions/client.actions";
import { RowActions } from "@/components/dashboard/row-actions";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableTd,
  TableTh,
} from "@/components/ui/table";
import type { Client } from "@/types";

const PAGE_SIZE = 10;

export function ClientsTable({ clients }: { clients: Client[] }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        (c.url?.toLowerCase().includes(s) ?? false),
    );
  }, [clients, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const slice = filtered.slice(
    (pageSafe - 1) * PAGE_SIZE,
    pageSafe * PAGE_SIZE,
  );

  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <Input
          placeholder="Filter clients…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          aria-label="Filter clients"
        />
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableTh>Name</TableTh>
            <TableTh className="hidden md:table-cell">URL</TableTh>
            <TableTh className="w-[120px] text-right">Actions</TableTh>
          </TableRow>
        </TableHead>
        <TableBody>
          {slice.map((c) => (
            <TableRow key={c.id}>
              <TableTd className="font-medium text-stone-900">{c.name}</TableTd>
              <TableTd className="hidden text-stone-600 md:table-cell">
                {c.url ?? "—"}
              </TableTd>
              <TableTd className="text-right">
                <RowActions
                  editHref={`/dashboard/clients/${c.id}/edit`}
                  onDelete={async () => {
                    const r = await deleteClientAction(c.id);
                    return { ok: r.ok, message: r.ok ? undefined : r.message };
                  }}
                />
              </TableTd>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filtered.length === 0 ? (
        <p className="text-sm text-stone-500">No clients match your filter.</p>
      ) : null}
      <Pagination
        page={pageSafe}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
