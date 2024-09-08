import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "../../lib/utils";
import "../globals.css";
import SideBar from "@/components/bookmarks/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { connectNeo4j } from "@/lib/neo4j";
import BookMark from "@/types/bookmark";
import { BookMarksProvider } from "@/providers/bookmarks";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session, driver } = connectNeo4j();

  const res = await session.run(`MATCH (s:Site) RETURN s`);
  const allBookMarks = res.records.map(
    (r) => r.get(0).properties
  ) as BookMark[];

  await session.close();
  await driver.close();

  return (
    <html lang="en" className="w-full h-full">
      <body className={cn(inter.className, "bg-background w-full h-full")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <BookMarksProvider bookmarks={allBookMarks}>
            <main className="w-full relative h-full bg-background min-h-screen pl-4">
              <SideBar bookmarks={allBookMarks} />
              {children}
            </main>
          </BookMarksProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
