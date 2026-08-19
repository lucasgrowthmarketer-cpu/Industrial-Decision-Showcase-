import type { Metadata } from "next";
import "@/styles/globals.css";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
