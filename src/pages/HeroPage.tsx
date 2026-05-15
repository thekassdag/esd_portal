import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

const TAGS = [
  "Mobile App",
  "Web Development",
  "Telegram Bot",
  "UI/UX Design",
  "AI Integration",
];

const STATS = [
  { value: "12.4k+", label: "TALENT" },
  { value: "98%", label: "MATCH RATE" },
  { value: "2.4s", label: "PROCESSING" },
  { value: "Global", label: "NETWORK" },
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
      {/* Decorative blobs */}
      <div
        className="blob w-[500px] h-[500px] bg-blue-400 top-[-120px] left-[-100px]"
        style={{ opacity: 0.18 }}
      />
      <div
        className="blob w-[400px] h-[400px] bg-indigo-400 bottom-0 right-[-80px]"
        style={{ opacity: 0.18 }}
      />
      <div
        className="blob w-[300px] h-[300px] bg-sky-300 top-[30%] right-[15%]"
        style={{ opacity: 0.14 }}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-12 relative z-10">
        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-black text-center leading-tight mb-4 animate-fade-in">
          <span className="text-slate-800">What are we </span>
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #2563eb 0%, #93c5fd 60%, #c7d2fe 100%)",
            }}
          >
            building?
          </span>
        </h1>

        <p className="text-muted-foreground text-sm text-center max-w-md mb-10 animate-fade-in leading-relaxed">
          Describe your project goals, technical stack, or visual vibe. Our AI
          will curate the perfect talent match in seconds.
        </p>

        {/* Prompt box */}
        <div
          className={cn(
            "w-full max-w-2xl rounded-2xl shadow-xl transition-all duration-300 animate-slide-up",
            "frosted-input",
            focused
              ? "shadow-blue-200/60 ring-2 ring-primary/30"
              : "shadow-slate-200/50"
          )}
        >
          <textarea
            ref={textareaRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKey}
            placeholder={PLACEHOLDER}
            rows={4}
            className="w-full bg-transparent px-6 pt-5 pb-2 text-sm text-slate-700 placeholder-slate-400 resize-none outline-none leading-relaxed"
          />
          <div className="flex items-center justify-between px-5 pb-4 pt-1">
            {/* Upload button */}
            <button className="flex items-center gap-1.5 text-xs text-slate-500 bg-white/70 hover:bg-white border border-slate-200 rounded-full px-3 py-1.5 transition-all hover:border-primary/40">
              <Paperclip size={13} />
              Upload
            </button>

            {/* Send button */}
            <button
              onClick={handleSubmit}
              disabled={!query.trim()}
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200",
                query.trim()
                  ? "bg-primary shadow-md shadow-blue-300/50 hover:scale-105 hover:shadow-blue-400/60 text-white"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              )}
            >
              <ArrowUp size={17} />
            </button>
          </div>
        </div>

        {/* Suggestion chips */}
        <div className="flex flex-wrap gap-2 mt-6 justify-center animate-fade-in">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery((prev) => (prev ? prev + ", " + tag : tag))}
              className="text-xs text-slate-600 bg-white/60 hover:bg-white border border-slate-200/80 rounded-full px-4 py-1.5 transition-all hover:border-primary/40 hover:text-primary hover:shadow-sm backdrop-blur-sm"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-12 mt-16 animate-fade-in">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
              <p className="text-[10px] font-semibold text-muted-foreground tracking-widest mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
