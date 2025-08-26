import { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head />
      <body className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 antialiased">
        <div className="min-h-screen flex items-center justify-center">
          {children}
        </div>
      </body>
    </html>
  );
}
