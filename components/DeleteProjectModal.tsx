"use client";

import * as React from "react";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteProject } from "@/actions/projects";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ProjectSummary } from "@/actions/projects";

interface DeleteProjectModalProps {
  project: ProjectSummary;
  children: React.ReactNode;
}

export function DeleteProjectModal({
  project,
  children,
}: DeleteProjectModalProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = React.useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteProject(project.id);
        toast.success(`Successfully deleted "${project.title || "Untitled project"}"`);
        setOpen(false);
      } catch (error) {
        console.error("Delete project error:", error);
        toast.error("Failed to delete the project. Please try again.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="cursor-pointer flex items-center justify-center shrink-0">
        {children}
      </DialogTrigger>
      <DialogContent className="border-white/10 bg-[#0d0d0d] text-white rounded-2xl max-w-md w-[90vw]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">
            Delete Project
          </DialogTitle>
          <DialogDescription className="text-white/40 mt-2">
            Are you sure you want to delete &quot;{project.title || "Untitled project"}&quot;? 
            This action cannot be undone and all files will be permanently lost.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex gap-2">
          <DialogClose
            render={
              <Button
                variant="ghost"
                disabled={isPending}
                className="hover:bg-white/5 hover:text-white text-white/50"
              />
            }
          >
            Cancel
          </DialogClose>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isPending ? "Deleting..." : "Delete Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
