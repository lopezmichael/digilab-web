import { next, rewrite } from '@vercel/edge';

export default function middleware(request) {
  const url = new URL(request.url);

  // Rewrite app.digilab.cards to serve the /app page
  if (url.hostname === 'app.digilab.cards') {
    // Let static assets (icons, manifest, etc.) pass through
    if (url.pathname !== '/' && url.pathname !== '') {
      return next();
    }
    // Rewrite root to /app
    url.pathname = '/app';
    return rewrite(url);
  }

  return next();
}

export const config = {
  matcher: '/',
};
