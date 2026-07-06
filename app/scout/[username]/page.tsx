import type { Metadata } from "next";
import ScoutClient from "./ScoutClient";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `Scout Report: @${username} | GitBall 2026`,
    description: `Inspect the GitHub 2026 World Cup style player card for @${username} on GitBall!`,
    openGraph: {
      title: `Scout Report: @${username} | GitBall 2026`,
      description: `Inspect the GitHub 2026 World Cup style player card for @${username} on GitBall!`,
      url: `https://gitball.com/scout/${username}`,
      images: [
        {
          url: "/gitball-opengraph-image.png",
          width: 800,
          height: 600,
          alt: "GitBall 2026 Scout Card Badge",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Scout Report: @${username} | GitBall 2026`,
      description: `Inspect the GitHub 2026 World Cup style player card for @${username} on GitBall!`,
      images: ["/gitball-opengraph-image.png"],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { username } = await params;
  return <ScoutClient username={username} />;
}
