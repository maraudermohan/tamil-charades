import { readFileSync } from 'fs';
import { join } from 'path';
import type { Metadata } from 'next';
import { SessionMetricsHandler } from 'components';
import './globals.css';

/** Inlined so static export runs zoom detect during parse (beforeInteractive + src only preloads on export). */
const iosSafariZoomCheck = readFileSync(
  join(process.cwd(), 'public/ios-safari-zoom-boot.js'),
  'utf8',
);

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tamilcharades.com"),
  title: {
    default: "Tamil & Hollywood Dumb Charades",
    template: "%s | Tamil Charades",
  },
  description:
    "Dumb Charades game for Tamil and English movies. Classic, Story, Song, Kids, and Hollywood modes. 1960s through latest films.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon-180x180.png",
  },
  /** Default for `/`; child routes (e.g. `/game/classic`) override in `generateMetadata`. */
  openGraph: {
    title: "Tamil & Hollywood Dumb Charades",
    description:
      "Dumb Charades game for Tamil and English movies. Classic, Story, Song, Kids, and Hollywood modes. 1960s through latest films.",
    url: "/",
    siteName: "Tamil Charades",
    type: "website",
    locale: "en_US",
    images: [{ url: "/tamil-logo-blue.webp", alt: "Tamil Charades" }],
  },
  twitter: {
    card: "summary",
    title: "Tamil & Hollywood Dumb Charades",
    description:
      "Dumb Charades game for Tamil and English movies. Classic, Story, Song, Kids, and Hollywood modes. 1960s through latest films.",
    images: ["/tamil-logo-blue.webp"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: iosSafariZoomCheck }}
        />
      </head>
      <body>
        <SessionMetricsHandler />
        {children}
      </body>
    </html>
  )
}
