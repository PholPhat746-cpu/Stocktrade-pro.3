import './globals.css';

export const metadata = {
  title: 'StockTrade Pro',
  description: 'Advanced Trading & Journalytix Partner',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className="bg-neutral-950 text-neutral-100 min-h-screen">
        {children}
      </body>
    </html>
  )
}

