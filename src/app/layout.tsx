import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/themeProvider";
import { Toaster } from "@/components/ui/sonner";
import { FormProvider } from "@/contexts/form-context";

// Adicionando a fonte Inter
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "flowtec",
  description: "Soluções contábeis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          > */}
      <FormProvider>
        <body className={`${inter.variable} antialiased`}>{children}</body>
      </FormProvider>
      <Toaster />
      {/* </ThemeProvider> */}
    </html>
  );
}
