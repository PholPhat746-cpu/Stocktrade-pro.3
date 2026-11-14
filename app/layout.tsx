import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Stocktrade Pro',
  description: 'แพลตฟอร์มซื้อขายและติดตามข้อมูลการลงทุน',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>
        {children}

        {/* CJ Affiliate Impression Tracking */}
        <Script
          src="https://www.anrdoezrs.net/am/101927027/impressions/page/am.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
