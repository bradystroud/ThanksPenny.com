import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";

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
        <main className="h-screen flex flex-col">
          <div className="flex justify-end p-4">
            <a
              href="https://github.com/bradystroud/ThanksPenny.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              Contribute
            </a>
          </div>
          {children}
        </main>
        <footer className="flex justify-between items-center p-6 bg-gray-100 border-t-2 border-purple-200 w-full">
          <div>
            Made with ❤️ by{" "}
            <a
              href="https://bradystroud.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-75"
            >
              Brady Stroud
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
