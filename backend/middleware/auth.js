// JWT verification for Cloudflare Workers
const verifyToken = async (token, secret = 'fallback_secret') => {
  try {
    const [headerEncoded, payloadEncoded, signatureEncoded] = token.split('.');

    // Verify signature
    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerEncoded}.${payloadEncoded}`);
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const signature = new Uint8Array(
      Array.from(atob(signatureEncoded)).map(c => c.charCodeAt(0))
    );

    const isValid = await crypto.subtle.verify('HMAC', key, signature, data);

    if (!isValid) {
      throw new Error('Invalid token signature');
    }

    // Decode payload
    const payload = JSON.parse(atob(payloadEncoded));

    // Check expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired');
    }

    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

const auth = async (request) => {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ message: 'No token, authorization denied' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = await verifyToken(token, process.env.JWT_SECRET);

    // Add user ID to request object
    request.userId = decoded.userId;

    return null; // Success, continue to next handler
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Token is not valid' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export default auth;

