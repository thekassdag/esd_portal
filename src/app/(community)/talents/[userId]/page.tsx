import { Suspense } from 'react';
import { Metadata } from 'next';
import { UserAbout, UserHeroCard, UserProjects, UserServices, UserStats } from '../_component';
import { getUserDetailsById } from '../_modules/actions';
import { notFound } from 'next/navigation';
import { PLATFORMS } from '@/lib/constants';
import bot from '@/lib/telegram-bot';
import { capitalizeFirst } from '@/lib/utils';


type Props = {
  params: Promise<{ userId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;
  const user = await getUserDetailsById(userId);

  if (!user) {
    return {
      title: 'Talent Not Found | Talent Pool',
    };
  }

  const name = user.fullName;
  const title = user.headline || "---";
  const bio = user.bio || `Check out ${name}'s profile on E-DC`;
  const avatar = user.profileImageId ? `${process.env.NEXT_PUBLIC_APP_URL}/files/${user.profileImageId}` : `https://ui-avatars.com/api/?name=${user.fullName}`;

  return {
    title: `${name} | ${title} - East Devs Community`,
    description: bio.length > 160 ? `${bio.substring(0, 157)}...` : bio,
    openGraph: {
      title: `${name} | ${title}`,
      description: bio.length > 160 ? `${bio.substring(0, 157)}...` : bio,
      images: [avatar],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} | ${title}`,
      description: bio.length > 160 ? `${bio.substring(0, 157)}...` : bio,
      images: [avatar],
    },
  };
}

export default async function Page({ params }: Props) {
  const { userId } = await params;
  const data = await getUserDetailsById(userId);

  if (!data || !data.telegramId || !data.isActive) {
    notFound();
  }

  let tgUsername;
  try {
    const { username } = await bot.api.getChat(data.telegramId);
    tgUsername = username;
  } catch (error) {
    console.log("error while fetching username: ", error);
  }



  // props data to match with UI
  const socials = Object.fromEntries(
    data.socialLinks.map((social: any) => [
      social.platform,
      {
        username: social.username,
        link: PLATFORMS[social.platform].link.replace(
          "{username}",
          social.username
        ),
        icon: PLATFORMS[social.platform]?.icon,
      },
    ])
  );

  const user = {
    fullName: capitalizeFirst(data.fullName),
    isTeamMember: data.isTeamMember,
    headline: data.headline || "---",
    uni: data.university!,
    gcYear: data.graduationYear!,
    dep: data.department!,
    avatar: data.profileImageId ? `${process.env.NEXT_PUBLIC_APP_URL}/files/${data.profileImageId}` : `https://ui-avatars.com/api/?name=${data.fullName}`,
    socials: socials,
    tgUsername
  }
  const stats = [
    { label: "this month", value: `${(data as any).monthProjects || 0}` },
    { label: "this year", value: `${(data as any).yearProjects || 0}` },
    { label: "total", value: `${(data as any).totalProjects || 0}` },
  ];
  const services = data.services && data.services.length > 0
    ? data.services.map((s: any) => s.service?.name || s.name).filter(Boolean)
    : []

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* <div className="relative min-h-screen gradient-bg pt-16 overflow-hidden"> */}
      {/* <div className="relative z-10 max-w-5xl mx-auto px-4 py-8"> */}
      <div className="flex flex-col gap-6 mt-4">
        <UserHeroCard user={user} />
        <UserStats stats={stats} githubUsername={socials["github"]?.username} />
        {data?.bio && (
          <UserAbout about={data.bio} />
        )}
        {services.length > 0 && (
          <UserServices services={services} />
        )}
        <UserProjects userId={userId} />
      </div>
    </Suspense>
  );
}