import { Metadata } from "next";
import { PodcastsPage } from "./_component/PodcastsPage";
import { Suspense } from "react";

export function generateMetadata(): Metadata {
  return {
    title: "Podcasts - East Devs Community",
    description:
      "Listen to community podcasts and learn from tech experts.",
  };
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading podcasts...</div>}>
      <PodcastsPage />
    </Suspense>
  );
}
