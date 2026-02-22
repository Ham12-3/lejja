"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddClientDialog } from "./add-client-dialog";

interface AddClientTriggerProps {
  organizationId: string;
}

export function AddClientTrigger({ organizationId }: AddClientTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-primary hover:bg-primary/80 text-primary-foreground shadow-lg shadow-primary/20"
      >
        <Plus className="w-4 h-4" />
        Add Client
      </Button>
      <AddClientDialog
        open={open}
        onClose={() => setOpen(false)}
        organizationId={organizationId}
      />
    </>
  );
}
