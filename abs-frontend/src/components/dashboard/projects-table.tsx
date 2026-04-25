"use client";

import { useMemo, useState } from "react";
import { deleteProjectAction } from "@/actions/project.actions";
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
import type { Project } from "@/types";

const PAGE_SIZE = 10;

export function ProjectsTable({ projects }: { projects: Project[] }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return projects;
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        p.slug.toLowerCase().includes(s) ||
        (p.location?.toLowerCase().includes(s) ?? false),
    );
  }, [projects, q]);

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
          placeholder="Filter by title, slug, location…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          aria-label="Filter projects"
        />
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableTh>Title</TableTh>
            <TableTh>Status</TableTh>
            <TableTh className="hidden sm:table-cell">Updated</TableTh>
            <TableTh className="w-[120px] text-right">Actions</TableTh>
          </TableRow>
        </TableHead>
        <TableBody>
          {slice.map((p) => (
            <TableRow key={p.id}>
              <TableTd className="font-medium text-stone-900">{p.title}</TableTd>
              <TableTd>
                <Badge
                  variant={
                    p.status === "published"
                      ? "success"
                      : p.status === "archived"
                        ? "muted"
                        : "warning"
                  }
                >
                  {p.status ?? "draft"}
                </Badge>
              </TableTd>
              <TableTd className="hidden text-stone-600 sm:table-cell">
                {formatDate(p.updated_at ?? p.created_at)}
              </TableTd>
              <TableTd className="text-right">
                <RowActions
                  viewHref={`/projects/${p.slug}`}
                  editHref={`/dashboard/projects/${p.id}/edit`}
                  onDelete={async () => {
                    const r = await deleteProjectAction(p.id);
                    return {
                      ok: r.ok,
                      message: r.ok ? undefined : r.message,
                    };
                  }}
                />
              </TableTd>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filtered.length === 0 ? (
        <p className="text-sm text-stone-500">No projects match your filter.</p>
      ) : null}
      <Pagination
        page={pageSafe}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
