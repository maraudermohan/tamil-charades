import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GameController from "@/components/GameController";
import { GAME_MODES_DATA, GAME_SLUGS, isGameSlug } from "@/constant/gameModes";
import { SITE_NAME } from "@/constant/site";
import styles from "../../page.module.css";
import { GAME_PATH_SEO } from "./seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return GAME_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/game/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!isGameSlug(slug)) {
    notFound();
  }
  const seo = GAME_PATH_SEO[slug];
  const fullTitle = `${seo.title} | ${SITE_NAME}`;
  const artwork = GAME_MODES_DATA[slug].backgroundLg;
  const image = {
    url: artwork.src,
    width: artwork.width,
    height: artwork.height,
    alt: GAME_MODES_DATA[slug].title,
  };

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
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: seo.description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

async function ModePage({ params }: PageProps<"/game/[slug]">) {
  const { slug } = await params;
  if (!isGameSlug(slug)) {
    notFound();
  }

  return (
    <main className={styles.main}>
      <GameController slug={slug} />
    </main>
  );
}

export default ModePage;
