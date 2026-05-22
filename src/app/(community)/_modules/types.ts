import type { getProjects } from "./actions";

export type EmbeddingResult = {
  id: string; // embedding key (fr_key) to user_projects.embedding_key
  score: number; // similarity score
};

export type ProjectsResponse = Awaited<ReturnType<typeof getProjects>>;
export type Project = ProjectsResponse["data"][number];