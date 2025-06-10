import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ClientProviders from "@/components/providers/ClientProviders";
import { AuthProvider } from '@/contexts/AuthContext';
import "./globals.css";
import { SocketProvider } from "@/components/providers/SocketProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Double Bubble - Invest and Earn",
  description: "Invest effortlessly and earn high returns with ease",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        <AuthProvider>
          <ClientProviders>
            <SocketProvider>
              {children}
            </SocketProvider>
          </ClientProviders>
        </AuthProvider>
      </body>
    </html>
  );
}
