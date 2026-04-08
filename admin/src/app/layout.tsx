import type { Metadata } from "next";
import "./globals.css";

import ThemeProviders from "./providers";
import Providers from "@/redux/provider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Sera-gari Admin",
  description: "Admin dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <ThemeProviders>
            {children}
            <Toaster position="top-right" reverseOrder={false} />
          </ThemeProviders>
        </Providers>
      </body>
    </html>
  );
}
