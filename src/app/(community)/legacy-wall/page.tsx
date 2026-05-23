import { Metadata } from "next";
import { LegacyWallPage } from "./_component/LegacyWallPage";

export function generateMetadata(): Metadata {
  return {
    title: "Legacy Wall - East Devs Community",
    description:
      "A timeline of all events, contributions, and achievements of our community.",
  };
}

export default function Page() {
  return <LegacyWallPage />;
}
