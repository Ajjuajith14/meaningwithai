import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ClarityScript } from "@/components/analytics/clarity-script";
import { Toaster } from "sonner"


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Visualize Dictionary - AI-Powered Visual Learning for Kids",
  description:
    "Transform words into visual stories! Our AI-powered platform helps children learn vocabulary through engaging images and kid-friendly explanations.",
  keywords: [
    "visual dictionary",
    "kids learning",
    "vocabulary builder",
    "AI education",
    "visual learning",
    "children dictionary",
    "educational technology",
    "word visualization",
    "learning app for kids",
    "interactive dictionary",
  ],
  authors: [{ name: "Visualize Dictionary Team" }],
  creator: "Visualize Dictionary",
  publisher: "Visualize Dictionary",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://visualizedictionary.com"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Visualize Dictionary - AI-Powered Visual Learning for Kids",
    description:
      "Transform words into visual stories! Our AI-powered platform helps children learn vocabulary through engaging images and kid-friendly explanations.",
    url: "https://visualizedictionary.com",
    siteName: "Visualize Dictionary",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Visualize Dictionary - Visual Learning Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Visualize Dictionary - AI-Powered Visual Learning for Kids",
    description:
      "Transform words into visual stories! Our AI-powered platform helps children learn vocabulary through engaging images and kid-friendly explanations.",
    images: ["/og-image.png"],
    creator: "@visualizedict",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        <ClarityScript />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-center"
            expand={true}
            richColors={true}
            closeButton={true}
            duration={4000}
            toastOptions={{
              style: {
                background: "white",
                border: "1px solid #e5e7eb",
                color: "#374151",
                fontSize: "14px",
                fontWeight: "500",
                borderRadius: "12px",
                padding: "16px",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              },
              className: "font-playful",
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
