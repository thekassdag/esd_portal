import { Metadata } from "next";
import { TalentsPage } from "./_component/TalentsPage";
import { Suspense } from "react";

export function generateMetadata(): Metadata {
    return {
        title: "Talents - East Devs Community",
        description: "Browse and discover talented individuals in the community.",
    };
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading talents...</div>}>
            <TalentsPage />
        </Suspense>
    );
}