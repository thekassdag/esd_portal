import { Metadata } from "next";
import { PodcastsPage } from "./_component/PodcastsPage";

export function generateMetadata(): Metadata {
  return {
    title: "Podcasts - East Devs Community",
    description:
      "Listen to community podcasts and learn from tech experts.",
  };
}

export default function Page() {
  return <PodcastsPage />;
}
