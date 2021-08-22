export interface GAEventData {
  action: string,
  category: string,
  label: string,
  value: string | number
}

// log the pageview with their URL
export const pageview = (url: string) => {
   window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
     page_path: url,
   })
 }
  
// log specific events happening.
export const event = (eventData: GAEventData) => {
  window.gtag('event', eventData.action, {
    'event_category': eventData.category,
    'event_label': eventData.label,
    'value': eventData.value
  })
}