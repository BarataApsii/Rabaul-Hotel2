import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "Rabaul Hotel",
  description: "Experience luxury and comfort at Rabaul Hotel, where the road ends and the adventure begins!",
  icons: {
    icon: {
      url: '/images/favicon.png',
      type: 'image/png',
    },
    apple: {
      url: '/images/favicon.png',
      type: 'image/png',
    },
  },
  openGraph: {
    title: 'Rabaul Hotel',
    description: 'Experience luxury and comfort at Rabaul Hotel, where the road ends and the adventure begins!',
    url: 'https://rabaulhotel.com',
    siteName: 'Rabaul Hotel',
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 600,
        alt: 'Rabaul Hotel Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rabaul Hotel',
    description: 'Experience luxury and comfort at Rabaul Hotel, where the road ends and the adventure begins!',
    images: ['/images/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
