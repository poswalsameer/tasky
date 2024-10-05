import type { Metadata } from "next";
import "./globals.css";
import Providers from "./utils/Provider";
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: "300",
  style: "normal",
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Trackr - Run your day your way",
  description: "Trackr - Run your day your way",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        className={`${poppins.className} antialiased`} 
      >
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  );
}
