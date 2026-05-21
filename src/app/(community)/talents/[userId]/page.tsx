import { Suspense } from 'react';
import { UserAbout, UserHeroCard, UserProjects, UserSkills, UserStats } from '../_component';

const TALENT = {
  name: "Laura Mitchell",
  title: "Senior UI Architect",
  location: "Addis Ababa, Ethiopia",
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
  stats: [
    { label: "Ranking", value: "$180k+" },
    { label: "Month Projects", value: "130+" },
    { label: "Total Projects", value: "130+" },
  ],
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* <div className="relative min-h-screen gradient-bg pt-16 overflow-hidden"> */}

        {/* <div className="relative z-10 max-w-5xl mx-auto px-4 py-8"> */}
          <div className="flex flex-col gap-6 mt-4">
            <UserHeroCard user={TALENT} />
            <UserStats stats={TALENT.stats} />
            <UserAbout about={TALENT.about} />
            <UserSkills skills={TALENT.skills} />
            <UserProjects 
              telegramChannel={TALENT.telegramChannel} 
              telegramPosts={TALENT.telegramPosts} 
            />
          </div>
        {/* </div> */}
      {/* </div> */}
    </Suspense>
  );
}
