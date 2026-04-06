import type { Metadata } from "next";
import { GameController } from "components";
import styles from "../../page.module.css";
import { GAME_PATH_SEO } from "./seo";

export async function generateStaticParams() {
  return [{ slug: "classic" }, { slug: "story" }, { slug: "song" }, { slug: "kids" }, { slug: "hollywood" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seo = GAME_PATH_SEO[slug];
  if (seo == null) {
    return {
      title: "Game mode",
      description: "Play Tamil and Hollywood dumb charades online.",
    };
  }

  const fullTitle = `${seo.title} | Tamil Charades`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: `/game/${slug}/`,
    },
    openGraph: {
      title: fullTitle,
      description: seo.description,
      url: `/game/${slug}/`,
      siteName: "Tamil Charades",
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: seo.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

async function ModePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <main className={styles.main} style={{ backgroundColor: "#f5fffa" }}>
      <GameController slug={slug} />
    </main>
  );
}

export default ModePage;
