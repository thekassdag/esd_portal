import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp, Paperclip, Sparkles, Zap, Globe, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const TAGS = [
  "Mobile App",
  "Web Development",
  "Telegram Bot",
  "UI/UX Design",
  "AI Integration",
];

const STATS = [
  { value: "12.4k+", label: "TALENT", icon: Users },
  { value: "98%", label: "MATCH RATE", icon: Zap },
  { value: "2.4s", label: "PROCESSING", icon: Sparkles },
  { value: "Global", label: "NETWORK", icon: Globe },
];

const PLACEHOLDER =
  "e.g. Seeking a Senior UI Architect for a fintech platform. We need expertise in\nReact, Figma, and high-precision data visualization...";

export default function HeroPage() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [query]);

  const handleSubmit = () => {
    if (!query.trim()) return;
    navigate(`/browse?q=${encodeURIComponent(query.trim())}`);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
  };

  return (
    <div className="relative min-h-screen gradient-bg flex flex-col overflow-hidden">
      {/* Decorative blobs — using brand blue at very low opacity (10% rule) */}
      <div
        className="blob w-[350px] h-[350px] md:w-[550px] md:h-[550px] bg-ikb-400 top-[-150px] left-[-120px] animate-float"
        style={{ opacity: 0.08 }}
      />
      <div
        className="blob w-[280px] h-[280px] md:w-[450px] md:h-[450px] bg-ikb-300 bottom-[-50px] right-[-100px] animate-float-delayed"
        style={{ opacity: 0.06 }}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-12 relative z-10">
        {/* Badge */}
        <div className="animate-fade-in mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-primary/8 text-primary border border-primary/15">
            <Sparkles size={12} />
            AI-Powered Talent Matching
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-center leading-[1.1] mb-4 animate-fade-in tracking-tight">
          <span className="text-foreground">What are we </span>
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(135deg, hsl(var(--ikb-600)) 0%, hsl(var(--ikb-400)) 50%, hsl(var(--ikb-500)) 100%)",
            }}
          >
            building?
          </span>
        </h1>

        <p className="text-muted-foreground text-sm text-center max-w-lg mb-10 animate-fade-in stagger-1 leading-relaxed">
          Describe your project goals, technical stack, or visual vibe. Our AI
          will curate the perfect talent match in seconds.
        </p>

        {/* Prompt box */}
        <div
          className={cn(
            "w-full max-w-2xl rounded-2xl transition-all duration-300 animate-slide-up",
            "frosted-input",
            focused
              ? "shadow-xl shadow-primary/8 ring-1 ring-primary/20"
              : "shadow-lg shadow-foreground/[0.03]"
          )}
        >
          <Textarea
            ref={textareaRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKey}
            placeholder={PLACEHOLDER}
            className="w-full bg-transparent border-none px-6 pt-5 pb-2 text-sm text-foreground placeholder-muted-foreground/50 resize-none outline-none ring-0 focus-visible:ring-0 leading-relaxed min-h-[120px]"
          />
          <div className="flex items-center justify-between px-5 pb-4 pt-1">
            {/* Upload button */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs text-muted-foreground bg-background/50 hover:bg-background border-border/80 rounded-full transition-all hover:border-muted-foreground/30"
            >
              <Paperclip size={13} />
              Upload
            </Button>

            {/* Send button */}
            <Button
              size="icon"
              onClick={handleSubmit}
              disabled={!query.trim()}
              className={cn(
                "size-9 rounded-full transition-all duration-300",
                query.trim()
                  ? "bg-primary shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.04] text-primary-foreground"
                  : "bg-muted text-muted-foreground/40 shadow-none"
              )}
            >
              <ArrowUp size={17} />
            </Button>
          </div>
        </div>

        {/* Suggestion chips */}
        <div className="flex flex-wrap gap-2 mt-6 justify-center animate-fade-in stagger-3">
          {TAGS.map((tag) => (
            <Button
              key={tag}
              variant="outline"
              size="sm"
              onClick={() => setQuery((prev) => (prev ? prev + ", " + tag : tag))}
              className="h-8 text-xs text-muted-foreground bg-background/60 hover:bg-background border-border/60 rounded-full px-4 transition-all hover:border-muted-foreground/30 hover:text-foreground"
            >
              {tag}
            </Button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-14 mt-20 animate-fade-in stagger-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center group">
                <div className="flex items-center justify-center mb-2">
                  <Icon size={14} className="text-primary/60 group-hover:text-primary transition-colors" />
                </div>
                <p className="text-xl md:text-2xl font-display font-extrabold text-foreground">{stat.value}</p>
                <p className="text-[10px] font-semibold text-muted-foreground tracking-[0.15em] mt-1">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
