import type { FileData } from "./workspace";

export interface ProjectSummary {
  id: string;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  firstPrompt: string | null;
  imageUrl?: string | null;
  fileData?: FileData | null;
}
