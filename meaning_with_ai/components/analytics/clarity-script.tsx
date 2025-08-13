"use client"

import { useEffect } from "react"
import Script from "next/script"

declare global {
  interface Window {
    clarity: (action: string, ...args: any[]) => void
  }
}

export function ClarityScript() {
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

  useEffect(() => {
    // Initialize Clarity when component mounts
    if (typeof window !== "undefined" && clarityProjectId) {
      // Clarity will be loaded by the Script component
      console.log("Microsoft Clarity initialized with project ID:", clarityProjectId)
    }
  }, [clarityProjectId])

  // Don't load in development unless explicitly enabled
  if (process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_ENABLE_CLARITY_DEV) {
    return null
  }

  if (!clarityProjectId) {
    console.warn(
      "Microsoft Clarity Project ID not found. Please add NEXT_PUBLIC_CLARITY_PROJECT_ID to your environment variables.",
    )
    return null
  }

  return (
    <>
      <Script
        id="microsoft-clarity-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityProjectId}");
          `,
        }}
      />
    </>
  )
}
