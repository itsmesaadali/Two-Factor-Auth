import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../context/theme-provider";
import QueryProvider from "../context/query-provider";
import { Toaster } from "sonner"; // Import Toaster

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MERN-2FA Web App",
  description: "Created by Saad ali Jutt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`bg-background ${geistMono.variable} antialiased`}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Toaster 
              position="top-center"
              richColors
              closeButton
              toastOptions={{
                style: { zIndex: 100000 },
                className: 'toast',
              }}
            />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}