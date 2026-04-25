"use client";

import { useTransition } from "react";
import { updateSiteDataAction } from "@/actions/site-data.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoading } from "@/hooks/use-loading";
import { useToast } from "@/hooks/use-toast";
import type { SiteData } from "@/types";

export function SiteDataForm({ initial }: { initial: SiteData }) {
  const { toast } = useToast();
  const { startLoading, stopLoading } = useLoading();
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, string | number> = {};
    const projects = fd.get("projects");
    const offices = fd.get("offices");
    const turnover = fd.get("turnover");
    const staffs = fd.get("staffs");

    if (typeof projects === "string" && projects.trim()) {
      payload.projects = Number(projects);
    }
    if (typeof offices === "string" && offices.trim()) {
      payload.offices = Number(offices);
    }
    if (typeof turnover === "string" && turnover.trim()) {
      payload.turnover = turnover.trim();
    }
    if (typeof staffs === "string" && staffs.trim()) {
      payload.staffs = Number(staffs);
    }
    startTransition(() => {
      startLoading("Updating…");
      void (async () => {
        try {
          const r = await updateSiteDataAction(payload);
          if (r.ok) {
            toast({ variant: "success", title: "Site data updated" });
          } else {
            toast({ variant: "error", title: r.message });
          }
        } finally {
          stopLoading();
        }
      })();
    });
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-5">
      <Input
        label="Projects"
        name="projects"
        type="number"
        defaultValue={String(initial.projects)}
      />
      <Input
        label="Offices"
        name="offices"
        type="number"
        defaultValue={String(initial.offices ?? "")}
      />
      <Input
        label="Turnover"
        name="turnover"
        type="text"
        defaultValue={String(initial.turnover ?? "")}
      />
      <Input
        label="Staffs"
        name="staffs"
        type="number"
        defaultValue={String(initial.staffs ?? "")}
      />
      <Button type="submit" disabled={pending}>
        Save site data
      </Button>
    </form>
  );
}
