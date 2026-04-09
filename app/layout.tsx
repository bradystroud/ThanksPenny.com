import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { Heart } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Thank You, Penny Walker!",
  description: "A thank you card for our amazing SSW Brisbane Office Manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-purple-700 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
        >
          Skip to main content
        </a>
        <main id="main-content" className="flex-1 flex">{children}</main>
        <footer className="bg-purple-950/80 text-purple-200 py-4 px-6 flex justify-between items-center text-sm backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            Made with <Heart className="w-4 h-4 text-pink-400 fill-pink-400 inline" aria-hidden="true" /><span className="sr-only">love</span> by{" "}
            <a
              href="https://bradystroud.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-300 hover:text-white transition-colors underline underline-offset-2"
            >
              Brady Stroud
            </a>
          </div>
          <a
            href="https://github.com/bradystroud/ThanksPenny.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-300 hover:text-white transition-colors underline underline-offset-2"
          >
            Want to thank Penny? Contribute!
          </a>
        </footer>
      </body>
    </html>
  );
}
