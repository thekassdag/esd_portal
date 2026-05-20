export const PLATFORMS: Record<string, string> = {
  github: 'https://github.com/{username}',
  linkedin: 'https://linkedin.com/in/{username}',
  x: 'https://x.com/{username}',
  behance: 'https://behance.net/{username}',
  gurshaplus: 'https://gurshaplus.com/{username}'
};

export const PROJECT_TYPES: Record<string, string> = {
    mobile: 'iOS, Android, and cross-platform mobile applications',
    web: 'Websites, web apps, dashboards, and portals',
    backend: 'APIs, servers, databases, and microservices',
    frontend: 'UI components, responsive design, and client-side logic',
    ui_ux: 'Wireframes, prototypes, design systems, and user research',
    ml_and_ai: 'Models, datasets, NLP, computer vision, and LLM integrations',
    automation: 'Bots, scrapers, scheduled jobs, and workflow automation',
    graphics: 'Logos, branding, illustrations, posters, and social media assets',
    video_editing: 'Short films, reels, motion graphics, and color grading',
    library: 'Reusable packages, SDKs, CLIs, and developer tooling',
} as const;

export const EDC_LINKS: Record<string, string> = {
  GitHub: 'https://github.com/east_devs_community',
  LinkedIn: 'https://linkedin.com/in/east_devs_community',
  TikTok: 'https://tiktok.com/@east_devs_community',
  Donate: 'https://gurshaplus.com/eastdevs',
  DM: 'https://t.me/east_devs_community?direct'
};