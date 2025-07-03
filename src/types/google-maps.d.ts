/// <reference types="@types/googlemaps" />

declare global {
  interface Window {
    google: typeof google;
  }
}