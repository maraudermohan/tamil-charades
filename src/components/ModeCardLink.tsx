"use client";
import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { useOpenModeDetails } from "@/components/ModeDetailsDialog";
import type { GameSlug } from "@/constant/gameModes";

type ModeCardLinkProps = {
  slug: GameSlug;
  className?: string;
  children: ReactNode;
};

/**
 * A mode card's link to its game page. A plain click opens the mode's dialog over the homepage
 * instead; modified clicks (new tab, new window) follow the link, and its details sheet shows there.
 */
function ModeCardLink({ slug, className, children }: ModeCardLinkProps) {
  const openModeDetails = useOpenModeDetails();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      openModeDetails != null &&
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      event.preventDefault();
      openModeDetails(slug);
    }
  };

  return (
    <Link className={className} href={`/game/${slug}`} prefetch={false} onClick={handleClick}>
      {children}
    </Link>
  );
}

export default ModeCardLink;
