"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  CheckCircle2,
  Star,
  Plus,
  Share2,
  MessageSquare,
  ChevronRight,
  GitCommitIcon,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
      className="w-full rounded-xl overflow-hidden [&>iframe]:!rounded-xl shadow-sm"
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
  telegramChannel: "east_devs_community",
  telegramPosts: [102, 201, 209, 293],
};

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
  const router = useRouter();

  return (
    <div className="relative min-h-screen gradient-bg pt-16 overflow-hidden">
      {/* Blobs */}
      <div className="blob w-[300px] h-[300px] md:w-[500px] md:h-[400px] bg-ikb-300 top-0 left-[-100px]" style={{ opacity: 0.15 }} />
      <div className="blob w-[250px] h-[250px] md:w-[350px] md:h-[350px] bg-ultramarine-300 bottom-[10%] right-[-60px]" style={{ opacity: 0.14 }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">


          {/* Hero card */}
          <Card className="glass-card rounded-2xl border-none shadow-md overflow-hidden animate-fade-in">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <Avatar className="size-28 ring-4 ring-background shadow-lg">
                    <AvatarImage src={TALENT.avatar} alt={TALENT.name} />
                    <AvatarFallback>{TALENT.name[0]}</AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 size-8 rounded-full shadow-md"
                  >
                    <Plus size={14} />
                  </Button>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                    <h1 className="text-2xl font-black text-foreground">{TALENT.name}</h1>
                    <CheckCircle2 size={18} className="text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{TALENT.title}</p>
                  <div className="flex items-center justify-center md:justify-start gap-1.5 mt-2 text-xs text-muted-foreground">
                    <MapPin size={12} />
                    {TALENT.location}
                  </div>

                  {/* Social links */}
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8 rounded-full"
                            nativeButton={false}
                            render={
                              <a
                                href={TALENT.socials.github}
                                target="_blank"
                                rel="noopener noreferrer"
                              />
                            }
                          >
                            <GitCommitIcon size={15} />
                          </Button>
                        }
                      />
                      <TooltipContent>GitHub</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8 rounded-full"
                            nativeButton={false}
                            render={
                              <a
                                href={TALENT.socials.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                              />
                            }
                          >
                            <LinkIcon size={15} />
                          </Button>
                        }
                      />
                      <TooltipContent>LinkedIn</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8 rounded-full"
                            nativeButton={false}
                            render={
                              <a
                                href={TALENT.socials.behance}
                                target="_blank"
                                rel="noopener noreferrer"
                              />
                            }
                          >
                            <BehanceIcon size={15} />
                          </Button>
                        }
                      />
                      <TooltipContent>Behance</TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2.5 w-full md:w-48 shrink-0">
                  <Button className="w-full gap-2 font-semibold shadow-sm shadow-primary/20" size="lg">
                    Message
                    <MessageSquare size={16} />
                  </Button>
                  <Button variant="secondary" className="w-full gap-2 font-semibold" size="lg">
                    Share
                    <Share2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats bar */}
          <Card className="glass-card rounded-2xl border-none shadow-md animate-fade-in">
            <CardContent className="p-5">
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: "Ranking", value: TALENT.earned },
                  { label: "Month Projects", value: TALENT.projects },
                  { label: "Total Projects", value: TALENT.projects },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center gap-1">
                    <span className="text-lg md:text-xl font-black text-foreground">{stat.value}</span>
                    <span className="text-[10px] md:text-xs text-muted-foreground font-medium">{stat.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card className="glass-card rounded-2xl border-none shadow-md animate-fade-in">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-base font-bold">About Me</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-xs text-muted-foreground leading-relaxed">{TALENT.about}</p>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="glass-card rounded-2xl border-none shadow-md animate-fade-in">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-base font-bold">Skills</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="flex flex-wrap gap-2">
                {TALENT.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="text-xs font-medium px-3 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all cursor-default"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Projects */}
          <Card className="glass-card rounded-2xl border-none shadow-md animate-fade-in">
            <CardHeader className="p-5 pb-0 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-bold text-foreground">Projects</CardTitle>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-primary text-xs"
                nativeButton={false}
                render={
                  <a
                    href={`https://t.me/${TALENT.telegramChannel}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                View All <ChevronRight size={12} className="ml-0.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-5">
              <div className="columns-1 sm:columns-2 gap-3 [&>div]:break-inside-avoid [&>div]:mb-3">
                {TALENT.telegramPosts.map((postId) => (
                  <TelegramPost
                    key={postId}
                    channel={TALENT.telegramChannel}
                    messageId={postId}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
