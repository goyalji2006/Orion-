import type { Metadata } from 'next';
import { Orbitron, Inter } from 'next/font/google';
import './globals.css';

const orbitron = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'ORIAN | Space Station Interface',
  description: 'Exploring Technology, Creativity & Space. A premium, futuristic, space-themed personal link hub floating in the cosmos.',
  keywords: ['ORIAN', 'Linktree', 'Futuristic Linktree', 'Space themed bio', 'Kartikey Goyal', 'Antigravity', 'Next.js 14', 'Three.js Portfolio'],
  authors: [{ name: 'Kartikey Goyal' }],
  creator: 'Kartikey Goyal',
  openGraph: {
    title: 'ORIAN | Space Station Interface',
    description: 'Exploring Technology, Creativity & Space. A premium, futuristic, space-themed personal link hub.',
    url: baseUrl,
    siteName: 'ORIAN Space Station',
    images: [
      {
        url: '/og-image.png', // Fallback placeholder
        width: 1200,
        height: 630,
        alt: 'ORIAN space station',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ORIAN | Space Station Interface',
    description: 'Exploring Technology, Creativity & Space. A premium, futuristic, space-themed personal link hub.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD structured schema for search engines
  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'ORIAN',
    'url': baseUrl,
    'description': 'Exploring Technology, Creativity & Space. A futuristic space-themed personal link-in-bio website.',
    'author': {
      '@type': 'Person',
      'name': 'Kartikey Goyal',
      'jobTitle': 'Developer',
    },
  };

  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${inter.variable} antialiased`}
    >
      <body className="min-h-screen bg-space-black text-moon-silver font-inter overflow-x-hidden">
        {/* Structured Schema Injection */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
        {children}
      </body>
    </html>
  );
}
