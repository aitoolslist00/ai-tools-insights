declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
    fbq?: (...args: any[]) => void
    _linkedin_partner_id?: string
    lintrk?: (...args: any[]) => void
  }
}

export {}