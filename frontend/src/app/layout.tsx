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
        <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IU</span>
                </div>
                <h1 className="text-xl font-bold text-slate-900">IIIT-Una Feed</h1>
              </div>
              <div className="text-sm text-slate-600">
                Campus Updates & Discussions
              </div>
            </div>
          </div>
        </header>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-white border-t border-slate-200 py-8 mt-12">
          <div className="max-w-4xl mx-auto px-4 text-center text-slate-600">
            <p>&copy; 2024 IIIT-Una Feed. Built for the campus community.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
