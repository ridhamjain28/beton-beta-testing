import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Light Studio · Preview Room Lighting in 3D',
  description:
    'Try different ceiling light color temperatures and brightness in a real-time 3D living room with physical lighting, reflections and shadows.',
  icons: {
    icon: '/light-simulation-992x/icon.svg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-neutral-950">
      <head>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
        <meta name="referrer" content="no-referrer" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
