import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "REKr Forum",
  description: "Generated by create rekr forum",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <Providers session={session}>
          <Navbar></Navbar>
          {children}
          <Footer></Footer>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
