"use client"

import { Github } from 'lucide-react'

export default function LoginClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              G
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome to Genix</h1>
            <p className="text-gray-600">Choose how you'd like to sign in</p>
          </div>

          <div className="space-y-4">
            {/* Google Sign In (For Founders/Buyers) */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">👔 For Founders & Buyers</p>
              <button
                onClick={() => {
                  window.location.href = '/api/auth/google'
                }}
                className="w-full btn bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 py-4 text-lg flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* GitHub Sign In (For Developers) */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">👨‍💻 For Developers</p>
              <button
                onClick={() => {
                  window.location.href = '/api/auth/github'
                }}
                className="w-full btn bg-gray-900 hover:bg-gray-800 text-white py-4 text-lg flex items-center justify-center gap-3"
              >
                <Github size={24} />
                Continue with GitHub
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="mt-8 space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <span className="text-green-600 flex-shrink-0">✓</span>
              <span><strong>Founders:</strong> Use Google to buy and customize templates</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 flex-shrink-0">✓</span>
              <span><strong>Developers:</strong> Use GitHub to sell your templates</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-600 flex-shrink-0">✓</span>
              <span>No credit card required to browse templates</span>
            </div>
          </div>

          {/* Terms */}
          <p className="mt-6 text-xs text-center text-gray-500">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-primary-600 hover:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">New to Genix?</p>
          <div className="flex gap-4 justify-center">
            <a href="/how-it-works" className="text-sm text-primary-600 hover:underline">How It Works</a>
            <a href="/for-developers" className="text-sm text-primary-600 hover:underline">For Developers</a>
          </div>
        </div>
      </div>
    </div>
  )
}
