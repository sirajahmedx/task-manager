import "./globals.css";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskBoard - Minimalist Task Management",
  description: "A clean and professional Kanban board for managing your tasks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          <div>{children}</div>
        </body>
      </html>
    </SessionProvider>
  );
}
