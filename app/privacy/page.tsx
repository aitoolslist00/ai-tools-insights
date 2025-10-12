import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | AI Tools List',
  description: 'Learn how AI Tools List collects, uses, and protects your personal information. Our commitment to your privacy.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            <strong>Last updated:</strong> January 15, 2024
          </p>

          <p>
            At AI Tools Insights ("we," "our," or "us"), we are committed to protecting your privacy and 
            ensuring the security of your personal information. This Privacy Policy explains how we 
            collect, use, disclose, and safeguard your information when you visit our website 
            www.aitoolsinsights.com.
          </p>

          <h2>Information We Collect</h2>
          
          <h3>Personal Information</h3>
          <p>We may collect personal information that you voluntarily provide to us when you:</p>
          <ul>
            <li>Subscribe to our newsletter</li>
            <li>Contact us through our contact form</li>
            <li>Create an account on our website</li>
            <li>Participate in surveys or feedback forms</li>
          </ul>

          <p>This information may include:</p>
          <ul>
            <li>Name and email address</li>
            <li>Company name and job title</li>
            <li>Contact information</li>
            <li>Any other information you choose to provide</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <p>When you visit our website, we may automatically collect certain information, including:</p>
          <ul>
            <li>IP address and location data</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Pages visited and time spent on our site</li>
            <li>Referring website addresses</li>
            <li>Device information</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect for various purposes, including:</p>
          <ul>
            <li>Providing and maintaining our services</li>
            <li>Sending newsletters and marketing communications</li>
            <li>Responding to your inquiries and support requests</li>
            <li>Improving our website and user experience</li>
            <li>Analyzing website usage and trends</li>
            <li>Preventing fraud and ensuring security</li>
            <li>Complying with legal obligations</li>
          </ul>

          <h2>Information Sharing and Disclosure</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
          
          <h3>Service Providers</h3>
          <p>
            We may share your information with trusted third-party service providers who assist us in 
            operating our website, conducting our business, or serving our users, provided they agree 
            to keep this information confidential.
          </p>

          <h3>Legal Requirements</h3>
          <p>
            We may disclose your information if required to do so by law or in response to valid 
            requests by public authorities.
          </p>

          <h3>Business Transfers</h3>
          <p>
            In the event of a merger, acquisition, or sale of assets, your information may be 
            transferred as part of that transaction.
          </p>

          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your 
            personal information against unauthorized access, alteration, disclosure, or destruction. 
            However, no method of transmission over the internet or electronic storage is 100% secure.
          </p>

          <h2>Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your browsing experience, 
            analyze site traffic, and understand where our visitors are coming from. You can control 
            cookie settings through your browser preferences.
          </p>

          <h2>Your Rights and Choices</h2>
          <p>Depending on your location, you may have the following rights:</p>
          <ul>
            <li>Access to your personal information</li>
            <li>Correction of inaccurate information</li>
            <li>Deletion of your personal information</li>
            <li>Restriction of processing</li>
            <li>Data portability</li>
            <li>Objection to processing</li>
          </ul>

          <p>
            To exercise these rights or if you have questions about your personal information, 
            please contact us at privacy@aitoolsinsights.com.
          </p>

          <h2>Newsletter and Marketing Communications</h2>
          <p>
            If you subscribe to our newsletter, you can unsubscribe at any time by clicking the 
            unsubscribe link in our emails or by contacting us directly.
          </p>

          <h2>Children's Privacy</h2>
          <p>
            Our website is not intended for children under the age of 13. We do not knowingly 
            collect personal information from children under 13. If we become aware that we have 
            collected personal information from a child under 13, we will take steps to delete 
            such information.
          </p>

          <h2>International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your own. 
            We ensure appropriate safeguards are in place to protect your information in accordance 
            with this Privacy Policy.
          </p>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes 
            by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our privacy practices, please 
            contact us at:
          </p>
          <ul>
            <li>Email: privacy@aitoolsinsights.com</li>
            <li>Address: 123 AI Street, San Francisco, CA 94105</li>
          </ul>
        </div>
      </div>
    </div>
  )
}