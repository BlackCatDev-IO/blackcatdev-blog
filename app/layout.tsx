import type { Metadata } from 'next';
import { Sen } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import Image from 'next/image';

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
        <div className="social-icons">
          <a
            href="https://www.linkedin.com/in/loren-aguey-51827947/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/linkedin-black-on-white.png"
              alt="LinkedIn"
              width={24}
              height={24}
            />
          </a>
          <a
            href="https://github.com/BlackCatDev-IO"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/github-black-on-white.png"
              alt="GitHub"
              width={24}
              height={24}
            />
          </a>
          <a
            href="https://medium.com/@loren.aguey"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/medium-black-on-white.png"
              alt="Medium"
              width={24}
              height={24}
            />
          </a>
        </div>
        {children}
      </body>
      <Script
        src="https://umami.blackcatdev.io/script.js"
        data-website-id="a6ab87ec-ee22-4074-979a-cdca48d20821"
      />
    </html>
  );
}
