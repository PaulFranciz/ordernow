import '@/app/globals.css';  // Use absolute import path
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Order Now',
  description: 'Food delivery and more',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="marketing-layout">
          {children}
        </div>
      </body>
    </html>
  );
}