import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Genix - Production-Ready Websites by Real Developers',
  description: 'Buy production-ready websites built by professional developers. Preview, customize, and launch without gambling on AI or freelancers.',
  keywords: ['website templates', 'nextjs templates', 'developer marketplace', 'production websites'],
  authors: [{ name: 'Genix' }],
  icons: {
    icon: '/brand/genix-logo-mark.svg',
    shortcut: '/brand/genix-logo-mark.svg',
    apple: '/brand/genix-logo-mark.svg',
  },
  openGraph: {
    title: 'Genix - Production-Ready Websites by Real Developers',
    description: 'Buy production-ready websites built by professional developers.',
    type: 'website',
    images: ['/brand/genix-logo-full.svg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
