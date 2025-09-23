import { Metadata } from 'next'
import { Target, Users, Zap, Award } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us - AI Tools Insights | Democratizing AI for Everyone',
  description: 'Learn about AI Tools Insights mission to help businesses and individuals discover the best AI tools. Meet our expert team and discover our story of AI democratization.',
  keywords: 'about AI Tools Insights, AI directory team, AI tools mission, artificial intelligence directory, AI tool experts, AI democratization',
  openGraph: {
    title: 'About Us - AI Tools Insights | Our Mission & Team',
    description: 'Learn about our mission to help businesses and individuals discover the perfect AI tools for their needs.',
    url: 'https://www.aitoolsinsights.com/about',
    siteName: 'AI Tools Insights',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - AI Tools Insights',
    description: 'Learn about our mission to democratize AI and help everyone find the perfect tools.',
  },
}

const team = [
  {
    name: 'Sarah Johnson',
    role: 'Founder & CEO',
    bio: 'Former AI researcher at Google with 12+ years in machine learning and product development. PhD in Computer Science with focus on AI applications.',
    image: '/images/team/sarah.jpg'
  },
  {
    name: 'Michael Chen',
    role: 'Head of Content & Research',
    bio: 'Tech journalist and AI strategist who has covered the AI industry for major publications for over 10 years. Former contributor to TechCrunch and Wired.',
    image: '/images/team/michael.jpg'
  },
  {
    name: 'Emily Watson',
    role: 'Product Manager & UX Lead',
    bio: 'Product strategist with expertise in user experience and AI tool evaluation. Previously led product teams at Microsoft and OpenAI.',
    image: '/images/team/emily.jpg'
  },
  {
    name: 'David Rodriguez',
    role: 'Lead Developer & Technical Architect',
    bio: 'Full-stack developer and AI integration specialist with expertise in building scalable AI-powered web applications and data platforms.',
    image: '/images/team/david.jpg'
  },
  {
    name: 'Dr. Maria Gonzalez',
    role: 'AI Ethics & Compliance Officer',
    bio: 'Former professor of AI Ethics at Stanford. Ensures our platform maintains highest standards of AI tool evaluation and ethical considerations.',
    image: '/images/team/maria.jpg'
  },
  {
    name: 'Alex Kim',
    role: 'Community Manager & User Success',
    bio: 'Community building expert focused on user engagement and success. Helps users find the perfect AI tools for their specific needs.',
    image: '/images/team/alex.jpg'
  }
]

const values = [
  {
    icon: Target,
    title: 'Accuracy & Transparency',
    description: 'We provide honest, unbiased reviews and accurate information about every AI tool we feature, with complete transparency about our evaluation process.'
  },
  {
    icon: Users,
    title: 'Community-First',
    description: 'We build a thriving community where users share experiences, insights, and help each other discover the perfect AI solutions for their needs.'
  },
  {
    icon: Zap,
    title: 'Innovation Leadership',
    description: 'We stay at the forefront of AI technology to bring you the latest, most innovative tools and emerging technologies as they develop.'
  },
  {
    icon: Award,
    title: 'Quality Excellence',
    description: 'We maintain rigorous standards in our curation process, featuring only thoroughly tested, high-quality AI tools that deliver real value.'
  }
]

const stats = [
  {
    number: '2,500+',
    label: 'AI Tools Reviewed',
    description: 'Comprehensive analysis across all categories'
  },
  {
    number: '100K+',
    label: 'Monthly Users',
    description: 'Trusted by professionals worldwide'
  },
  {
    number: '50+',
    label: 'Tool Categories',
    description: 'From content creation to data analysis'
  },
  {
    number: '95%',
    label: 'User Satisfaction',
    description: 'Based on our quarterly user surveys'
  }
]

