"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";

import { Button } from "@/components/ui/button";

type ConfirmModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  isLoading?: boolean;
};

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  onConfirm,
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg secondary-50 p-6 shadow-hover">
          <AlertDialog.Title className="font-display text-lg font-bold text-green-500">{title}</AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">{description}</AlertDialog.Description>
          <div className="mt-6 flex justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <Button variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
              {isLoading ? "Working..." : confirmLabel}
            </Button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
