import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tamil Charades',
  description: 'Charades game for Tamil movies. Developed by Mohan Subramanian.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon-180x180.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
