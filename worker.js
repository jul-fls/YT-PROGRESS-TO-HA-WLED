async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    // Handle CORS preflight request.
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } else {
    // Parse the original URL
    const url = new URL(request.url);

    // Get the `url` parameter
    const targetUrl = url.searchParams.get('url');

    // Create a new request with the target URL
    const newRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    // Perform the fetch operation
    let response = await fetch(newRequest);
    let newHeaders = new Headers(response.headers);

    newHeaders.set('Access-Control-Allow-Origin', '*');
    newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    newHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    let newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });

    return newResponse;
  }
}


export default {
  async fetch(request, env, ctx) {
    return handleRequest(request);
  },
}
