import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | AI Tools List',
  description: 'Read our Terms of Service to understand the rules and regulations for using AI Tools List website and services.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            <strong>Last updated:</strong> January 15, 2024
          </p>

          <p>
            Welcome to AI Tools Insights ("we," "our," or "us"). These Terms of Service ("Terms") 
            govern your use of our website located at www.aitoolsinsights.com (the "Service") 
            operated by AI Tools Insights.
          </p>

          <p>
            By accessing or using our Service, you agree to be bound by these Terms. If you 
            disagree with any part of these terms, then you may not access the Service.
          </p>

          <h2>Acceptance of Terms</h2>
          <p>
            By accessing and using this website, you accept and agree to be bound by the terms 
            and provision of this agreement. Additionally, when using this website's particular 
            services, you shall be subject to any posted guidelines or rules applicable to such services.
          </p>

          <h2>Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials on AI Tools Insights' 
            website for personal, non-commercial transitory viewing only. This is the grant of a license, 
            not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>modify or copy the materials</li>
            <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
            <li>attempt to decompile or reverse engineer any software contained on the website</li>
            <li>remove any copyright or other proprietary notations from the materials</li>
          </ul>

          <h2>User Accounts</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, 
            complete, and current at all times. You are responsible for safeguarding the password 
            and for all activities that occur under your account.
          </p>

          <h2>Prohibited Uses</h2>
          <p>You may not use our Service:</p>
          <ul>
            <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
            <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
            <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
            <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
            <li>To submit false or misleading information</li>
            <li>To upload or transmit viruses or any other type of malicious code</li>
            <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
            <li>For any obscene or immoral purpose</li>
            <li>To interfere with or circumvent the security features of the Service</li>
          </ul>

          <h2>Content</h2>
          <p>
            Our Service allows you to post, link, store, share and otherwise make available certain 
            information, text, graphics, videos, or other material ("Content"). You are responsible 
            for the Content that you post to the Service, including its legality, reliability, and appropriateness.
          </p>

          <p>By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service.</p>

          <h2>Privacy Policy</h2>
          <p>
            Your privacy is important to us. Please review our Privacy Policy, which also governs 
            your use of the Service, to understand our practices.
          </p>

          <h2>Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, 
            for any reason whatsoever, including without limitation if you breach the Terms.
          </p>

          <h2>Disclaimer</h2>
          <p>
            The information on this website is provided on an "as is" basis. To the fullest extent 
            permitted by law, this Company:
          </p>
          <ul>
            <li>excludes all representations and warranties relating to this website and its contents</li>
            <li>excludes all liability for damages arising out of or in connection with your use of this website</li>
          </ul>

          <h2>Accuracy of Materials</h2>
          <p>
            The materials appearing on AI Tools List's website could include technical, typographical, 
            or photographic errors. AI Tools List does not warrant that any of the materials on its 
            website are accurate, complete, or current.
          </p>

          <h2>Links</h2>
          <p>
            AI Tools List has not reviewed all of the sites linked to our website and is not 
            responsible for the contents of any such linked site. The inclusion of any link does 
            not imply endorsement by AI Tools List of the site.
          </p>

          <h2>Modifications</h2>
          <p>
            AI Tools List may revise these terms of service for its website at any time without notice. 
            By using this website, you are agreeing to be bound by the then current version of these terms of service.
          </p>

          <h2>Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of 
            California and you irrevocably submit to the exclusive jurisdiction of the courts in that 
            state or location.
          </p>

          <h2>Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <ul>
            <li>Email: legal@aitoolsinsights.com</li>
            <li>Address: 123 AI Street, San Francisco, CA 94105</li>
          </ul>
        </div>
      </div>
    </div>
  )
}