const achievements = [
  {
    year: '2023',
    title: 'Founded AI Tools Insights',
    description: 'Launched with mission to democratize AI access for businesses and individuals'
  },
  {
    year: '2024',
    title: 'Reached 100K Users',
    description: 'Achieved significant milestone of serving over 100,000 monthly active users'
  },
  {
    year: '2024',
    title: 'Industry Recognition',
    description: 'Featured in TechCrunch, Forbes, and Wired as leading AI tools directory'
  },
  {
    year: '2024',
    title: 'Global Expansion',
    description: 'Extended services to Europe and Asia, serving users in 50+ countries'
  }
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              About AI Tools Insights
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8">
              We're on a mission to democratize access to artificial intelligence by helping 
              businesses and individuals discover, evaluate, and implement the perfect AI tools for their unique needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span className="bg-white px-4 py-2 rounded-full shadow-sm">🚀 Founded in 2023</span>
              <span className="bg-white px-4 py-2 rounded-full shadow-sm">🌍 Serving 50+ Countries</span>
              <span className="bg-white px-4 py-2 rounded-full shadow-sm">🎯 2,500+ Tools Reviewed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                In today's rapidly evolving digital landscape, artificial intelligence is fundamentally transforming 
                how we work, create, innovate, and solve complex problems. However, with thousands of AI tools flooding 
                the market daily, finding the right solution has become increasingly overwhelming and time-consuming.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                That's where AI Tools Insights comes in. We don't just list AI tools—we deeply analyze, rigorously test, 
                and thoughtfully curate the best AI solutions across all categories. Our expert team provides detailed 
                insights, real-world use cases, and honest evaluations to help you make informed decisions.
              </p>
              <p className="text-lg text-gray-600">
                Whether you're a startup founder seeking competitive advantages, a content creator looking to scale, 
                a developer integrating AI capabilities, or an enterprise leader driving digital transformation, 
                we're your trusted guide in the AI landscape.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
                  <div className="text-sm font-semibold text-gray-900 mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-600">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Vision & Impact */}
          <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our Vision & Impact</h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We envision a world where AI technology is accessible, understandable, and beneficial for everyone—
                from individual creators to global enterprises.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Democratize AI</h4>
                <p className="text-gray-600">Make AI tools accessible and understandable for users of all technical levels</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Accelerate Innovation</h4>
                <p className="text-gray-600">Help businesses and individuals leverage AI to solve problems faster</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌟</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Drive Excellence</h4>
                <p className="text-gray-600">Maintain the highest standards in AI tool evaluation and recommendation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These fundamental principles guide everything we do at AI Tools Insights and shape how we serve our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <value.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
          
          {/* Additional Values */}
          <div className="mt-16 bg-white rounded-3xl p-8 lg:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">What Sets Us Apart</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Expert-Led Reviews</h4>
                  <p className="text-gray-600 text-sm">Our team of AI specialists and industry experts personally test and evaluate every tool</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Real-World Testing</h4>
                  <p className="text-gray-600 text-sm">We use tools in actual business scenarios to provide practical insights and honest feedback</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Continuous Monitoring</h4>
                  <p className="text-gray-600 text-sm">We regularly update our reviews as tools evolve and new features are released</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 font-bold text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Community-Driven</h4>
                  <p className="text-gray-600 text-sm">User feedback and community input actively shape our recommendations and platform features</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Expert Team</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Our diverse team of AI specialists, researchers, developers, and industry experts work together 
              to bring you the most comprehensive and trusted AI tools directory in the world
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {team.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-gray-100 transition-colors">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-600">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3 text-sm">{member.role}</p>
                <p className="text-gray-600 text-xs leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
          
          {/* Team Stats */}
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-3xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Team Expertise</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
                <div className="text-sm text-gray-600">Years Combined AI Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">15+</div>
                <div className="text-sm text-gray-600">Industry Certifications</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">100+</div>
                <div className="text-sm text-gray-600">Research Papers Published</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
                <div className="text-sm text-gray-600">Community Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story & Journey Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Story & Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From a frustrated search for reliable AI tools to becoming the world's most trusted AI directory
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="prose prose-lg text-gray-600">
              <p className="text-lg mb-6">
                <strong>AI Tools Insights was born out of necessity.</strong> As AI researchers and developers working at major tech companies, 
                we found ourselves constantly searching for the right tools to solve specific business problems. The landscape was incredibly 
                fragmented, with thousands of tools scattered across the internet and no reliable way to evaluate their true capabilities.
              </p>
              
              <p className="text-lg mb-6">
                In early 2023, we made a decision that would change everything. Instead of continuing to struggle with tool discovery, 
                we decided to create the solution we wished existed—a comprehensive, expert-driven platform that would thoroughly evaluate 
                and organize the best AI tools available.
              </p>
              
              <p className="text-lg mb-6">
                What started as a weekend project to catalog tools we personally used quickly evolved into something much more significant. 
                Within months, we realized we weren't alone in our frustration. Thousands of professionals, entrepreneurs, and creators 
                were facing the same challenges we had experienced.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Key Milestones</h3>
              <div className="space-y-6">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-600 font-bold text-sm">{achievement.year}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{achievement.title}</h4>
                      <p className="text-gray-600 text-sm">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-8 lg:p-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Today & Beyond</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-lg text-gray-600 mb-6">
                  Today, AI Tools Insights serves over <strong>100,000 monthly users</strong> across 50+ countries, 
                  from individual creators and solopreneurs to Fortune 500 companies and government agencies. 
                  We've personally reviewed over 2,500 AI tools, published hundreds of in-depth guides, 
                  and built a thriving community of AI enthusiasts.
                </p>
                
                <p className="text-lg text-gray-600 mb-6">
                  Our platform has been featured in major publications including TechCrunch, Forbes, Wired, 
                  and The Verge. We've helped thousands of businesses implement AI solutions that have 
                  transformed their operations and accelerated their growth.
                </p>
                
                <p className="text-lg text-gray-600">
                  But our journey is just beginning. As AI continues to evolve at unprecedented speed, 
                  we're committed to being your most trusted guide in navigating this exciting landscape. 
                  We're constantly expanding our team, enhancing our platform, and developing new ways 
                  to help you discover and implement the AI tools that will shape the future of work and creativity.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Looking Forward</h4>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start space-x-3">
                    <span className="text-primary-600 mt-1">🚀</span>
                    <span>Expanding to 10,000+ reviewed AI tools by 2025</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-primary-600 mt-1">🌍</span>
                    <span>Launching localized versions for major global markets</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-primary-600 mt-1">🤖</span>
                    <span>Developing AI-powered personalized recommendations</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-primary-600 mt-1">🏢</span>
                    <span>Creating enterprise solutions for large organizations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join the AI Tools Insights Community
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Be part of the AI revolution. Discover cutting-edge tools, share your experiences, 
            connect with like-minded professionals, and stay ahead of the curve in the rapidly evolving AI landscape.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
            <div className="bg-white bg-opacity-10 rounded-lg p-4 text-white">
              <div className="text-2xl font-bold">2.5K+</div>
              <div className="text-sm text-primary-100">Tools Reviewed</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 text-white">
              <div className="text-2xl font-bold">100K+</div>
              <div className="text-sm text-primary-100">Active Users</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 text-white">
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm text-primary-100">Countries Served</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Get in Touch
            </a>
            <a
              href="/blog"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
            >
              Read Our Blog
            </a>
            <a
              href="/ai-tools"
              className="inline-flex items-center justify-center px-8 py-3 bg-transparent text-white font-medium rounded-lg border-2 border-primary-300 hover:bg-primary-300 hover:text-primary-700 transition-colors"
            >
              Explore Tools
            </a>
          </div>
          
          <div className="mt-8 pt-8 border-t border-primary-300">
            <p className="text-primary-100 text-sm">
              Have questions about AI Tools Insights or want to partner with us?{' '}
              <a href="mailto:hello@aitoolsinsights.com" className="text-white hover:underline font-medium">
                hello@aitoolsinsights.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}