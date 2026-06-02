import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { HistoryProvider } from '@/contexts/HistoryContext';

export const metadata: Metadata = {
  title: 'Plagiarism Checker - Free AI & Grammar Check',
  description: 'Free online plagiarism detection tool with AI writing detection and grammar analysis',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a1a2e" />
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <HistoryProvider>
              {children}
            </HistoryProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}