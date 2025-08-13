import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { AuthProvider } from "@/lib/auth-context"
import { ClarityScript } from "@/components/analytics/clarity-script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Visualize Dictionary - AI-Powered Visual Learning for Kids",
  description:
    "Transform learning with our AI-powered visual dictionary. Perfect for children to discover word meanings through beautiful images and kid-friendly explanations.",
  keywords: [
    "visual dictionary",
    "AI learning",
    "kids education",
    "visual learning",
    "children dictionary",
    "educational technology",
    "word meanings",
    "visual vocabulary",
  ],
  authors: [{ name: "Visualize Dictionary Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#3b82f6" }],
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://visualizedictionary.com"),
  alternates: {
    canonical: "https://visualizedictionary.com",
  },
  openGraph: {
    title: "Visualize Dictionary - AI-Powered Visual Learning for Kids",
    description:
      "Transform learning with our AI-powered visual dictionary. Perfect for children to discover word meanings through beautiful images.",
    type: "website",
    locale: "en_US",
    url: "https://visualizedictionary.com",
    siteName: "Visualize Dictionary",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Visualize Dictionary - AI-Powered Visual Learning for Kids",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Visualize Dictionary - AI-Powered Visual Learning for Kids",
    description:
      "Transform learning with our AI-powered visual dictionary. Perfect for children to discover word meanings through beautiful images.",
    images: ["/og-image.png"],
    creator: "@visualizedictionary",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png?v=2" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png?v=2" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="canonical" href="https://visualizedictionary.com" />

        {/* Microsoft Clarity Analytics */}
        <ClarityScript />
      </head>
      <body className={`${inter.className} font-sans antialiased min-h-screen bg-background text-foreground`}>
        <AuthProvider>
          <div id="root" className="min-h-screen">
            {children}
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
