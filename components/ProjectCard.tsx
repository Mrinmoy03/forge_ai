"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Trash2, MessageSquare } from "lucide-react";
import { ProjectSummary } from "@/actions/projects";
import { DeleteProjectModal } from "./DeleteProjectModal";

interface ProjectCardProps {
  projects: ProjectSummary[];
}

function getProjectPreview(project: ProjectSummary) {
  if (project.imageUrl) return project.imageUrl;

  const title = (project.title || "").toLowerCase();

  if (
    title.includes("spotify") ||
    title.includes("music") ||
    title.includes("song") ||
    title.includes("audio")
  ) {
    return "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&auto=format&fit=crop&q=80";
  }
  if (
    title.includes("weather") ||
    title.includes("temperature") ||
    title.includes("forecast") ||
    title.includes("rain") ||
    title.includes("sun")
  ) {
    return "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=600&auto=format&fit=crop&q=80";
  }
  if (
    title.includes("kanban") ||
    title.includes("board") ||
    title.includes("todo") ||
    title.includes("task") ||
    title.includes("list")
  ) {
    return "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&auto=format&fit=crop&q=80";
  }
  if (
    title.includes("dashboard") ||
    title.includes("chart") ||
    title.includes("analytics") ||
    title.includes("stats") ||
    title.includes("data")
  ) {
    return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80";
  }
  if (
    title.includes("chat") ||
    title.includes("message") ||
    title.includes("social") ||
    title.includes("forum")
  ) {
    return "https://images.unsplash.com/photo-1611606698335-8474e3157e88?w=600&auto=format&fit=crop&q=80";
  }
  if (
    title.includes("shop") ||
    title.includes("store") ||
    title.includes("cart") ||
    title.includes("ecommerce")
  ) {
    return "https://images.unsplash.com/photo-1557821552-17105176677c?w=600&auto=format&fit=crop&q=80";
  }

  // Fallback to high quality abstract premium geometric gradient
  return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80";
}

function MiniProjectPreview({ project }: { project: ProjectSummary }) {
  const previewUrl = getProjectPreview(project);
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-white/3 border border-white/4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={previewUrl}
        alt={project.title || "Preview"}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
    </div>
  );
}

export function ProjectCard({ projects }: ProjectCardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => {
        const title = project.title ?? "Untitled project";
        const timeAgo = formatDistanceToNow(new Date(project.updatedAt), {
          addSuffix: true,
        });
        const msgCount = Math.floor(project.messageCount / 2);

        return (
          <div
            key={project.id}
            className="group relative flex flex-col rounded-xl border border-white/6 bg-[#0f0f0f] p-3.5 transition-all duration-300 hover:border-white/12 hover:bg-[#121212] hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)]"
          >
            <Link
              href={`/workspace?id=${project.id}`}
              className="absolute inset-0 rounded-xl"
              aria-label={`Open ${title}`}
            />

            {/* Live Preview / Screenshot */}
            <div className="mb-3.5">
              <MiniProjectPreview project={project} />
            </div>

            {/* Top row */}
            <div className="mb-2 flex items-start justify-between gap-2">
              <p className="line-clamp-1 text-sm font-medium leading-snug text-white/85 group-hover:text-white transition-colors">
                {title}
              </p>
              <DeleteProjectModal project={project}>
                <span className="relative z-10 text-white/20 hover:text-red-400 cursor-pointer p-0.5 rounded transition-colors hover:bg-white/5">
                  <Trash2 className="h-3.5 w-3.5" />
                </span>
              </DeleteProjectModal>
            </div>

            {/* First prompt preview */}
            {project.firstPrompt && (
              <p className="mb-4 line-clamp-2 text-[12px] leading-relaxed text-white/30 group-hover:text-white/40 transition-colors">
                {project.firstPrompt}
              </p>
            )}

            {/* Meta */}
            <div className="mt-auto flex items-center gap-3 pt-2.5 border-t border-white/4">
              <span className="flex items-center gap-1 text-[11px] text-white/25">
                <MessageSquare className="h-3 w-3" />
                {msgCount} message{msgCount !== 1 ? "s" : ""}
              </span>
              <span className="text-[11px] text-white/20">{timeAgo}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
