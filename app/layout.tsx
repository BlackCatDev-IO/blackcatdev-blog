import type { Metadata } from 'next';
import { Sen } from 'next/font/google';
import './globals.css';

const sen = Sen({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'blackcatdev-blog',
  description: 'Blog for blackcatdev.io',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={sen.className}>
        <nav>
          <a href="https://blackcatdev.io">blackcatdev.io</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
