import { Metadata } from "next";
import { TalentsPage } from "./_component/TalentsPage";

export function generateMetadata(): Metadata {
    return {
        title: "Talents - East Devs Community",
        description: "Browse and discover talented individuals in the community.",
    };
}

export default function Page() {
    return (
        <TalentsPage />
    );
}

