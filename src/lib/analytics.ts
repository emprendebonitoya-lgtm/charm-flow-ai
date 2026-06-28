// Google Analytics 4 implementation
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export function initGA() {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;

  // Load gtag.js script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function (...args: any[]) {
    (window.dataLayer = window.dataLayer || []).push(args);
  };

  // Configure GA4
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
}

export function trackEvent(eventName: string, parameters?: Record<string, any>) {
  if (!window.gtag || !GA_MEASUREMENT_ID) return;
  window.gtag('event', eventName, parameters);
}

export function trackPageView(path: string) {
  if (!window.gtag || !GA_MEASUREMENT_ID) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: document.title,
  });
}

export function trackConversion(eventName: string, value?: number) {
  if (!window.gtag || !GA_MEASUREMENT_ID) return;
  window.gtag('event', eventName, {
    value: value,
    currency: 'USD',
  });
}
