import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { StackAuthProvider } from "@/components/StackAuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rio Porto P2P - Compra e Venda de Bitcoin",
  description: "Plataforma P2P para compra e venda de Bitcoin com segurança e praticidade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <StackAuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </StackAuthProvider>
      </body>
    </html>
  );
}
