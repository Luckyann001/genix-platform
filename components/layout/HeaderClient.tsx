'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

type HeaderClientProps = {
  showAdmin: boolean
  showDeveloperDashboard: boolean
}

export function HeaderClient({ showAdmin, showDeveloperDashboard }: HeaderClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform">
              G
            </div>
            <span className="text-2xl font-display font-bold">Genix</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <Link href="/templates" className="text-gray-700 hover:text-primary-600 transition-colors">
              Browse Templates
            </Link>
            <Link href="/for-developers" className="text-gray-700 hover:text-primary-600 transition-colors">
              For Developers
            </Link>
            {showDeveloperDashboard && (
              <Link href="/developer" className="text-gray-700 hover:text-primary-600 transition-colors">
                Developer Dashboard
              </Link>
            )}
            <Link href="/how-it-works" className="text-gray-700 hover:text-primary-600 transition-colors">
              How It Works
            </Link>
            <Link href="/trust" className="text-gray-700 hover:text-primary-600 transition-colors">
              Trust & Safety
            </Link>
            {showAdmin && (
              <Link href="/admin" className="text-gray-700 hover:text-primary-600 transition-colors">
                Admin
              </Link>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login" className="btn btn-ghost">
              Sign In
            </Link>
            <Link href="/templates" className="btn btn-primary">
              Browse Templates
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link href="/templates" className="text-gray-700 hover:text-primary-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                Browse Templates
              </Link>
              <Link
                href="/for-developers"
                className="text-gray-700 hover:text-primary-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                For Developers
              </Link>
              {showDeveloperDashboard && (
                <Link href="/developer" className="text-gray-700 hover:text-primary-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                  Developer Dashboard
                </Link>
              )}
              <Link href="/how-it-works" className="text-gray-700 hover:text-primary-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </Link>
              <Link href="/trust" className="text-gray-700 hover:text-primary-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                Trust & Safety
              </Link>
              {showAdmin && (
                <Link href="/admin" className="text-gray-700 hover:text-primary-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                  Admin
                </Link>
              )}
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                <Link href="/login" className="btn btn-ghost w-full">
                  Sign In
                </Link>
                <Link href="/templates" className="btn btn-primary w-full">
                  Browse Templates
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
