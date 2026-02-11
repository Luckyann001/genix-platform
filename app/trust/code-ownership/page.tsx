import { CheckCircle, Code, Lock, FileText } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Code Ownership | Genix',
  description: 'Understand how Genix protects your code ownership rights',
}

export default function CodeOwnershipPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Code Ownership</h1>
          <p className="text-xl text-gray-600 mb-12">
            Your code is yours. Period. Here's exactly how we protect your ownership rights.
          </p>

          <div className="bg-white rounded-xl border-2 border-gray-200 p-8 lg:p-12 space-y-12">
            {/* What You Own */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <h2 className="text-3xl font-bold">What You Own</h2>
              </div>
              
              <div className="space-y-4 text-gray-600">
                <p className="text-lg">
                  When you purchase a template on Genix, you receive <strong>full ownership</strong> of the code. 
                  This means:
                </p>
                
                <ul className="space-y-3 ml-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <span>You can use the code in any personal or commercial project</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <span>You can modify, customize, and adapt the code however you want</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <span>You can deploy it to any hosting provider or server</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <span>You can integrate it with your existing systems</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <span>You retain all intellectual property rights to your modifications</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* License */}
            <section className="pt-8 border-t">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="text-blue-600" size={24} />
                </div>
                <h2 className="text-3xl font-bold">MIT License</h2>
              </div>
              
              <div className="space-y-4 text-gray-600">
                <p className="text-lg">
                  All templates on Genix are licensed under the <strong>MIT License</strong>, one of the 
                  most permissive open-source licenses available.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-3">What the MIT License Means:</h3>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Use commercially without restrictions</li>
                    <li>✓ Modify the code freely</li>
                    <li>✓ Distribute your modified versions</li>
                    <li>✓ Sublicense under your own terms</li>
                    <li>✓ Private use is completely allowed</li>
                  </ul>
                </div>

                <p className="text-sm">
                  The only requirement is that you include the original license notice in your code. 
                  That's it. No attribution needed in your UI, no royalties, no restrictions.
                </p>
              </div>
            </section>

            {/* What You Cannot Do */}
            <section className="pt-8 border-t">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Lock className="text-red-600" size={24} />
                </div>
                <h2 className="text-3xl font-bold">Restrictions</h2>
              </div>
              
              <div className="space-y-4 text-gray-600">
                <p className="text-lg">
                  To protect both developers and buyers, there are a few restrictions:
                </p>
                
                <ul className="space-y-3 ml-6">
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 flex-shrink-0 mt-1">✗</span>
                    <span><strong>You cannot resell the template as-is.</strong> You purchased it for your 
                    own use, not to compete with the original developer.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 flex-shrink-0 mt-1">✗</span>
                    <span><strong>You cannot claim the original work as your own.</strong> The developer 
                    retains authorship credit.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 flex-shrink-0 mt-1">✗</span>
                    <span><strong>You cannot redistribute it on other template marketplaces.</strong> 
                    This protects the developer's income.</span>
                  </li>
                </ul>

                <div className="bg-blue-50 rounded-lg p-6 mt-6">
                  <p className="text-sm">
                    <strong>Note:</strong> You CAN build client projects with the template and charge 
                    your clients. You CAN create SaaS products using the template. You CAN sell products 
                    built with the template. You just can't sell the template itself.
                  </p>
                </div>
              </div>
            </section>

            {/* Developer Rights */}
            <section className="pt-8 border-t">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Code className="text-purple-600" size={24} />
                </div>
                <h2 className="text-3xl font-bold">Developer Rights</h2>
              </div>
              
              <div className="space-y-4 text-gray-600">
                <p className="text-lg">
                  Developers who list templates on Genix retain <strong>full ownership</strong> of their work:
                </p>
                
                <ul className="space-y-3 ml-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <span>Code stays in the developer's GitHub repository</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <span>Developers can list the same template on other platforms</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <span>Developers can remove listings at any time (existing sales honored)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <span>Genix never claims ownership or exclusive rights</span>
                  </li>
                </ul>

                <p className="text-sm mt-4">
                  We're a marketplace, not a rights-holder. Your code is yours before, during, and 
                  after listing on Genix.
                </p>
              </div>
            </section>

            {/* Security */}
            <section className="pt-8 border-t">
              <h2 className="text-3xl font-bold mb-6">Code Security</h2>
              
              <div className="space-y-4 text-gray-600">
                <p className="text-lg">
                  We take code security seriously:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Before Purchase</h3>
                    <p className="text-sm">
                      Code remains private in the developer's repository. We only read structure 
                      for previews. No code is exposed publicly.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">After Purchase</h3>
                    <p className="text-sm">
                      Buyer receives direct GitHub access or a secure download link. No code is 
                      stored on our servers permanently.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Questions */}
            <section className="pt-8 border-t">
              <h2 className="text-3xl font-bold mb-6">Common Questions</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Can I use a template for client work?</h3>
                  <p className="text-gray-600 text-sm">
                    Yes! You can build unlimited client projects. Just don't resell the template itself.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Can I build a SaaS product?</h3>
                  <p className="text-gray-600 text-sm">
                    Absolutely. That's what templates are for. Build and sell your product freely.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">What if I want to sell my modified version?</h3>
                  <p className="text-gray-600 text-sm">
                    If you've made substantial modifications and created a new product, contact us. 
                    We handle this case-by-case.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Can I open-source my project built with a template?</h3>
                  <p className="text-gray-600 text-sm">
                    Yes! The MIT license allows this. Just include the original license file.
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