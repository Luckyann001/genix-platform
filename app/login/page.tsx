import type { Metadata } from 'next'
import LoginClient from './LoginClient'

export const metadata: Metadata = {
  title: 'Sign In | Genix',
  description: 'Sign in to Genix',
}

export default function LoginPage() {
  return <LoginClient />
}