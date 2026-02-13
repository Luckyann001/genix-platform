import type { Metadata } from 'next'
import { Manrope, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const sansFont = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const displayFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Genix - Production-Ready Websites by Real Developers',
  description: 'Buy production-ready websites built by professional developers. Preview, customize, and launch without gambling on AI or freelancers.',
  keywords: ['website templates', 'nextjs templates', 'developer marketplace', 'production websites'],
  authors: [{ name: 'Genix' }],
  openGraph: {
    title: 'Genix - Production-Ready Websites by Real Developers',
    description: 'Buy production-ready websites built by professional developers.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${sansFont.variable} ${displayFont.variable}`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
