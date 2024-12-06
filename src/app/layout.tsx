import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { NextAuthProvider } from "./provider";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
export const metadata: Metadata = {
  title: "My Bookshelf",
  description: "My Bookshelf",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <NextAuthProvider>
          <TRPCReactProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarTrigger />
              <main className="p-10">
                <ToastContainer />
                {children}
              </main>
            </SidebarProvider>
          </TRPCReactProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
