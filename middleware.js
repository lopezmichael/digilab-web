export default function middleware(request) {
  const url = new URL(request.url);

  // Server-side cookie storage endpoint — sets cookies via Set-Cookie header
  // so Safari ITP treats them as server-set (immune to JS cookie eviction)
  if (url.hostname === 'app.digilab.cards' && url.pathname === '/__storage') {
    return handleStorageRequest(request);
  }

  // Subdomain routing: app.digilab.cards → /app page
  if (url.hostname === 'app.digilab.cards' && (url.pathname === '/' || url.pathname === '')) {
    url.pathname = '/app';
    return fetch(url, request).then(function(response) {
      return refreshDigilabCookies(request, response);
    });
  }
}

/**
 * Re-set digilab_* cookies as server-set cookies via Set-Cookie headers.
 *
 * Safari ITP evicts client-side (document.cookie) storage for
 * app.digilab.cards because all user interaction goes to the cross-origin
 * Shiny iframe — Safari doesn't count it as "user interaction" with the
 * top-level page. Server-set cookies (via Set-Cookie header) are not
 * subject to this eviction.
 *
 * The JS storage bridge in app.astro writes cookies via document.cookie.
 * This middleware reads them back from the request and re-sets them in the
 * response, "promoting" them to server-set cookies on every page load.
 */
function refreshDigilabCookies(request, response) {
  var cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return response;

  // Find all digilab_ cookies
  var cookies = cookieHeader.split(';');
  var digilabCookies = [];
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.startsWith('digilab_')) {
      digilabCookies.push(cookie);
    }
  }

  if (digilabCookies.length === 0) return response;

  // Clone response so we can add headers
  var newResponse = new Response(response.body, response);

  // Re-set each digilab_ cookie as a server-set cookie
  var maxAge = 31536000; // 1 year
  for (var j = 0; j < digilabCookies.length; j++) {
    var parts = digilabCookies[j].split('=');
    var name = parts[0];
    var value = parts.slice(1).join('='); // handle values with = in them
    newResponse.headers.append(
      'Set-Cookie',
      name + '=' + value + '; Domain=.digilab.cards; Path=/; Max-Age=' + maxAge + '; SameSite=Lax; Secure'
    );
  }

  return newResponse;
}

/**
 * Handle POST /__storage requests to set/remove cookies server-side.
 *
 * Safari ITP caps JavaScript-set cookies (document.cookie) to 7 days and
 * may evict them on browser close for "non-interactive" domains. Cookies
 * set via Set-Cookie response headers are exempt from this restriction.
 *
 * Body: { action: 'set'|'remove', key: string, value?: string }
 */
function handleStorageRequest(request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  return request.json().then(function(body) {
    var key = body.key;
    if (!key || !key.startsWith('digilab_')) {
      return new Response('Invalid key', { status: 400 });
    }

    var headers = new Headers({ 'Content-Type': 'application/json' });

    if (body.action === 'set' && body.value !== undefined) {
      headers.append(
        'Set-Cookie',
        key + '=' + encodeURIComponent(body.value)
          + '; Domain=.digilab.cards; Path=/; Max-Age=31536000; SameSite=Lax; Secure'
      );
    } else if (body.action === 'remove') {
      headers.append(
        'Set-Cookie',
        key + '=; Domain=.digilab.cards; Path=/; Max-Age=0; SameSite=Lax; Secure'
      );
    } else {
      return new Response('Invalid action', { status: 400 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: headers });
  }).catch(function() {
    return new Response('Bad request', { status: 400 });
  });
}

export const config = {
  matcher: ['/', '/__storage'],
};
