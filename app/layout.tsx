import type { Metadata } from 'next';
import { Sen } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

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
      <Script
        src="https://umami.blackcatdev.io/script.js"
        data-website-id="a6ab87ec-ee22-4074-979a-cdca48d20821"
      />
    </html>
  );
}
