import '@shopify/polaris/build/esm/styles.css';
import './globals.css';
import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import Script from 'next/script';
import {AppShell} from '@/components/AppShell';
import {Providers} from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Perfect Plants SKU',
  description: 'Shopify growth storefront and post-purchase revenue engine for bundle offers.',
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">
      <head>
        <meta name="shopify-api-key" content={process.env.NEXT_PUBLIC_SHOPIFY_API_KEY ?? ''} />
      </head>
      <body className={inter.className}>
        <Script src="https://cdn.shopify.com/shopifycloud/app-bridge.js" strategy="beforeInteractive" />
        <Script src="https://cdn.shopify.com/shopifycloud/polaris.js" strategy="beforeInteractive" />
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
