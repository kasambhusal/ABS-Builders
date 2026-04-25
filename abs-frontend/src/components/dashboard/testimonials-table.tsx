"use client";

import { useMemo, useState } from "react";
import { deleteTestimonialAction } from "@/actions/testimonial.actions";
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
import { truncate } from "@/utils/format";
import type { Testimonial } from "@/types";

const PAGE_SIZE = 10;

export function TestimonialsTable({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return testimonials;
    return testimonials.filter(
      (t) =>
        t.author.toLowerCase().includes(s) ||
        t.content.toLowerCase().includes(s),
    );
  }, [testimonials, q]);

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
          placeholder="Filter testimonials…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          aria-label="Filter testimonials"
        />
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableTh>Author</TableTh>
            <TableTh className="hidden sm:table-cell">Quote</TableTh>
            <TableTh>Featured</TableTh>
            <TableTh className="w-[120px] text-right">Actions</TableTh>
          </TableRow>
        </TableHead>
        <TableBody>
          {slice.map((t) => (
            <TableRow key={t.id}>
              <TableTd className="font-medium text-stone-900">
                {t.author}
              </TableTd>
              <TableTd className="hidden max-w-xs text-stone-600 sm:table-cell">
                {truncate(t.content, 80)}
              </TableTd>
              <TableTd>
                <Badge variant={t.featured ? "success" : "muted"}>
                  {t.featured ? "Yes" : "No"}
                </Badge>
              </TableTd>
              <TableTd className="text-right">
                <RowActions
                  editHref={`/dashboard/testimonials/${t.id}/edit`}
                  onDelete={async () => {
                    const r = await deleteTestimonialAction(t.id);
                    return { ok: r.ok, message: r.ok ? undefined : r.message };
                  }}
                />
              </TableTd>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filtered.length === 0 ? (
        <p className="text-sm text-stone-500">
          No testimonials match your filter.
        </p>
      ) : null}
      <Pagination
        page={pageSafe}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
