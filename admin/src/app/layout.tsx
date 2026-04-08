import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/redux/provider";

export const metadata: Metadata = {
  title: "Task Flow — Admin Dashboard",
  description: "Task Management System Admin Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
