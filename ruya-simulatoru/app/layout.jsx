import  { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import React from "react";
  
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Rüya Simülatörü",
  description: "Kendi rüyanı tasarla veya rastgele bir rüya deneyimi yaşa",
};

export default function RootLayout({children}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900">
          {children}
        </main>
      </body>
    </html>
  );
} 