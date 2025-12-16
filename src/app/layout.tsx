import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "../lib/cart-context";
import Link from "next/link";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Diamante Collections",
  description: "Shop the Diamante Collections",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* GA4 */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-5Q1ZF0LE33" />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5Q1ZF0LE33');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>
          <header className="p-4 bg-indigo-600 text-white">
            <div className="max-w-4xl mx-auto flex justify-between">
              <a href="/" className="font-bold">Diamante Collections</a>
              <nav className="flex gap-4">
                <Link href="/products">Products</Link>
                <Link href="/cart">Cart</Link>
                <Link href="/orders">Orders</Link>
                <Link href="/auth">Account</Link>
              </nav>
            </div>
          </header>
          <main className="max-w-4xl mx-auto mt-6">{children}</main>
        </CartProvider>
        <Script src="/diad-chat-widget.js" strategy="afterInteractive" data-api-base="https://diad-external-chat-38640153199.asia-southeast1.run.app"/>
      </body>
    </html>
  );
}
