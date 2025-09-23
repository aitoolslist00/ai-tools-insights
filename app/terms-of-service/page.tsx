import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - AI Tools Insights | User Agreement & Guidelines',
  description: 'Read AI Tools Insights comprehensive terms of service. Understand the rules, guidelines, and user agreement for using our AI tools directory platform.',
  keywords: 'terms of service, user agreement, AI tools insights terms, platform guidelines, service conditions',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Terms of Service - AI Tools Insights',
    description: 'User agreement and terms of service for AI Tools Insights platform.',
    url: 'https://www.aitoolsinsights.com/terms-of-service',
  },
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600 mb-2">
            AI Tools Insights - User Agreement
          </p>
          <p className="text-lg text-gray-500">
            Last updated: December 19, 2024 | Effective Date: December 19, 2024
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <p className="text-gray-700">
                <strong>Welcome to AI Tools Insights!</strong> These Terms of Service ("Terms") govern your use of 
                www.aitoolsinsights.com ("Service") operated by AI Tools Insights ("us", "we", or "our"). 
                Please read these Terms carefully before using our Service.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing, browsing, or using AI Tools Insights, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms and our Privacy Policy. If you do not 
              agree to these Terms, please do not use our Service.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Legal Agreement</h3>
            <p className="text-gray-700 mb-4">
              These Terms constitute a legally binding agreement between you and AI Tools Insights. 
              You must be at least 18 years old or have parental consent to use our Service.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Updates to Terms</h3>
            <p className="text-gray-700">
              We reserve the right to modify these Terms at any time. We will notify users of material 
              changes via email or prominent website notice. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              AI Tools Insights is a comprehensive directory and review platform for artificial intelligence tools and services. Our Service includes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Curated directory of AI tools across various categories</li>
              <li>User reviews, ratings, and recommendations</li>
              <li>Educational content, guides, and tutorials</li>
              <li>Search and filtering functionality</li>
              <li>Newsletter and email communications</li>
              <li>Blog articles and industry insights</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Service Availability</h3>
            <p className="text-gray-700">
              We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. 
              We may temporarily suspend the Service for maintenance, updates, or other operational reasons.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts and Registration</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Account Creation</h3>
            <p className="text-gray-700 mb-4">
              To access certain features, you may need to create an account. When creating an account, you agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information as needed</li>
              <li>Keep your login credentials secure and confidential</li>
              <li>Notify us immediately of any unauthorized account access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Account Termination</h3>
            <p className="text-gray-700">
              You may close your account at any time. We reserve the right to suspend or terminate 
              accounts that violate these Terms or engage in harmful activities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use Policy</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Permitted Uses</h3>
            <p className="text-gray-700 mb-4">You may use our Service to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Browse and search AI tools and services</li>
              <li>Read reviews and educational content</li>
              <li>Submit honest reviews and ratings</li>
              <li>Subscribe to newsletters and updates</li>
              <li>Contact us for support or inquiries</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Prohibited Activities</h3>
            <p className="text-gray-700 mb-4">You agree NOT to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Submit false, misleading, or fraudulent reviews</li>
              <li>Attempt to hack, compromise, or damage our systems</li>
              <li>Copy, reproduce, or distribute our content without permission</li>
              <li>Use automated systems to access or scrape our content</li>
              <li>Spam, harass, or abuse other users</li>
              <li>Upload malicious software or harmful content</li>
              <li>Impersonate others or create fake accounts</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Commercial Use Restrictions</h3>
            <p className="text-gray-700">
              Commercial use of our content requires explicit written permission. This includes 
              reselling, redistributing, or using our data for competitive purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. User-Generated Content</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Content Submission</h3>
            <p className="text-gray-700 mb-4">
              By submitting content (reviews, comments, ratings), you grant us a non-exclusive, 
              worldwide, royalty-free license to use, modify, and display your content on our platform.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Content Standards</h3>
            <p className="text-gray-700 mb-4">All user content must be:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Honest, accurate, and based on personal experience</li>
              <li>Respectful and professional in tone</li>
              <li>Free from offensive, harmful, or illegal content</li>
              <li>Non-promotional and not spam</li>
              <li>Compliant with applicable laws and regulations</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Content Moderation</h3>
            <p className="text-gray-700">
              We reserve the right to review, edit, or remove any user content that violates these Terms 
              or our community guidelines. We are not obligated to monitor all content but may do so at our discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property Rights</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Content</h3>
            <p className="text-gray-700 mb-4">
              All content on AI Tools Insights, including text, graphics, logos, images, and software, 
              is our property or licensed to us and is protected by copyright, trademark, and other intellectual property laws.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Limited License</h3>
            <p className="text-gray-700 mb-4">
              We grant you a limited, non-exclusive, non-transferable license to access and use our 
              Service for personal, non-commercial purposes. This license does not include:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Resale or commercial use of our Service or content</li>
              <li>Collection and use of product listings or descriptions</li>
              <li>Making derivative works of our content</li>
              <li>Use of data mining, robots, or similar tools</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">DMCA Compliance</h3>
            <p className="text-gray-700">
              We respect intellectual property rights. If you believe your copyright has been infringed, 
              please contact us at legal@aitoolsinsights.com with detailed information about the alleged infringement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Third-Party Links and Services</h2>
            <p className="text-gray-700 mb-4">
              Our Service may contain links to third-party websites, AI tools, and services. We are not 
              responsible for the content, privacy policies, or practices of these third parties.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Tool Reviews and Recommendations</h3>
            <p className="text-gray-700 mb-4">
              Our reviews and recommendations are for informational purposes only. We do not guarantee 
              the accuracy, reliability, or performance of third-party AI tools and services.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Affiliate Relationships</h3>
            <p className="text-gray-700">
              We may receive compensation from some AI tool providers through affiliate programs. 
              This does not influence our editorial content or reviews, which remain independent and unbiased.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Disclaimers and Warranties</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Service "As Is"</h3>
            <p className="text-gray-700 mb-4">
              Our Service is provided on an "as is" and "as available" basis. We make no warranties, 
              express or implied, regarding:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Uninterrupted or error-free service operation</li>
              <li>Accuracy or completeness of information</li>
              <li>Security or privacy of your data</li>
              <li>Results or outcomes from using our Service</li>
              <li>Compatibility with your systems or software</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Information Accuracy</h3>
            <p className="text-gray-700">
              While we strive for accuracy, we do not warrant that information about AI tools, 
              pricing, features, or availability is current, accurate, or complete. Users should 
              verify information independently before making decisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              To the maximum extent permitted by law, AI Tools Insights shall not be liable for any:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Direct, indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Damages arising from use of third-party AI tools or services</li>
              <li>Service interruptions or technical failures</li>
              <li>User content or interactions with other users</li>
            </ul>
            
            <p className="text-gray-700">
              In no event shall our total liability exceed the amount you paid to us in the 12 months 
              preceding the claim, or $100, whichever is greater.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Indemnification</h2>
            <p className="text-gray-700">
              You agree to indemnify, defend, and hold harmless AI Tools Insights, its officers, 
              directors, employees, and agents from any claims, damages, losses, or expenses 
              (including reasonable attorney fees) arising from:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Your use of our Service</li>
              <li>Your violation of these Terms</li>
              <li>Your user content or submissions</li>
              <li>Your violation of any third-party rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Termination</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Termination by You</h3>
            <p className="text-gray-700 mb-4">
              You may stop using our Service at any time. If you have an account, you may close it 
              by contacting us at hello@aitoolsinsights.com.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Termination by Us</h3>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend your access immediately if you:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Violate these Terms or our policies</li>
              <li>Engage in harmful or illegal activities</li>
              <li>Create security risks or technical problems</li>
              <li>Fail to pay any fees owed</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Effect of Termination</h3>
            <p className="text-gray-700">
              Upon termination, your right to use the Service ceases immediately. Provisions regarding 
              intellectual property, disclaimers, limitation of liability, and indemnification survive termination.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law and Disputes</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Applicable Law</h3>
            <p className="text-gray-700 mb-4">
              These Terms are governed by and construed in accordance with applicable laws, 
              without regard to conflict of law principles.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Dispute Resolution</h3>
            <p className="text-gray-700 mb-4">
              We encourage resolving disputes through direct communication. For formal disputes, 
              we prefer binding arbitration over litigation where legally permissible.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Class Action Waiver</h3>
            <p className="text-gray-700">
              You agree to resolve disputes individually and waive rights to participate in class 
              actions or representative proceedings, where legally enforceable.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. General Provisions</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Entire Agreement</h3>
            <p className="text-gray-700 mb-4">
              These Terms, together with our Privacy Policy and Cookie Policy, constitute the 
              entire agreement between you and AI Tools Insights.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Severability</h3>
            <p className="text-gray-700 mb-4">
              If any provision of these Terms is found unenforceable, the remaining provisions 
              remain in full force and effect.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Assignment</h3>
            <p className="text-gray-700">
              We may assign these Terms or our rights hereunder without notice. You may not assign 
              your rights without our written consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Information</h2>
            <div className="bg-gray-50 border-l-4 border-gray-400 p-6 rounded">
              <p className="text-gray-700 mb-4">
                If you have any questions, concerns, or legal inquiries regarding these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Legal Inquiries:</strong>{' '}
                  <a href="mailto:legal@aitoolsinsights.com" className="text-blue-600 hover:text-blue-800">
                    legal@aitoolsinsights.com
                  </a>
                </p>
                <p><strong>General Support:</strong>{' '}
                  <a href="mailto:hello@aitoolsinsights.com" className="text-blue-600 hover:text-blue-800">
                    hello@aitoolsinsights.com
                  </a>
                </p>
                <p><strong>Website:</strong>{' '}
                  <a href="https://www.aitoolsinsights.com" className="text-blue-600 hover:text-blue-800">
                    www.aitoolsinsights.com
                  </a>
                </p>
                <p><strong>Response Time:</strong> We typically respond to legal inquiries within 5-7 business days</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}