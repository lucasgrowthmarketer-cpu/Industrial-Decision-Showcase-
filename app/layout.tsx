import type { Metadata } from "next";
import Script from "next/script";
import { Manrope, Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Industrial Decision · Industrial Digital Experience",
  description:
    "We don't build websites. We build decision systems. Experiences digitales 3D, data et acquisition pour PME et ETI industrielles.",
  openGraph: {
    title: "Industrial Decision · Industrial Digital Experience",
    description: "Transformez votre site industriel en outil d'aide a la decision.",
    type: "website",
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${manrope.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>
        {children}
        {GA_ID ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}</Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
