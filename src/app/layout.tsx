import type { Metadata } from 'next';
import './globals.css';
import AppAuthProvider from '@/components/AuthProvider'; // Use existing AuthProvider.js

export const metadata: Metadata = {
  title: 'Enneagram Academy',
  description: 'Discover your Enneagram type and unlock personal growth',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/bex0qbf.css" />
      </head>
      <body>
        {/* Wrapping entire app with Auth Provider to enable Cognito authentication */}
        <AppAuthProvider>
          {children}
        </AppAuthProvider>
      </body>
    </html>
  );
}
