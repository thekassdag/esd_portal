import { Metadata } from "next";
import { ProjectsPage } from "./_component/ProjectsPage";
import { Suspense } from "react";

export function generateMetadata(): Metadata {
  return {
    title: "Projects - East Devs Community",
    description:
      "Browse community projects and find talent that built something similar to your idea.",
  };
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading projects...</div>}>
      <ProjectsPage />
    </Suspense>
  );
}
