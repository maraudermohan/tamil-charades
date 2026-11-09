import type { Metadata } from 'next';
import BrokenImageGuard from '@/components/BrokenImageGuard';
import SessionMetricsHandler from '@/components/SessionMetricsHandler';
import { SITE_NAME, SITE_URL } from '@/constant/site';
import { themeBootScript } from '@/utils/theme';
import './tokens.css';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tamil & Hollywood Dumb Charades",
    template: `%s | ${SITE_NAME}`,
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
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [{ url: "/tamil-logo-blue.webp", alt: SITE_NAME }],
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
    // `data-theme` is added by themeBootScript before hydration.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeBootScript }}
        />
      </head>
      <body>
        <noscript>
          <p className="noscript-banner">
            Tamil Charades needs JavaScript to play. Please turn it on and reload the page.
          </p>
        </noscript>
        <SessionMetricsHandler />
        <BrokenImageGuard />
        {children}
      </body>
    </html>
  )
}
