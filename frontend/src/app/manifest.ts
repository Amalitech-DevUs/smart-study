import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SmartStudy: BECE Practice & Revision',
    short_name: 'SmartStudy',
    description:
      'Interactive exam practice, flashcards, AI study assistant, and structured learning for student success.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0e1726',
    theme_color: '#0e1726',
    orientation: 'portrait-primary',
    scope: '/',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
