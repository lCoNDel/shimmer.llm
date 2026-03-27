import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Matching Satoshi brand look
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const outfit = Outfit({ subsets: ["latin"] });

import { db } from '@/lib/db';
import { settings } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function generateMetadata() {
  try {
    const systemName = await db.select().from(settings).where(eq(settings.key, 'system_name')).get();
    return {
      title: systemName?.value || "Touron CRM",
      description: "Gestión de productos náuticos y concesionarios",
    };
  } catch (e) {
    return { title: "Touron CRM" };
  }
}


import { cookies } from 'next/headers';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  const isLoggedIn = !!session;

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${outfit.className} bg-nautical-bg text-slate-900 flex`} suppressHydrationWarning>
        {isLoggedIn && <Sidebar />}
        <main className={`flex-1 transition-all duration-300 ${isLoggedIn ? 'ml-64 p-6' : 'p-0'} min-h-screen`}>
          {children}
        </main>
      </body>
    </html>
  );
}

