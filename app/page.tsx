import { Hero } from '@/components/home/Hero'
import { HowItWorks } from '@/components/home/HowItWorks'
import { WhyNotAI } from '@/components/home/WhyNotAI'
import { ForDevelopers } from '@/components/home/ForDevelopers'
import { ForFounders } from '@/components/home/ForFounders'
import { TrustStrip } from '@/components/home/TrustStrip'
import { CTA } from '@/components/home/CTA'

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <WhyNotAI />
      <div className="bg-gray-50">
        <ForFounders />
        <ForDevelopers />
      </div>
      <CTA />
    </>
  )
}
