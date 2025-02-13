import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Enneagram Academy',
  description: 'Discover your Enneagram type and unlock personal growth',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/bex0qbf.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}