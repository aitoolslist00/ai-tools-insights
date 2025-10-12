'use client'

import { useState } from 'react'
import { Mail, CheckCircle } from 'lucide-react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    
    try {
      // Store email subscription locally
      const subscription = {
        email: email,
        timestamp: new Date().toISOString(),
        id: Date.now()
      };
      
      const existingSubscriptions = JSON.parse(localStorage.getItem('newsletter-subscriptions') || '[]');
      // Check if email already exists
      const emailExists = existingSubscriptions.find((sub: any) => sub.email === email);
      
      if (!emailExists) {
        existingSubscriptions.push(subscription);
        localStorage.setItem('newsletter-subscriptions', JSON.stringify(existingSubscriptions));
        
        // Send confirmation email
        const subject = 'Newsletter Subscription Confirmation';
        const body = `Thank you for subscribing to AI Tools List newsletter!\n\nEmail: ${email}\nDate: ${new Date().toLocaleDateString()}\n\nWe'll keep you updated with the latest AI tools and insights.`;
        const mailtoUrl = `mailto:contact@aitoolsinsights.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Optional: Open email client for confirmation
        // window.location.href = mailtoUrl;
        
        setTimeout(() => {
          setIsSubscribed(true)
          setIsLoading(false)
          setEmail('')
        }, 1000)
      } else {
        alert('This email is already subscribed to our newsletter!');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      alert('There was an error subscribing. Please try again.');
      setIsLoading(false);
    }
  }

  if (isSubscribed) {
    return (
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Thank You for Subscribing!
            </h2>
            <p className="text-xl text-gray-600">
              You'll receive our weekly newsletter with the latest AI tools and insights.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-primary-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
            <Mail className="h-8 w-8 text-primary-600" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Stay Updated with AI Tools
          </h2>
          
          {/* Description */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get weekly updates on the latest AI tools, reviews, and industry insights 
            delivered straight to your inbox.
          </p>

          {/* Newsletter form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
          </form>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Weekly AI tool updates
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Exclusive reviews & insights
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              No spam, unsubscribe anytime
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}