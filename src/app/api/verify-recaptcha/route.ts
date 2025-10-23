import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize rate limiter (using in-memory for simplicity, consider Redis for production)
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
  analytics: true,
  prefix: 'ratelimit:recaptcha',
});

// Logging function
const log = (level: 'info' | 'warn' | 'error', message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...(data && { data }),
  };
  
  // In production, you might want to use a logging service
  console[level](JSON.stringify(logEntry));
};

export async function POST(request: Request) {
  const identifier = request.headers.get('x-forwarded-for') || 'unknown';
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier);
  
  // Set rate limit headers
  const headers = new Headers();
  headers.set('X-RateLimit-Limit', limit.toString());
  headers.set('X-RateLimit-Remaining', remaining.toString());
  headers.set('X-RateLimit-Reset', reset.toString());

  if (!success) {
    log('warn', 'Rate limit exceeded', { identifier });
    return new Response('Too Many Requests', {
      status: 429,
      headers: {
        ...Object.fromEntries(headers),
        'Retry-After': '60', // 1 minute
      },
    });
  }

  try {
    const { token } = await request.json();
    
    if (!token) {
      log('warn', 'Missing reCAPTCHA token');
      return NextResponse.json(
        { error: 'reCAPTCHA token is required' },
        { status: 400, headers: Object.fromEntries(headers) }
      );
    }

    // Basic token validation
    if (typeof token !== 'string' || token.length < 20 || token.length > 1000) {
      log('warn', 'Invalid reCAPTCHA token format', { tokenLength: token?.length });
      return NextResponse.json(
        { error: 'Invalid reCAPTCHA token' },
        { status: 400, headers: Object.fromEntries(headers) }
      );
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      log('error', 'RECAPTCHA_SECRET_KEY is not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500, headers: Object.fromEntries(headers) }
      );
    }

    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    let response;
    try {
      response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            secret: secretKey,
            response: token,
            remoteip: identifier,
          }),
          signal: controller.signal,
        }
      );
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        log('error', 'reCAPTCHA verification timeout');
        return NextResponse.json(
          { error: 'Verification timeout' },
          { status: 408, headers: Object.fromEntries(headers) }
        );
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      log('error', 'Failed to verify reCAPTCHA', { status: response.status });
      return NextResponse.json(
        { error: 'Failed to verify reCAPTCHA' },
        { status: 502, headers: Object.fromEntries(headers) } // Bad Gateway
      );
    }

    const data = await response.json();
    
    // Log the verification attempt (without sensitive data)
    log('info', 'reCAPTCHA verification attempt', {
      success: data.success,
      score: data.score,
      action: data.action,
      hostname: data.hostname,
      challenge_ts: data.challenge_ts,
      errorCodes: data['error-codes'] || []
    });

    if (!data.success) {
      return NextResponse.json(
        { 
          error: 'Failed reCAPTCHA verification',
          errorCodes: data['error-codes'] || []
        },
        { status: 400, headers: Object.fromEntries(headers) }
      );
    }

    // Optional: Add additional security checks
    const minScore = 0.5; // Adjust based on your needs
    if (data.score !== undefined && data.score < minScore) {
      log('warn', 'reCAPTCHA score too low', { score: data.score });
      return NextResponse.json(
        { error: 'Suspicious activity detected' },
        { status: 403, headers: Object.fromEntries(headers) }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        score: data.score,
        action: data.action,
        hostname: data.hostname,
      },
      { headers: Object.fromEntries(headers) }
    );
  } catch (error) {
    log('error', 'reCAPTCHA verification error', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          ...Object.fromEntries(new Headers(headers)),
          'Cache-Control': 'no-store, max-age=0',
        }
      }
    );
  }
}

// Add other HTTP methods to return 405 Method Not Allowed
export async function GET() {
  return new Response('Method Not Allowed', { 
    status: 405,
    headers: { 'Allow': 'POST' }
  });
}

export async function PUT() {
  return new Response('Method Not Allowed', { 
    status: 405,
    headers: { 'Allow': 'POST' }
  });
}

export async function DELETE() {
  return new Response('Method Not Allowed', { 
    status: 405,
    headers: { 'Allow': 'POST' }
  });
}

export async function PATCH() {
  return new Response('Method Not Allowed', { 
    status: 405,
    headers: { 'Allow': 'POST' }
  });
}
