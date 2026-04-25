"use client";

import { useMemo, useState } from "react";
import { deleteUserAction } from "@/actions/user.actions";
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
import { Badge } from "@/components/ui/badge";
import type { AuthUser } from "@/types";

const PAGE_SIZE = 10;

export function UsersTable({ users }: { users: AuthUser[] }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(s) ||
        (u.email?.toLowerCase().includes(s) ?? false),
    );
  }, [users, q]);

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
          placeholder="Filter users…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          aria-label="Filter users"
        />
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableTh>Name</TableTh>
            <TableTh className="hidden sm:table-cell">Email</TableTh>
            <TableTh>Role</TableTh>
            <TableTh className="w-[100px] text-right">Actions</TableTh>
          </TableRow>
        </TableHead>
        <TableBody>
          {slice.map((u) => (
            <TableRow key={u.id}>
              <TableTd className="font-medium text-stone-900">{u.name}</TableTd>
              <TableTd className="hidden text-stone-600 sm:table-cell">
                {u.email ?? "—"}
              </TableTd>
              <TableTd>
                <Badge variant={u.role === 1 ? "warning" : "default"}>
                  {u.role === 1 ? "Superadmin" : "Admin"}
                </Badge>
              </TableTd>
              <TableTd className="text-right">
                <RowActions
                  onDelete={async () => {
                    const r = await deleteUserAction(u.id);
                    return { ok: r.ok, message: r.ok ? undefined : r.message };
                  }}
                  deleteLabel={`Remove user ${u.name}?`}
                />
              </TableTd>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filtered.length === 0 ? (
        <p className="text-sm text-stone-500">No users match your filter.</p>
      ) : null}
      <Pagination
        page={pageSafe}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
