"use client";

import { useMemo, useState } from "react";
import { deleteBlogAction } from "@/actions/blog.actions";
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
import { formatDate } from "@/utils/format";
import type { Blog } from "@/types";

const PAGE_SIZE = 10;

export function BlogsTable({ blogs }: { blogs: Blog[] }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return blogs;
    return blogs.filter(
      (b) =>
        b.title.toLowerCase().includes(s) ||
        b.slug.toLowerCase().includes(s),
    );
  }, [blogs, q]);

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
          placeholder="Filter blogs…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          aria-label="Filter blogs"
        />
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableTh>Title</TableTh>
            <TableTh>State</TableTh>
            <TableTh className="hidden sm:table-cell">Updated</TableTh>
            <TableTh className="w-[120px] text-right">Actions</TableTh>
          </TableRow>
        </TableHead>
        <TableBody>
          {slice.map((b) => (
            <TableRow key={b.id}>
              <TableTd className="font-medium text-stone-900">{b.title}</TableTd>
              <TableTd>
                <Badge variant={b.published ? "success" : "muted"}>
                  {b.published ? "Published" : "Draft"}
                </Badge>
              </TableTd>
              <TableTd className="hidden text-stone-600 sm:table-cell">
                {formatDate(b.updated_at ?? b.created_at)}
              </TableTd>
              <TableTd className="text-right">
                <RowActions
                  viewHref={`/blogs/${b.slug}`}
                  editHref={`/dashboard/blogs/${b.id}/edit`}
                  onDelete={async () => {
                    const r = await deleteBlogAction(b.id);
                    return { ok: r.ok, message: r.ok ? undefined : r.message };
                  }}
                />
              </TableTd>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filtered.length === 0 ? (
        <p className="text-sm text-stone-500">No blogs match your filter.</p>
      ) : null}
      <Pagination
        page={pageSafe}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
