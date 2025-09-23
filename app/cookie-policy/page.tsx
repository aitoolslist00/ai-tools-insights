import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy - AI Tools Insights | How We Use Cookies & Tracking',
  description: 'Learn about how AI Tools Insights uses cookies to enhance your browsing experience, provide personalized content, and improve our AI tools directory services.',
  keywords: 'cookie policy, cookies, tracking, AI tools insights cookies, website preferences, privacy settings',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Cookie Policy - AI Tools Insights',
    description: 'Understand how we use cookies to improve your experience on AI Tools Insights.',
    url: 'https://www.aitoolsinsights.com/cookie-policy',
  },
}

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-xl text-gray-600 mb-2">
            AI Tools Insights - Cookie Usage & Preferences
          </p>
          <p className="text-lg text-gray-500">
            Last updated: December 19, 2024 | Effective Date: December 19, 2024
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <p className="text-gray-700">
                <strong>AI Tools Insights</strong> ("we," "our," or "us") uses cookies and similar technologies 
                on www.aitoolsinsights.com to enhance your browsing experience, provide personalized content, 
                and analyze how our AI tools directory is used.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. What Are Cookies</h2>
            <p className="text-gray-700 mb-4">
              Cookies are small text files that are placed on your computer, mobile device, or other device 
              when you visit our website. They contain information that is transferred to your device's 
              hard drive and help us recognize your browser and capture certain information.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Similar Technologies</h3>
            <p className="text-gray-700 mb-4">
              In addition to cookies, we also use similar technologies including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li><strong>Web Beacons:</strong> Small graphic images that help us analyze user behavior</li>
              <li><strong>Local Storage:</strong> HTML5 local storage for improved functionality</li>
              <li><strong>Session Storage:</strong> Temporary data storage during your browsing session</li>
              <li><strong>Pixels:</strong> Tiny images that track interactions and conversions</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Why We Use Cookies</h3>
            <p className="text-gray-700">
              Cookies help us provide you with a better, faster, and more personalized experience by 
              remembering your preferences, understanding how you interact with our AI tools directory, 
              and improving our services based on usage patterns.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Types of Cookies We Use</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-green-500 pl-6 bg-green-50 p-4 rounded">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Essential Cookies (Always Active)</h3>
                <p className="text-gray-700 mb-3">
                  These cookies are strictly necessary for our website to function and cannot be disabled. They enable core functionality such as:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Site navigation and page loading</li>
                  <li>Access to secure areas of the website</li>
                  <li>Basic website features and services</li>
                  <li>Security and fraud prevention</li>
                  <li>Load balancing and performance optimization</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-6 bg-blue-50 p-4 rounded">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Functional Cookies</h3>
                <p className="text-gray-700 mb-3">
                  These cookies remember your preferences and choices to provide enhanced functionality:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Language and region preferences</li>
                  <li>User interface customizations</li>
                  <li>Search filters and sorting preferences</li>
                  <li>Favorite AI tools and bookmarks</li>
                  <li>Newsletter subscription preferences</li>
                </ul>
              </div>

              <div className="border-l-4 border-yellow-500 pl-6 bg-yellow-50 p-4 rounded">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics Cookies</h3>
                <p className="text-gray-700 mb-3">
                  These cookies help us understand how visitors interact with our website by collecting anonymous information:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Page views and user journeys</li>
                  <li>Time spent on different pages</li>
                  <li>Most popular AI tools and categories</li>
                  <li>Search queries and results</li>
                  <li>Device and browser information</li>
                  <li>Geographic location (country/region level)</li>
                </ul>
                <p className="text-gray-600 text-sm mt-2">
                  <strong>Third-party service:</strong> Google Analytics (with IP anonymization enabled)
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-6 bg-purple-50 p-4 rounded">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Marketing Cookies</h3>
                <p className="text-gray-700 mb-3">
                  These cookies track your browsing habits to provide personalized content and advertisements:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Personalized AI tool recommendations</li>
                  <li>Targeted newsletter content</li>
                  <li>Social media integration</li>
                  <li>Affiliate program tracking</li>
                  <li>Advertising campaign effectiveness</li>
                </ul>
                <p className="text-gray-600 text-sm mt-2">
                  <strong>Note:</strong> You can opt-out of marketing cookies while still using our website
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Cookie Duration</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Session Cookies</h3>
            <div className="bg-gray-50 p-4 rounded mb-4">
              <p className="text-gray-700 mb-2">
                <strong>Duration:</strong> Expire when you close your browser
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Purpose:</strong> Maintain your session while browsing our website
              </p>
              <p className="text-gray-700">
                <strong>Examples:</strong> Shopping cart contents, login status, form data
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Persistent Cookies</h3>
            <div className="bg-gray-50 p-4 rounded mb-4">
              <p className="text-gray-700 mb-2">
                <strong>Duration:</strong> Remain on your device until expiration or manual deletion
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Typical Lifespan:</strong> 1 month to 2 years (varies by purpose)
              </p>
              <p className="text-gray-700">
                <strong>Examples:</strong> User preferences, analytics data, marketing identifiers
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Specific Cookie Lifespans</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Cookie Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Essential</td>
                    <td className="border border-gray-300 px-4 py-2">Session / 24 hours</td>
                    <td className="border border-gray-300 px-4 py-2">Website functionality</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Functional</td>
                    <td className="border border-gray-300 px-4 py-2">1 month - 1 year</td>
                    <td className="border border-gray-300 px-4 py-2">User preferences</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Analytics</td>
                    <td className="border border-gray-300 px-4 py-2">2 years</td>
                    <td className="border border-gray-300 px-4 py-2">Usage analysis</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Marketing</td>
                    <td className="border border-gray-300 px-4 py-2">30 days - 2 years</td>
                    <td className="border border-gray-300 px-4 py-2">Personalization & ads</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Third-Party Cookies</h2>
            <p className="text-gray-700 mb-4">
              We use several trusted third-party services that may set their own cookies on your device:
            </p>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Google Analytics</h3>
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Purpose:</strong> Website analytics and user behavior tracking
                </p>
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Data:</strong> Anonymized usage statistics and performance metrics
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Privacy:</strong>{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    Google Privacy Policy
                  </a>
                </p>
              </div>

              <div className="border border-gray-200 rounded p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Social Media Platforms</h3>
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Purpose:</strong> Social media integration and content sharing
                </p>
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Data:</strong> Social interactions and sharing activity
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Platforms:</strong> Twitter, LinkedIn, Facebook (when you interact with embedded content)
                </p>
              </div>

              <div className="border border-gray-200 rounded p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Email Marketing Services</h3>
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Purpose:</strong> Newsletter delivery and email campaign tracking
                </p>
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Data:</strong> Email engagement and delivery statistics
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Note:</strong> Only active if you subscribe to our newsletter
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Managing Your Cookie Preferences</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Browser Settings</h3>
            <p className="text-gray-700 mb-4">
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>View all cookies stored on your device</li>
              <li>Delete cookies individually or all at once</li>
              <li>Block cookies from specific websites</li>
              <li>Block all cookies (may affect website functionality)</li>
              <li>Set notifications when cookies are being set</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Browser-Specific Instructions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-gray-200 rounded p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Chrome</h4>
                <p className="text-gray-700 text-sm">Settings → Advanced → Privacy and Security → Cookies and other site data</p>
              </div>
              <div className="border border-gray-200 rounded p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Firefox</h4>
                <p className="text-gray-700 text-sm">Settings → Privacy & Security → Cookies and Site Data</p>
              </div>
              <div className="border border-gray-200 rounded p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Safari</h4>
                <p className="text-gray-700 text-sm">Preferences → Privacy → Manage Website Data</p>
              </div>
              <div className="border border-gray-200 rounded p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Edge</h4>
                <p className="text-gray-700 text-sm">Settings → Cookies and site permissions → Cookies and site data</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Cookie Consent Management</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <p className="text-gray-700 mb-2">
                <strong>Cookie Banner:</strong> When you first visit our website, you'll see a cookie consent banner 
                allowing you to accept or customize your cookie preferences.
              </p>
              <p className="text-gray-700">
                <strong>Change Preferences:</strong> You can update your cookie preferences at any time by 
                clicking the "Cookie Settings" link in our website footer.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Opt-Out Options</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Google Analytics:</strong>{' '}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  Google Analytics Opt-out Browser Add-on
                </a>
              </li>
              <li>
                <strong>Marketing Cookies:</strong> Use our cookie preference center to disable marketing cookies
              </li>
              <li>
                <strong>Email Tracking:</strong> Unsubscribe from newsletters or disable image loading in your email client
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Impact of Disabling Cookies</h2>
            
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">⚠️ Important Notice</h3>
              <p className="text-gray-700">
                Disabling cookies may affect your experience on AI Tools Insights. Some features may not work properly or at all.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Potential Effects</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Loss of personalized AI tool recommendations</li>
              <li>Need to re-enter preferences on each visit</li>
              <li>Inability to save favorite tools or bookmarks</li>
              <li>Reduced functionality of search and filters</li>
              <li>Less relevant newsletter content</li>
              <li>Inability to track your reading progress</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Recommended Settings</h3>
            <p className="text-gray-700">
              For the best experience, we recommend allowing essential and functional cookies while 
              customizing your preferences for analytics and marketing cookies based on your comfort level.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Updates to This Cookie Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Cookie Policy periodically to reflect changes in our cookie usage, 
              technology, or legal requirements. When we make material changes, we will:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Update the "Last updated" date at the top of this policy</li>
              <li>Display a notification on our website</li>
              <li>Send email notifications to newsletter subscribers (for significant changes)</li>
              <li>Request renewed consent where required by law</li>
            </ul>
            <p className="text-gray-700">
              We encourage you to review this Cookie Policy periodically to stay informed about 
              how we use cookies and similar technologies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Us About Cookies</h2>
            <div className="bg-gray-50 border-l-4 border-gray-400 p-6 rounded">
              <p className="text-gray-700 mb-4">
                If you have any questions, concerns, or requests about our use of cookies, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Cookie Inquiries:</strong>{' '}
                  <a href="mailto:cookies@aitoolsinsights.com" className="text-blue-600 hover:text-blue-800">
                    cookies@aitoolsinsights.com
                  </a>
                </p>
                <p><strong>Privacy Questions:</strong>{' '}
                  <a href="mailto:privacy@aitoolsinsights.com" className="text-blue-600 hover:text-blue-800">
                    privacy@aitoolsinsights.com
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
                <p><strong>Response Time:</strong> We typically respond to cookie-related inquiries within 5 business days</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Additional Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Privacy Policy</h3>
                <p className="text-gray-700 text-sm mb-2">
                  Learn more about how we collect, use, and protect your personal information.
                </p>
                <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Read Privacy Policy →
                </a>
              </div>
              <div className="border border-gray-200 rounded p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Terms of Service</h3>
                <p className="text-gray-700 text-sm mb-2">
                  Understand the terms and conditions for using AI Tools Insights.
                </p>
                <a href="/terms-of-service" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Read Terms of Service →
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}