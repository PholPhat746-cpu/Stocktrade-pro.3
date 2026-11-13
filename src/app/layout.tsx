import { Analytics } from '@vercel/analytics/react';
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
