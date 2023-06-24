import { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/layout/sidebar";
import { RSidebar } from "@/components/layout/r-sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bearit",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "hsl(240 10% 3.9%)",
          colorText: "hsl(0 0% 98%)",
          colorInputText: "hsl(0 0% 98%)",
        },
        elements: {
          footerActionLink: {
            color: "hsl(0 0% 98%)",
          },
        },
      }}
    >
      <html lang="en" className="dark">
        <body className={inter.className}>
          <Sidebar />
          <div className="mx-sidebar">{children}</div>
          <RSidebar />
        </body>
      </html>
    </ClerkProvider>
  );
}
