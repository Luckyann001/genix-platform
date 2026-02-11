import { MessageSquare, RefreshCw, Shield, Clock } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Support & Refunds | Genix',
  description: 'Learn about our support policy and refund guarantee',
}

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Support & Refunds</h1>
          <p className="text-xl text-gray-600 mb-12">
            We're committed to your success. Here's how we support you and our refund policy.
          </p>

          <div className="bg-white rounded-xl border-2 border-gray-200 p-8 lg:p-12 space-y-12">
            {/* 30-Day Guarantee */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="text-green-600" size={24} />
                </div>
                <h2 className="text-3xl font-bold">30-Day Money-Back Guarantee</h2>
              </div>
              
              <div className="space-y-4 text-gray-600">
                <p className="text-lg">
                  We stand behind every template on Genix. If you're not satisfied, get a full 
                  refund within 30 days of purchase. <strong>No questions asked.</strong>
                </p>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-3">How It Works:</h3>
                  <ol className="space-y-2 text-sm">
                    <li>1. Email support@genix.so within 30 days of purchase</li>
                    <li>2. Include your order number and email address</li>
                    <li>3. We process your refund within 2 business days</li>
                    <li>4. Funds return to your original payment method within 5-10 business days</li>
                  </ol>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> While we hope you'll love the template, we understand 
                    sometimes it's not the right fit. We'll process your refund promptly and 
                    you'll lose access to the repository.
                  </p>
                </div>
              </div>
            </section>

            {/* Developer Support */}
            <section className="pt-8 border-t">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="text-blue-600" size={24} />
                </div>
                <h2 className="text-3xl font-bold">Developer Support</h2>
              </div>
              
              <div className="space-y-4 text-gray-600">
                <p className="text-lg">
                  Every template purchase includes <strong>30 days of direct developer support</strong>. 
                  Get help with:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold mb-3">✓ Covered (Free)</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Setup and installation questions</li>
                      <li>• Configuration help</li>
                      <li>• Bug reports and fixes</li>
                      <li>• Documentation clarification</li>
                      <li>• Deployment troubleshooting</li>
                      <li>• Environment variable setup</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold mb-3">✗ Not Covered (Consulting)</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Custom feature development</li>
                      <li>• Major architecture changes</li>
                      <li>• Integration with your systems</li>
                      <li>• Design customization</li>
                      <li>• Database schema modifications</li>
                      <li>• Advanced customization</li>
                    </ul>
                  </div>
                </div>

                <p className="text-sm bg-purple-50 rounded-lg p-4 mt-4">
                  For custom work beyond basic support, you can book paid consulting sessions 
                  directly with the developer. Most developers charge $100-200/hour.
                </p>
              </div>
            </section>

            {/* Response Times */}
            <section className="pt-8 border-t">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="text-orange-600" size={24} />
                </div>
                <h2 className="text-3xl font-bold">Response Times</h2>
              </div>
              
              <div className="space-y-4 text-gray-600">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">24hrs</div>
                    <div className="font-semibold mb-2">Developer Support</div>
                    <p className="text-sm">Average first response time from developers</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">12hrs</div>
                    <div className="font-semibold mb-2">Genix Platform</div>
                    <p className="text-sm">For billing, refunds, and platform issues</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">48hrs</div>
                    <div className="font-semibold mb-2">Bug Fixes</div>
                    <p className="text-sm">Critical bugs addressed within 2 business days</p>
                  </div>
                </div>

                <p className="text-sm">
                  Response times may vary on weekends and holidays. For urgent issues, use the 
                  "Urgent" tag in your support ticket.
                </p>
              </div>
            </section>

            {/* How to Get Support */}
            <section className="pt-8 border-t">
              <h2 className="text-3xl font-bold mb-6">How to Get Support</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Check Documentation</h3>
                      <p className="text-sm text-gray-600">
                        Start with the template's README and documentation. 80% of questions are 
                        answered there.
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
                      <h3 className="font-semibold mb-2">Open a Support Ticket</h3>
                      <p className="text-sm text-gray-600">
                        Go to your Purchases page → Select the template → Click "Get Support". 
                        The developer will be notified immediately.
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
                      <h3 className="font-semibold mb-2">Contact Genix Platform</h3>
                      <p className="text-sm text-gray-600">
                        For billing, refunds, or platform issues, email support@genix.so
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Refund Policy Details */}
            <section className="pt-8 border-t">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <RefreshCw className="text-purple-600" size={24} />
                </div>
                <h2 className="text-3xl font-bold">Detailed Refund Policy</h2>
              </div>
              
              <div className="space-y-4 text-gray-600">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-3">✓ Valid Refund Reasons</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Template doesn't match the description</li>
                    <li>• Code has critical bugs that can't be fixed</li>
                    <li>• Template doesn't work as advertised</li>
                    <li>• Missing features listed in the description</li>
                    <li>• You changed your mind (within 30 days)</li>
                  </ul>
                </div>

                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-3">✗ We Cannot Refund If:</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• More than 30 days have passed since purchase</li>
                    <li>• You've already used the template in production</li>
                    <li>• You violated the license terms</li>
                    <li>• The issue is with your hosting/infrastructure</li>
                    <li>• You purchased the wrong template by mistake (but we'll help you swap)</li>
                  </ul>
                </div>

                <p className="text-sm bg-blue-50 rounded-lg p-4">
                  <strong>Fair Use:</strong> We monitor refund patterns to prevent abuse. Multiple 
                  refunds may result in account restrictions. We trust you'll use this policy fairly.
                </p>
              </div>
            </section>

            {/* After Support Period */}
            <section className="pt-8 border-t">
              <h2 className="text-3xl font-bold mb-6">After 30 Days</h2>
              
              <div className="space-y-4 text-gray-600">
                <p className="text-lg">
                  The 30-day support period covers initial setup and deployment. After that:
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold mb-2">Still Available:</h3>
                    <ul className="space-y-2 text-sm">
                      <li>✓ Template updates and security patches</li>
                      <li>✓ Documentation access</li>
                      <li>✓ Community forums</li>
                      <li>✓ Re-download access</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold mb-2">Requires Consulting:</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• New feature requests</li>
                      <li>• Custom modifications</li>
                      <li>• Integration help</li>
                      <li>• Advanced troubleshooting</li>
                    </ul>
                  </div>
                </div>

                <p className="text-sm mt-4">
                  You can always book consulting sessions with the original developer or hire 
                  any developer to work on the code.
                </p>
              </div>
            </section>

            {/* Questions */}
            <section className="pt-8 border-t">
              <h2 className="text-3xl font-bold mb-6">Common Questions</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">What if the developer doesn't respond?</h3>
                  <p className="text-sm text-gray-600">
                    Contact Genix support. We'll intervene and ensure you get help. Developers 
                    are required to respond within 48 hours.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Can I extend the support period?</h3>
                  <p className="text-sm text-gray-600">
                    Yes! Many developers offer extended support plans. Check the template page 
                    or contact the developer directly.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">What if I find a bug after 30 days?</h3>
                  <p className="text-sm text-gray-600">
                    Security and critical bugs are fixed for free, even after 30 days. Report 
                    them through the support ticket system.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">How do I request a refund?</h3>
                  <p className="text-sm text-gray-600">
                    Email support@genix.so with your order number. We'll process it within 2 
                    business days, no questions asked.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="pt-8 border-t">
              <div className="bg-primary-50 rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
                <p className="text-gray-600 mb-6">
                  Our support team is here for you
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="mailto:support@genix.so" className="btn btn-primary">
                    Email Support
                  </a>
                  <a href="/contact" className="btn btn-secondary">
                    Contact Form
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}