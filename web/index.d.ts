/// <reference types="@typesspotify-api" />
/// <reference types="@types/react" />
/// <reference types="@types/react-select" />
/// <reference types="./genius.d.ts" />
/// <reference types="./spottydata.d.ts" />

declare module '*.png'

// extend window for
// gtag
declare global {
  interface Window {
    gtag?: any
  }
}
