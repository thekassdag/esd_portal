import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  CheckCircle2,
  Star,
  Plus,
  Share2,
  MessageSquare,
  ChevronRight,
  GitCommitIcon,
  Link,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Behance icon (not in lucide) ─── */
function BehanceIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.5 11c1.38 0 2.5-1.12 2.5-2.5S8.88 6 7.5 6H3v5h4.5zm0-3.5c.55 0 1 .45 1 1s-.45 1-1 1H4.5V7.5H7.5zM3 12.5h5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5H3v-5zM8 16c.55 0 1-.45 1-1s-.45-1-1-1H4.5v2H8zm7-8h5v1h-5zm2.5 2c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5c1.52 0 2.87-.76 3.69-1.92l-1.23-.85c-.53.77-1.41 1.27-2.46 1.27-1.65 0-3-1.35-3-3h7c.03-.17.05-.33.05-.5 0-2.49-2.01-4.5-4.5-4.5h.45zm-3 3.5c.31-1.36 1.52-2.5 3-2.5s2.69 1.14 3 2.5h-6z" />
    </svg>
  );
}

/* ─── Telegram Embed Widget ─── */
function TelegramPost({ channel, messageId }: { channel: string; messageId: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // Clear previous content
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-post", `${channel}/${messageId}`);
    script.setAttribute("data-width", "100%");
    script.setAttribute("data-userpic", "false");
    containerRef.current.appendChild(script);
  }, [channel, messageId]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-xl overflow-hidden [&>iframe]:!rounded-xl"
    />
  );
}

/* ─── Mock data ─── */
const TALENT = {
  name: "Laura Mitchell",
  title: "Senior UI Architect",
  location: "Addis Ababa, Ethiopia",
  rating: 4.9,
  experience: "8+ years",
  rate: 80,
  jobSuccess: 93,
  matchScore: 98,
  level: "Top Rated",
  flag: "🇪🇹",
  yearsLabel: "6+",
  earned: "$180k+",
  projects: "130+",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=laura&backgroundColor=b6e3f4",
  about:
    "Hello, I'm Laura, a Senior UI Architect with extensive experience in designing intuitive and engaging user interfaces. I specialize in creating seamless digital experiences that drive user satisfaction and business success.",
  skills: ["UI/UX Design", "React", "Figma", "Prototyping"],
  socials: {
    github: "https://github.com/lauramitchell",
    linkedin: "https://linkedin.com/in/lauramitchell",
    behance: "https://behance.net/lauramitchell",
  },
  // Telegram channel and post IDs to embed as portfolio
  telegramChannel: "east_devs_community",
  telegramPosts: [102, 201, 209, 293],
};

/* ─── Progress Ring ─── */
function ProgressRing({ value, size = 56 }: { value: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="progress-ring">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={5}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#2563eb"
          strokeWidth={5}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-primary">
        {value}%
      </span>
    </div>
  );
}

/* ─── Star Rating ─── */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={cn(
            i <= Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-slate-300"
          )}
        />
      ))}
    </div>
  );
}

/* ─── Profile Page ─── */
export default function ProfilePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-bg pt-16">
      {/* Blobs */}
      <div className="blob w-[500px] h-[400px] bg-blue-300 top-0 left-[-100px]" style={{ opacity: 0.15 }} />
      <div className="blob w-[350px] h-[350px] bg-indigo-300 bottom-[10%] right-[-60px]" style={{ opacity: 0.14 }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Hero card */}
            <div className="glass-card rounded-2xl p-6 animate-fade-in">
              <div className="flex items-start gap-5">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-white shadow-lg bg-slate-200">
                    <img
                      src={TALENT.avatar}
                      alt={TALENT.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors">
                    <Plus size={13} className="text-white" />
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-black text-slate-800">{TALENT.name}</h1>
                    <CheckCircle2 size={18} className="text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{TALENT.title}</p>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
                    <MapPin size={12} />
                    {TALENT.location}
                  </div>

                  {/* Social links */}
                  <div className="flex items-center gap-2 mt-3">
                    <a
                      href={TALENT.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-800 hover:text-white text-slate-600 flex items-center justify-center transition-all duration-200 border border-slate-200 hover:border-slate-800"
                      title="GitHub"
                    >
                      <GitCommitIcon size={15} />
                    </a>
                    <a
                      href={TALENT.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#0077B5] hover:text-white text-slate-600 flex items-center justify-center transition-all duration-200 border border-slate-200 hover:border-[#0077B5]"
                      title="LinkedIn"
                    >
                      <Link size={15} />
                    </a>
                    <a
                      href={TALENT.socials.behance}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#1769FF] hover:text-white text-slate-600 flex items-center justify-center transition-all duration-200 border border-slate-200 hover:border-[#1769FF]"
                      title="Behance"
                    >
                      <BehanceIcon size={15} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="glass-card rounded-2xl p-5 animate-fade-in">
              <div className="flex justify-between items-center px-10">
                {[
                  { label: "Ranking", value: TALENT.earned },
                  { label: "This mothe project", value: TALENT.projects },
                  { label: "Total Projects", value: TALENT.projects },
                ].map((stat, idx) => (
                  <div key={stat.label} className="flex flex-col items-center gap-1.5">
                    <span className="text-xl font-black text-slate-800">{stat.value}</span>
                    <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects (Telegram Embedded Posts) */}
            <div className="glass-card rounded-2xl p-5 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-800">Projects</h2>
                <a
                  href={`https://t.me/${TALENT.telegramChannel}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-0.5"
                >
                  View All <ChevronRight size={12} />
                </a>
              </div>
              <div className="columns-1 sm:columns-2 gap-3 [&>div]:break-inside-avoid [&>div]:mb-3">
                {TALENT.telegramPosts.map((postId) => (
                  <TelegramPost
                    key={postId}
                    channel={TALENT.telegramChannel}
                    messageId={postId}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col gap-5">

            {/* Rate & CTA */}
            <div className="glass-card rounded-2xl p-5 animate-fade-in">
              <button className="w-full bg-primary text-white font-semibold text-sm py-2.5 rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-blue-300/40 flex items-center justify-center gap-2 mb-2">
                Message
                <MessageSquare size={15} />
              </button>
              <button className="w-full bg-secondary text-primary font-semibold text-sm py-2.5 rounded-xl transition-all shadow-md shadow-blue-300/40 flex items-center justify-center gap-2 mb-2">
                Share
                <Share2 size={14} />
              </button>
            </div>

            {/* About */}
            <div className="glass-card rounded-2xl p-5 animate-fade-in">
              <h2 className="font-bold text-slate-800 mb-3">About Me</h2>
              <p className="text-xs text-slate-600 leading-relaxed">{TALENT.about}</p>
            </div>

            {/* Skills */}
            <div className="glass-card rounded-2xl p-5 animate-fade-in">
              <h2 className="font-bold text-slate-800 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {TALENT.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium text-primary bg-blue-50 border border-blue-100 rounded-full px-3 py-1 hover:bg-primary hover:text-white transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
