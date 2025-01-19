import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Enneacademy',
  description: 'Your journey of self-discovery through the Enneagram',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${montserrat.variable}`}>
      <head>
        <Script src="https://js.stripe.com/v3" strategy="beforeInteractive" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
}