import { Check, X, AlertCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Customization Limits | Genix',
  description: 'Understand what you can and cannot customize in Genix templates',
}

export default function CustomizationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Customization Limits</h1>
          <p className="text-xl text-gray-600 mb-12">
            Clear boundaries on what you can customize yourself vs. what requires the developer.
          </p>

          <div className="bg-white rounded-xl border-2 border-gray-200 p-8 lg:p-12 space-y-12">
            {/* What You Can Customize */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Check className="text-green-600" size={24} />
                </div>
                <h2 className="text-3xl font-bold">What You Can Customize</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4">✓ Safe to Change</h3>
                  <p className="text-gray-600 mb-4">
                    These changes won't break your template and can be done without coding knowledge:
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Text Content</h4>
                      <ul className="text-sm text-gray-600 space-y-1 ml-4">
                        <li>• Headlines and subheadlines</li>
                        <li>• Body copy and descriptions</li>
                        <li>• Button text</li>
                        <li>• Menu labels</li>
                        <li>• Footer content</li>
                        <li>• Meta descriptions</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Visual Elements</h4>
                      <ul className="text-sm text-gray-600 space-y-1 ml-4">
                        <li>• Colors (brand colors, backgrounds)</li>
                        <li>• Fonts (typography)</li>
                        <li>• Images and logos</li>
                        <li>• Icons</li>
                        <li>• Spacing (margins, padding)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Layout</h4>
                      <ul className="text-sm text-gray-600 space-y-1 ml-4">
                        <li>• Toggle sections on/off</li>
                        <li>• Reorder sections</li>
                        <li>• Show/hide navigation items</li>
                        <li>• Enable/disable features</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Configuration</h4>
                      <ul className="text-sm text-gray-600 space-y-1 ml-4">
                        <li>• Environment variables (API keys, database URLs)</li>
                        <li>• Basic settings</li>
                        <li>• Email templates text</li>
                        <li>• Domain and hosting</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-sm text-blue-900">
                    <strong>Good news:</strong> Most templates include detailed documentation showing 
                    you exactly which files to edit for common customizations. No coding experience 
                    needed for these changes!
                  </p>
                </div>
              </div>
            </section>

            {/* What Requires Developer Help */}
            <section className="pt-8 border-t">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="text-orange-600" size={24} />
                </div>
                <h2 className="text-3xl font-bold">What Requires Developer Help</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-orange-50 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4">⚠️ Complex Changes</h3>
                  <p className="text-gray-600 mb-4">
                    These modifications require coding knowledge or help from the original developer:
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Business Logic</h4>
                      <ul className="text-sm text-gray-600 space-y-1 ml-4">
                        <li>• Changing authentication flows</li>
                        <li>• Modifying payment processing logic</li>
                        <li>• Altering database schemas</li>
                        <li>• Custom API integrations</li>
                        <li>• New feature development</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Architecture</h4>
                      <ul className="text-sm text-gray-600 space-y-1 ml-4">
                        <li>• Switching databases (e.g., Supabase to MongoDB)</li>
                        <li>• Changing authentication providers</li>
                        <li>• Adding new backend services</li>
                        <li>• Restructuring components</li>
                        <li>• Migration to different framework</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Advanced Features</h4>
                      <ul className="text-sm text-gray-600 space-y-1 ml-4">
                        <li>• Real-time functionality (WebSockets)</li>
                        <li>• Complex data transformations</li>
                        <li>• Advanced search features</li>
                        <li>• Multi-tenancy</li>
                        <li>• Custom admin panels</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                  <p className="text-sm text-primary-900">
                    <strong>Solution:</strong> Every template on Genix includes the developer's 
                    contact info. You can book consulting sessions directly with them for these 
                    changes. Most developers charge $100-200/hour.
                  </p>
                </div>
              </div>
            </section>

            {/* What You Cannot Do */}
            <section className="pt-8 border-t">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <X className="text-red-600" size={24} />
                </div>
                <h2 className="text-3xl font-bold">What You Cannot Do</h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600">
                  To protect developers and maintain quality, there are restrictions:
                </p>

                <div className="bg-red-50 rounded-lg p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <X className="text-red-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <strong className="block">Resell or redistribute the template</strong>
                        <span className="text-sm text-gray-600">
                          You can't sell the template itself to others, even if modified.
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="text-red-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <strong className="block">Remove developer attribution</strong>
                        <span className="text-sm text-gray-600">
                          The MIT license file must remain in your codebase.
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="text-red-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <strong className="block">Use for illegal purposes</strong>
                        <span className="text-sm text-gray-600">
                          Templates cannot be used for illegal activities or content.
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 mt-4">
                  <p className="text-sm text-blue-900">
                    <strong>You CAN:</strong> Build unlimited client projects, create SaaS products, 
                    and use templates commercially. You just can't resell the template itself.
                  </p>
                </div>
              </div>
            </section>

            {/* How to Get Help */}
            <section className="pt-8 border-t">
              <h2 className="text-3xl font-bold mb-6">How to Get Customization Help</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-2xl mb-2">📚</div>
                  <h3 className="font-semibold mb-2">Documentation</h3>
                  <p className="text-sm text-gray-600">
                    Every template includes detailed docs for common customizations.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-2xl mb-2">💬</div>
                  <h3 className="font-semibold mb-2">Developer Support</h3>
                  <p className="text-sm text-gray-600">
                    30 days of basic support included. Ask questions via email or support tickets.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-2xl mb-2">🎯</div>
                  <h3 className="font-semibold mb-2">Consulting</h3>
                  <p className="text-sm text-gray-600">
                    Book the developer for custom features and complex changes.
                  </p>
                </div>
              </div>
            </section>

            {/* Examples */}
            <section className="pt-8 border-t">
              <h2 className="text-3xl font-bold mb-6">Real Examples</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-2">✓ Easy: Changing Brand Colors</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Edit <code className="bg-white px-2 py-1 rounded">tailwind.config.js</code> to 
                    update your primary and accent colors. Takes 2 minutes.
                  </p>
                  <div className="bg-white rounded p-3 text-xs font-mono">
                    colors: &#123;<br/>
                    &nbsp;&nbsp;primary: '#0066FF',<br/>
                    &nbsp;&nbsp;accent: '#FF6B00'<br/>
                    &#125;
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-2">⚠️ Medium: Adding a New Page</h3>
                  <p className="text-sm text-gray-600">
                    Create a new file in the pages directory and link to it. Requires basic Next.js 
                    knowledge. Documentation shows you how. 15-30 minutes.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-2">✗ Complex: Switching from Stripe to PayPal</h3>
                  <p className="text-sm text-gray-600">
                    Requires rewriting payment logic, updating database schemas, and modifying 
                    webhooks. Book the developer for this (estimated 4-8 hours).
                  </p>
                </div>
              </div>
            </section>

            {/* Questions */}
            <section className="pt-8 border-t">
              <h2 className="text-3xl font-bold mb-6">Common Questions</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">What if I break something while customizing?</h3>
                  <p className="text-sm text-gray-600">
                    You can always re-download the original files from your purchase. We recommend 
                    using git version control before making changes.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Can I hire a different developer to customize?</h3>
                  <p className="text-sm text-gray-600">
                    Yes! You own the code. You can hire anyone. But the original developer knows the 
                    codebase best.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Are there video tutorials?</h3>
                  <p className="text-sm text-gray-600">
                    Many templates include video walkthroughs. Check the template's documentation 
                    section.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">What if customization takes longer than 30 days?</h3>
                  <p className="text-sm text-gray-600">
                    The 30-day support period starts from purchase. For ongoing projects, book 
                    consulting sessions with the developer.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}