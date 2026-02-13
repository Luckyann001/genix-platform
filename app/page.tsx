import { Hero } from '@/components/home/Hero'
import { HowItWorks } from '@/components/home/HowItWorks'
import { ForDevelopers } from '@/components/home/ForDevelopers'
import { ForFounders } from '@/components/home/ForFounders'
import { TrustStrip } from '@/components/home/TrustStrip'
import { CTA } from '@/components/home/CTA'
import { ValueProposition } from '@/components/home/ValueProposition'

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ValueProposition />
      <HowItWorks />
      <div className="bg-gray-50">
        <ForFounders />
        <ForDevelopers />
      </div>
      <CTA />
    </>
  )
}
