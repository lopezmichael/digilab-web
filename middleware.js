export default function middleware(request) {
  const url = new URL(request.url);

  if (url.hostname === 'app.digilab.cards' && (url.pathname === '/' || url.pathname === '')) {
    url.pathname = '/app';
    return fetch(url, request);
  }
}

export const config = {
  matcher: '/',
};
