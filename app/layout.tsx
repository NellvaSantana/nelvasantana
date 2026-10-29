import type { Metadata } from "next";
import { Cormorant_Garamond, Great_Vibes, Lora, Manrope, Oswald } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { heroSocialLinks } from "@/data/content";
import { siteDescription, siteUrl } from "@/data/seo";
import "./globals.css";

const editorial = Lora({ subsets: ["latin"], weight: "400", style: "normal", variable: "--font-biography", display: "swap" });

const serif = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-serif", weight: ["400", "500", "600"], style: ["normal", "italic"], display: "swap" });
const script = Great_Vibes({ subsets: ["latin"], variable: "--font-script", weight: "400", display: "swap" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans", weight: ["400", "500", "600"], display: "swap" });
const condensed = Oswald({ subsets: ["latin"], variable: "--font-condensed", weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Nellva Sântana — Site Oficial", template: "%s | Nellva Sântana" },
  description: siteDescription,
  alternates: { canonical: siteUrl },
  openGraph: { type: "website", locale: "pt_BR", url: siteUrl, title: "Nellva Sântana — Site Oficial", description: "Raízes profundas. A mesma essência em cada canção.", siteName: "Nellva Sântana" },
  twitter: { card: "summary_large_image", title: "Nellva Sântana", description: "Raízes profundas. A mesma essência em cada canção." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}#artista`,
    name: "Nellva Sântana",
    url: siteUrl,
    description: siteDescription,
    jobTitle: "Cantora e intérprete brasileira",
    image: new URL("/images/nellva-hero.jpg", siteUrl).href,
    sameAs: heroSocialLinks.map(({ href }) => href),
  };
  return <html lang="pt-BR"><body className={`${serif.variable} ${script.variable} ${sans.variable} ${condensed.variable} ${editorial.variable}`}><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><Header /><main id="conteudo">{children}</main><Footer /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /></body></html>;
}
