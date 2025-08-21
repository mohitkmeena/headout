import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IIIT-Una Feed",
  description: "Campus feed for events, lost & found, and announcements",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-slate-50 min-h-screen`}>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-white border-t border-slate-200 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-600">
            <p>&copy; 2024 IIIT-Una Feed. Built for the campus community.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
