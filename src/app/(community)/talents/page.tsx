"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, CheckCircle2, Star, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/* ─── Types ─── */
interface Talent {
    id: number;
    name: string;
    title: string;
    experience: string;
    location: string;
    rate: number;
    level: "Top Rated" | "Mid Level" | "Entry Level" | "Junior" | "Senior";
    skills: string[];
    avatar: string;
}

/* ─── Mock data ─── */
const TALENTS: Talent[] = [
    { id: 1, name: "Laura Mitchell", title: "Senior UI Architect", experience: "8+ years", location: "Addis Ababa, Ethiopia", rate: 80, level: "Top Rated", skills: ["Figma", "React"], avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=laura" },
    { id: 2, name: "Aisha Khan", title: "Visual Designer", experience: "8 years", location: "Dubai, UAE", rate: 55, level: "Mid Level", skills: ["Canva", "Bootstrap"], avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aisha1" },
    { id: 3, name: "David Johnson", title: "Product Designer", experience: "5 years", location: "Nairobi, Kenya", rate: 60, level: "Mid Level", skills: ["Sketch", "Vue.js"], avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david" },
    { id: 4, name: "Aisha Khan", title: "Visual Designer", experience: "8 years", location: "Dubai, UAE", rate: 55, level: "Mid Level", skills: ["Canva", "Bootstrap"], avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aisha2" },
    { id: 5, name: "Sofia Garcia", title: "UX Researcher", experience: "3 years", location: "Madrid, Spain", rate: 40, level: "Entry Level", skills: ["Adobe XD", "Angular"], avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sofia" },
    { id: 6, name: "Michael Lee", title: "UX/UI Designer", experience: "4 years", location: "San Francisco, USA", rate: 40, level: "Junior", skills: ["Figma", "React"], avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael" },
    { id: 7, name: "Michael Tan", title: "Interaction Designer", experience: "7 years", location: "Singapore, Singapore", rate: 85, level: "Top Rated", skills: ["InVision", "JavaScript"], avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tan" },
    { id: 8, name: "Sofia Patel", title: "Product Designer", experience: "8 years", location: "Toronto, Canada", rate: 70, level: "Senior", skills: ["Sketch", "Adobe XD"], avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=patel" },
];

const FILTERS = ["All", "Senior level", "UI/UX Design", "Web Development", "Telegram Bot"];

/* ─── Level badge — neutral style with a tiny accent ─── */
const LEVEL_STYLES: Record<string, string> = {
    "Top Rated": "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50",
    "Mid Level": "bg-muted text-muted-foreground border-border",
    "Entry Level": "bg-muted text-muted-foreground border-border",
    Junior: "bg-muted text-muted-foreground border-border",
    Senior: "bg-primary/6 text-primary border-primary/15 dark:bg-primary/10 dark:border-primary/20",
};

/* ─── Talent Card ─── */
function TalentCard({ talent, index }: { talent: Talent; index: number }) {
    const router = useRouter();

    return (
        <Card
            className={cn(
                "talent-card glass-card rounded-xl cursor-pointer border-border/50 animate-fade-in",
                `stagger-${index + 1}`
            )}
            onClick={() => router.push(`/browse/${talent.id}`)}
        >
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <Avatar className="size-11 ring-1 ring-border shadow-sm">
                        <AvatarImage src={talent.avatar} alt={talent.name} />
                        <AvatarFallback className="text-xs">{talent.name[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-sm text-foreground truncate">{talent.name}</span>
                            <CheckCircle2 size={13} className="text-primary flex-shrink-0" />
                            <Badge
                                variant="outline"
                                className={cn(
                                    "ml-auto text-[10px] font-medium px-2 py-0 h-5 flex items-center gap-1 rounded-full",
                                    LEVEL_STYLES[talent.level]
                                )}
                            >
                                {talent.level === "Top Rated" && <Star size={8} fill="currentColor" />}
                                {talent.level}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{talent.title}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                <MapPin size={10} />
                                {talent.location}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                <Briefcase size={10} />
                                {talent.experience}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                    <div className="flex flex-wrap gap-1.5">
                        {talent.skills.map((s) => (
                            <Badge key={s} variant="secondary" className="text-[10px] px-2 py-0 h-5 font-normal rounded-md">
                                {s}
                            </Badge>
                        ))}
                    </div>
                    <span className="text-xs font-semibold text-foreground">${talent.rate}/hr</span>
                </div>
            </CardContent>
        </Card>
    );
}

/* ─── Browse Page ─── */
export default function BrowsePage() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q");
    const [query, setQuery] = useState(initialQuery || "");
    const [activeFilter, setActiveFilter] = useState("All");
    const pathname = usePathname();

    return (
        <div>
            {/* Match count */}
            <p className="text-sm text-muted-foreground mb-5 font-medium">
                Showing <span className="text-primary font-semibold">46 matches</span>
            </p>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TALENTS.map((t, i) => (
                    <TalentCard key={t.id} talent={t} index={i} />
                ))}
            </div>
        </div>
    );
}
