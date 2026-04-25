"use client";

import { useMemo, useState } from "react";
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
import { timeAgo } from "@/utils/time-ago";
import type { ActivityRecord } from "@/types";

const PAGE_SIZE = 15;

export function RecordsTable({ records }: { records: ActivityRecord[] }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return records;
    return records.filter(
      (r) =>
        r.title.toLowerCase().includes(s) ||
        (r.user_name?.toLowerCase().includes(s) ?? false),
    );
  }, [records, q]);

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
          placeholder="Filter by report or user…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          aria-label="Filter records"
        />
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableTh>Report</TableTh>
            <TableTh>User ID</TableTh>
            <TableTh>Time</TableTh>
          </TableRow>
        </TableHead>
        <TableBody>
          {slice.map((r) => (
            <TableRow key={r.id}>
              <TableTd className="font-medium text-stone-900">
                {(r.user_name ?? "Unknown user").trim()}{" "}
                {r.title
                  ? `${r.title.charAt(0).toLowerCase()}${r.title.slice(1)}`
                  : ""}
              </TableTd>
              <TableTd className="whitespace-nowrap text-stone-600">
                {r.user_id ?? "—"}
              </TableTd>
              <TableTd className="whitespace-nowrap text-stone-600">
                {timeAgo(r.created_at)}
              </TableTd>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filtered.length === 0 ? (
        <p className="text-sm text-stone-500">No activity records found.</p>
      ) : null}
      <Pagination
        page={pageSafe}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
