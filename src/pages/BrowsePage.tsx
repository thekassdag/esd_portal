import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, CheckCircle2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";
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

const FILTERS = ["All >", "Senior level", "UI/UX Design", "Web Development", "Telegram Bot"];

/* ─── Level badge colors ─── */
const LEVEL_COLORS: Record<string, string> = {
  "Top Rated": "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  "Mid Level": "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  "Entry Level": "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  Junior: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  Senior: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
};

/* ─── Talent Card ─── */
function TalentCard({ talent }: { talent: Talent }) {
  const navigate = useNavigate();

  return (
    <Card
      className="talent-card glass-card rounded-2xl cursor-pointer hover:shadow-lg transition-all"
      onClick={() => navigate(`/browse/${talent.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="size-12 ring-2 ring-background shadow-sm">
            <AvatarImage src={talent.avatar} alt={talent.name} />
            <AvatarFallback>{talent.name[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-sm text-foreground truncate">{talent.name}</span>
              <CheckCircle2 size={13} className="text-primary flex-shrink-0" />
              <Badge
                variant="outline"
                className={cn("ml-auto text-[10px] font-semibold px-2 py-0 h-5 flex items-center gap-1", LEVEL_COLORS[talent.level])}
              >
                <Star size={9} fill="currentColor" />
                {talent.level}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">{talent.title}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <MapPin size={9} />
                {talent.location}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-wrap gap-1">
            {talent.skills.map((s) => (
              <Badge key={s} variant="secondary" className="text-[10px] px-2 py-0 h-5 font-normal">
                {s}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Browse Page ─── */
export default function BrowsePage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "a Senior UI Architect for a fintech platform.";
  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState("All >");

  return (
    <div className="min-h-screen gradient-bg pt-16">
      {/* Blobs */}
      <div className="blob w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-blue-300 top-0 right-0" style={{ opacity: 0.14 }} />
      <div className="blob w-[250px] h-[250px] md:w-[300px] md:h-[300px] bg-indigo-300 bottom-0 left-0" style={{ opacity: 0.12 }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Search bar */}
        <div className="frosted-input rounded-2xl flex items-center gap-3 px-4 py-2 mb-6 shadow-md">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-sm text-foreground outline-none ring-0 focus-visible:ring-0 placeholder-muted-foreground"
            placeholder="Describe your talent needs..."
          />
          <Button size="icon" className="size-9 rounded-full shadow-sm">
            <Search size={15} className="text-primary-foreground" />
          </Button>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          {FILTERS.map((f) => (
            <Button
              key={f}
              variant={activeFilter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(f)}
              className={cn(
                "h-8 text-xs font-medium rounded-full transition-all",
                activeFilter !== f && "bg-background/70 hover:bg-background"
              )}
            >
              {f}
            </Button>
          ))}
        </div>

        {/* Match count */}
        <p className="text-sm text-muted-foreground mb-5 font-medium">
          Showing <span className="text-primary">&lt;46 matches&gt;</span>
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
          {TALENTS.map((t) => (
            <TalentCard key={t.id} talent={t} />
          ))}
        </div>
      </div>
    </div>
  );
}
