import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - AI Tools Insights | Data Protection & User Privacy',
  description: 'Read AI Tools Insights comprehensive privacy policy. Learn how we collect, use, and protect your personal data when using our AI tools directory and services.',
  keywords: 'privacy policy, data protection, AI tools insights privacy, GDPR compliance, user data security',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Privacy Policy - AI Tools Insights',
    description: 'Learn how AI Tools Insights protects your privacy and handles your personal data.',
    url: 'https://www.aitoolsinsights.com/privacy-policy',
  },
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600 mb-2">
            AI Tools Insights - Protecting Your Privacy
          </p>
          <p className="text-lg text-gray-500">
            Last updated: December 19, 2024 | Effective Date: December 19, 2024
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <p className="text-gray-700">
                <strong>AI Tools Insights</strong> ("we," "our," or "us") operates www.aitoolsinsights.com. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you visit our website and use our AI tools directory services.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h3>
            <p className="text-gray-700 mb-4">
              We collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Subscribe to our newsletter or email updates</li>
              <li>Create an account or user profile</li>
              <li>Submit tool reviews, ratings, or comments</li>
              <li>Contact us for support or inquiries</li>
              <li>Participate in surveys or feedback forms</li>
              <li>Apply to submit AI tools for review</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Automatically Collected Information</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Device information (browser type, operating system, device identifiers)</li>
              <li>Usage data (pages viewed, time spent, click patterns)</li>
              <li>Location information (IP address, general geographic location)</li>
              <li>Referral sources and search terms</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Third-Party Information</h3>
            <p className="text-gray-700 mb-4">
              We may receive information from third-party services including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Google Analytics for website usage statistics</li>
              <li>Social media platforms when you interact with our content</li>
              <li>Email marketing platforms for communication preferences</li>
              <li>AI tool providers for integration and review purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use the collected information for the following purposes:
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Service Provision</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Maintain and improve our AI tools directory platform</li>
              <li>Provide personalized AI tool recommendations</li>
              <li>Process and display user reviews and ratings</li>
              <li>Enable search and filtering functionality</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Communication</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Send newsletters about new AI tools and industry updates</li>
              <li>Respond to customer support inquiries</li>
              <li>Notify about platform updates and new features</li>
              <li>Send administrative communications</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Analytics and Improvement</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Analyze user behavior and preferences</li>
              <li>Optimize website performance and user experience</li>
              <li>Conduct research on AI tool trends and usage patterns</li>
              <li>Develop new features and services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing and Disclosure</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">We Do Not Sell Personal Information</h3>
            <p className="text-gray-700 mb-4">
              AI Tools Insights does not sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Limited Sharing Circumstances</h3>
            <p className="text-gray-700 mb-4">We may share your information in the following situations:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li><strong>Service Providers:</strong> With trusted third-party companies that help us operate our platform</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with any merger, sale, or transfer of our business</li>
              <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Public Information</h3>
            <p className="text-gray-700">
              Reviews, comments, and ratings you submit may be displayed publicly on our platform. 
              Please do not include sensitive personal information in public submissions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security and Protection</h2>
            <p className="text-gray-700 mb-4">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure servers with restricted access</li>
              <li>Regular security audits and monitoring</li>
              <li>Employee training on data protection practices</li>
              <li>Incident response procedures for security breaches</li>
            </ul>
            <p className="text-gray-700">
              While we strive to protect your information, no method of transmission over the internet 
              or electronic storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Privacy Rights</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Access and Control</h3>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Access your personal information we hold</li>
              <li>Correct or update inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data in a portable format</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">GDPR Rights (EU Residents)</h3>
            <p className="text-gray-700 mb-4">If you are in the European Union, you have additional rights including:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Right to data portability</li>
              <li>Right to restrict processing</li>
              <li>Right to object to processing</li>
              <li>Right to lodge a complaint with a supervisory authority</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">CCPA Rights (California Residents)</h3>
            <p className="text-gray-700 mb-4">California residents have the right to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Know what personal information is collected and how it's used</li>
              <li>Delete personal information (with certain exceptions)</li>
              <li>Opt-out of the sale of personal information</li>
              <li>Non-discrimination for exercising privacy rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your personal information for as long as necessary to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Provide our services to you</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce agreements</li>
              <li>Improve our services through analytics</li>
            </ul>
            <p className="text-gray-700">
              Account information is retained until you request deletion or close your account. 
              Analytics data may be retained for up to 3 years for business improvement purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. International Data Transfers</h2>
            <p className="text-gray-700 mb-4">
              AI Tools Insights operates globally. Your information may be transferred to and processed 
              in countries other than your country of residence. We ensure appropriate safeguards are 
              in place for international transfers, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Standard contractual clauses approved by data protection authorities</li>
              <li>Adequacy decisions by relevant authorities</li>
              <li>Your explicit consent where required</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700">
              AI Tools Insights does not knowingly collect personal information from children under 13. 
              If you believe we have collected information from a child under 13, please contact us immediately 
              at privacy@aitoolsinsights.com and we will promptly delete such information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy periodically to reflect changes in our practices or applicable laws. 
              We will notify you of material changes by:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Posting the updated policy on our website</li>
              <li>Sending email notifications to registered users</li>
              <li>Displaying prominent notices on our platform</li>
            </ul>
            <p className="text-gray-700">
              Your continued use of our services after the effective date constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
            <div className="bg-gray-50 border-l-4 border-gray-400 p-6 rounded">
              <p className="text-gray-700 mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
                please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong>{' '}
                  <a href="mailto:privacy@aitoolsinsights.com" className="text-blue-600 hover:text-blue-800">
                    privacy@aitoolsinsights.com
                  </a>
                </p>
                <p><strong>General Contact:</strong>{' '}
                  <a href="mailto:hello@aitoolsinsights.com" className="text-blue-600 hover:text-blue-800">
                    hello@aitoolsinsights.com
                  </a>
                </p>
                <p><strong>Website:</strong>{' '}
                  <a href="https://www.aitoolsinsights.com" className="text-blue-600 hover:text-blue-800">
                    www.aitoolsinsights.com
                  </a>
                </p>
                <p><strong>Response Time:</strong> We typically respond to privacy requests within 30 days</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}