import { Eye, Code, Shield, Zap } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How Previews Work | Genix',
  description: 'Technical explanation of how Genix generates template previews safely',
}

export default function HowPreviewsWorkPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">How Previews Work</h1>
          <p className="text-xl text-gray-600 mb-12">
            We generate visual previews without executing your code. Here's the technical explanation.
          </p>

          <div className="bg-white rounded-xl border-2 border-gray-200 p-8 lg:p-12 space-y-12">
            {/* Overview */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="text-blue-600" size={24} />
                </div>
                <h2 className="text-3xl font-bold">What You See</h2>
              </div>
              
              <div className="space-y-4 text-gray-600">
                <p className="text-lg">
                  When you preview a template on Genix, you see an <strong>Interactive Preview</strong> 
                  that shows the structure, layout, and visual design of the template.
                </p>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-3">Preview Includes:</h3>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Page structure and sections</li>
                    <li>✓ Component layout and positioning</li>
                    <li>✓ Typography and styling</li>
                    <li>✓ Color schemes</li>
                    <li>✓ Static content and images</li>
                    <li>✓ UI elements and components</li>
                  </ul>
                </div>

                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-3">Preview Does NOT Include:</h3>
                  <ul className="space-y-2 text-sm">
                    <li>✗ Live backend functionality</li>
                    <li>✗ Database connections</li>
                    <li>✗ API calls</li>
                    <li>✗ Authentication flows</li>
                    <li>✗ Payment processing</li>
                    <li>✗ Server-side logic</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How It Works */}
            <section className="pt-8 border-t">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Code className="text-purple-600" size={24} />
                </div>
                <h2 className="text-3xl font-bold">Technical Process</h2>
              </div>
              
              <div className="space-y-6 text-gray-600">
                <p className="text-lg">
                  Here's exactly how we generate previews without running your code:
                </p>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Static Analysis</h3>
                        <p className="text-sm">
                          We read your code files (JSX/TSX) as text and parse the structure using 
                          AST (Abstract Syntax Tree) analysis. No code execution happens.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Pattern Recognition</h3>
                        <p className="text-sm">
                          We identify common patterns: headers, hero sections, feature grids, 
                          pricing tables, forms, etc. Our scanner recognizes React/Next.js components.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Content Extraction</h3>
                        <p className="text-sm">
                          We extract text content, image URLs, and styling information. Think of it 
                          like reading a blueprint, not running the building.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                        4
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Visual Reconstruction</h3>
                        <p className="text-sm">
                          We rebuild a visual representation using the extracted structure and content. 
                          This is rendered in an isolated sandbox environment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Security */}
            <section className="pt-8 border-t">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="text-green-600" size={24} />
                </div>
                <h2 className="text-3xl font-bold">Security Measures</h2>
              </div>
              
              <div className="space-y-4 text-gray-600">
                <p className="text-lg">
                  We take multiple precautions to ensure your code remains secure:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="font-semibold mb-3">✓ No Code Execution</h3>
                    <p className="text-sm">
                      We never run npm install, npm build, or any of your scripts. Your code is 
                      read-only to us.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="font-semibold mb-3">✓ No Environment Access</h3>
                    <p className="text-sm">
                      We don't read your .env files or access environment variables. Your API keys 
                      and secrets stay private.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="font-semibold mb-3">✓ No Backend Calls</h3>
                    <p className="text-sm">
                      We don't trigger API calls, database connections, or any external services. 
                      Your infrastructure is never touched.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="font-semibold mb-3">✓ Isolated Scanning</h3>
                    <p className="text-sm">
                      Each template is scanned in isolation. No cross-contamination between 
                      different developers' code.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* What We Extract */}
            <section className="pt-8 border-t">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Zap className="text-orange-600" size={24} />
                </div>
                <h2 className="text-3xl font-bold">What We Extract</h2>
              </div>
              
              <div className="space-y-4 text-gray-600">
                <p className="text-lg">
                  Here's a detailed breakdown of what information we extract:
                </p>
                
                <div className="space-y-3 mt-4">
                  <details className="bg-gray-50 rounded-lg p-4">
                    <summary className="font-semibold cursor-pointer">From JSX/TSX Files</summary>
                    <ul className="mt-3 space-y-1 text-sm ml-4">
                      <li>• Component names and structure</li>
                      <li>• Text content (headings, paragraphs, buttons)</li>
                      <li>• Image source URLs</li>
                      <li>• className attributes for styling</li>
                      <li>• Component hierarchy</li>
                    </ul>
                  </details>

                  <details className="bg-gray-50 rounded-lg p-4">
                    <summary className="font-semibold cursor-pointer">From CSS/Tailwind</summary>
                    <ul className="mt-3 space-y-1 text-sm ml-4">
                      <li>• Color values</li>
                      <li>• Font families and sizes</li>
                      <li>• Spacing and layout properties</li>
                      <li>• Responsive breakpoints</li>
                    </ul>
                  </details>

                  <details className="bg-gray-50 rounded-lg p-4">
                    <summary className="font-semibold cursor-pointer">From Package.json</summary>
                    <ul className="mt-3 space-y-1 text-sm ml-4">
                      <li>• Dependencies (for tech stack display)</li>
                      <li>• Framework version</li>
                      <li>• Scripts (for documentation purposes)</li>
                    </ul>
                  </details>

                  <details className="bg-gray-50 rounded-lg p-4">
                    <summary className="font-semibold cursor-pointer">From README</summary>
                    <ul className="mt-3 space-y-1 text-sm ml-4">
                      <li>• Setup instructions</li>
                      <li>• Feature descriptions</li>
                      <li>• Deployment guides</li>
                    </ul>
                  </details>
                </div>

                <div className="bg-red-50 rounded-lg p-6 mt-6">
                  <h3 className="font-semibold mb-3">What We NEVER Extract:</h3>
                  <ul className="space-y-2 text-sm">
                    <li>✗ Environment variables or secrets</li>
                    <li>✗ API keys or credentials</li>
                    <li>✗ Database schemas or data</li>
                    <li>✗ Business logic implementation</li>
                    <li>✗ Private algorithm details</li>
                    <li>✗ .env files or sensitive configs</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Limitations */}
            <section className="pt-8 border-t">
              <h2 className="text-3xl font-bold mb-6">Known Limitations</h2>
              
              <div className="space-y-4 text-gray-600">
                <p className="text-lg">
                  To be transparent, here's what our preview system can't show:
                </p>
                
                <ul className="space-y-3 ml-6 mt-4">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0">•</span>
                    <span><strong>Dynamic Content:</strong> Data fetched from APIs won't appear in previews. 
                    We'll show the layout with placeholder content.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0">•</span>
                    <span><strong>Interactive Features:</strong> Forms won't submit, buttons won't trigger 
                    backend actions. The visual structure is there, but not the functionality.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0">•</span>
                    <span><strong>Server-Side Rendering:</strong> If your template relies heavily on SSR, 
                    the preview might not capture all dynamic aspects.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0">•</span>
                    <span><strong>Complex Animations:</strong> Some advanced animations or 3D effects might 
                    not render in the preview.</span>
                  </li>
                </ul>

                <p className="text-sm mt-4 bg-blue-50 rounded-lg p-4">
                  <strong>Solution:</strong> Every template includes a live demo URL where you can see 
                  the fully-functional version with all features working.
                </p>
              </div>
            </section>

            {/* Open Source */}
            <section className="pt-8 border-t">
              <h2 className="text-3xl font-bold mb-6">Scanner Technology</h2>
              
              <div className="space-y-4 text-gray-600">
                <p className="text-lg">
                  Our preview scanner is built with open-source tools:
                </p>
                
                <ul className="space-y-2 ml-6">
                  <li>• <strong>Babel Parser:</strong> For AST analysis of JavaScript/TypeScript</li>
                  <li>• <strong>PostCSS:</strong> For CSS parsing</li>
                  <li>• <strong>React DOM Server:</strong> For component structure analysis</li>
                  <li>• <strong>Cheerio:</strong> For HTML parsing</li>
                </ul>

                <p className="text-sm mt-4">
                  We're working on open-sourcing our scanner. Follow our progress on GitHub.
                </p>
              </div>
            </section>

            {/* Questions */}
            <section className="pt-8 border-t">
              <h2 className="text-3xl font-bold mb-6">Common Questions</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Can you see my .env files?</h3>
                  <p className="text-sm">
                    No. We never access environment files or any credentials.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Will my API endpoints be called?</h3>
                  <p className="text-sm">
                    No. We only read code structure. No code execution means no API calls.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">What if my template has complex logic?</h3>
                  <p className="text-sm">
                    The preview shows the visual structure. Buyers can test full functionality on 
                    your live demo URL.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Can I opt out of preview generation?</h3>
                  <p className="text-sm">
                    Yes, but we recommend keeping it. Previews significantly increase sales. Contact 
                    support if you have concerns.
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