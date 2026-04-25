"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/hooks/use-loading";
import { useToast } from "@/hooks/use-toast";

export function RowActions({
  viewHref,
  editHref,
  onDelete,
  deleteLabel = "Delete this item?",
}: {
  viewHref?: string;
  editHref?: string;
  onDelete: () => Promise<{ ok: boolean; message?: string }>;
  deleteLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const { startLoading, stopLoading } = useLoading();
  const { toast } = useToast();
  const router = useRouter();

  async function confirmDelete() {
    setOpen(false);
    startLoading("Deleting...");
    try {
      const r = await onDelete();
      if (r.ok) {
        toast({ variant: "success", title: "Deleted" });
        router.refresh();
      } else {
        toast({
          variant: "error",
          title: "Could not delete",
          description: r.message,
        });
      }
    } finally {
      stopLoading();
    }
  }

  return (
    <>
      <Dropdown
        trigger={
          <button
            type="button"
            className="rounded-md border border-stone-200 bg-white px-2 py-1 text-xs font-medium text-stone-700 shadow-sm hover:bg-stone-50"
          >
            Actions ▾
          </button>
        }
      >
        {viewHref ? (
          <DropdownItem onClick={() => router.push(viewHref)}>View</DropdownItem>
        ) : null}
        {editHref ? (
          <DropdownItem onClick={() => router.push(editHref)}>Edit</DropdownItem>
        ) : null}
        <DropdownItem destructive onClick={() => setOpen(true)}>
          Delete
        </DropdownItem>
      </Dropdown>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm delete"
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="danger" onClick={() => void confirmDelete()}>
              Delete
            </Button>
          </>
        }
      >
        <p>{deleteLabel}</p>
      </Modal>
    </>
  );
}
