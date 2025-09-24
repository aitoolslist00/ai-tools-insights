'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'



interface AnalyticsProps {
  googleAnalyticsId?: string
  googleTagManagerId?: string
  facebookPixelId?: string
  linkedInPartnerId?: string
  hotjarId?: string
  clarityId?: string
}

export default function AdvancedAnalytics({
  googleAnalyticsId = 'G-XXXXXXXXXX',
  googleTagManagerId = 'GTM-XXXXXXX',
  facebookPixelId = 'XXXXXXXXXX',
  linkedInPartnerId = 'XXXXXXX',
  hotjarId = 'XXXXXXX',
  clarityId = 'XXXXXXXXX'
}: AnalyticsProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track page views
    if (typeof window !== 'undefined') {
      // Google Analytics 4
      if (window.gtag) {
        window.gtag('config', googleAnalyticsId, {
          page_path: pathname,
        })
      }

      // Facebook Pixel
      if (window.fbq) {
        window.fbq('track', 'PageView')
      }

      // LinkedIn Insight Tag
      if (window.lintrk) {
        window.lintrk('track', { conversion_id: linkedInPartnerId })
      }
    }
  }, [pathname, searchParams, googleAnalyticsId, linkedInPartnerId])

  useEffect(() => {
    // Initialize tracking scripts
    if (typeof window === 'undefined') return

    // Google Tag Manager
    if (googleTagManagerId && !document.querySelector(`script[src*="${googleTagManagerId}"]`)) {
      const script = document.createElement('script')
      script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`
      script.async = true
      document.head.appendChild(script)

      script.onload = () => {
        window.dataLayer = window.dataLayer || []
        window.gtag = function gtag() {
          window.dataLayer!.push(arguments)
        }
        window.gtag('js', new Date())
        window.gtag('config', googleAnalyticsId, {
          page_title: document.title,
          page_location: window.location.href,
          send_page_view: true
        })
      }
    }

    // Facebook Pixel
    if (facebookPixelId && !window.fbq) {
      const fbScript = document.createElement('script')
      fbScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${facebookPixelId}');
        fbq('track', 'PageView');
      `
      document.head.appendChild(fbScript)
    }

    // LinkedIn Insight Tag
    if (linkedInPartnerId && !window.lintrk) {
      const linkedInScript = document.createElement('script')
      linkedInScript.innerHTML = `
        _linkedin_partner_id = "${linkedInPartnerId}";
        window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
        window._linkedin_data_partner_ids.push(_linkedin_partner_id);
        (function(l) {
        if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
        window.lintrk.q=[]}
        var s = document.getElementsByTagName("script")[0];
        var b = document.createElement("script");
        b.type = "text/javascript";b.async = true;
        b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
        s.parentNode.insertBefore(b, s);})(window.lintrk);
      `
      document.head.appendChild(linkedInScript)
    }

    // Hotjar
    if (hotjarId && !document.querySelector(`script[src*="hotjar"]`)) {
      const hotjarScript = document.createElement('script')
      hotjarScript.innerHTML = `
        (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${hotjarId},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `
      document.head.appendChild(hotjarScript)
    }

    // Microsoft Clarity
    if (clarityId && !document.querySelector(`script[src*="clarity"]`)) {
      const clarityScript = document.createElement('script')
      clarityScript.innerHTML = `
        (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${clarityId}");
      `
      document.head.appendChild(clarityScript)
    }
  }, [googleAnalyticsId, googleTagManagerId, facebookPixelId, linkedInPartnerId, hotjarId, clarityId])

  return null
}

// Custom event tracking functions
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters)
  }
  
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters)
  }
}

export const trackToolView = (toolName: string, category: string) => {
  trackEvent('view_item', {
    item_category: category,
    item_name: toolName,
    content_type: 'ai_tool'
  })
}

export const trackToolClick = (toolName: string, category: string, linkType: 'official' | 'affiliate') => {
  trackEvent('click', {
    item_category: category,
    item_name: toolName,
    link_type: linkType,
    content_type: 'ai_tool'
  })
}

export const trackSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount
  })
}

export const trackNewsletterSignup = (source: string) => {
  trackEvent('sign_up', {
    method: 'newsletter',
    source: source
  })
}

export const trackBlogRead = (articleTitle: string, category: string, readTime: string) => {
  trackEvent('read_article', {
    article_title: articleTitle,
    article_category: category,
    read_time: readTime
  })
}