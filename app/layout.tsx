import type { Metadata } from "next";
import Script from "next/script";
import { Manrope, Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://experience.industrialdecision.com"),
  title: "Industrial Decision · Industrial Digital Experience",
  description:
    "Nous ne construisons pas des sites web. Nous construisons des systemes de decision. Experiences digitales 3D, data et acquisition pour PME et ETI industrielles.",
  alternates: { canonical: "/" },
  openGraph: {
    url: "https://experience.industrialdecision.com",
    siteName: "Industrial Decision",
    title: "Industrial Digital Experience · Industrial Decision",
    description: "Explorez une machine industrielle en 3D interactive : la demonstration vivante de ce que votre site pourrait etre.",
    type: "website",
    locale: "fr_FR",
  },
  robots: { index: true, follow: true },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// Execute AVANT le premier paint : masque le contenu SEO si l'experience 3D
// va se charger. C'est ce qui elimine le flash de texte brut au chargement.
const PREPAINT = `
try {
  var c = document.createElement('canvas');
  var gl = c.getContext('webgl2');
  var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (gl && !rm) document.documentElement.setAttribute('data-experience', '1');
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${manrope.variable} ${inter.variable} ${jetbrains.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREPAINT }} />
      </head>
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
