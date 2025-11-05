/**
 * Verifies a reCAPTCHA token with Google's reCAPTCHA API
 * @param token The reCAPTCHA token to verify
 * @returns Promise<boolean> Returns true if verification is successful
 */
export async function verifyRecaptcha(token: string): Promise<boolean> {
  // In development, skip verification if RECAPTCHA_SKIP_VERIFICATION is true
  if (process.env.NODE_ENV === 'development' && process.env['NEXT_PUBLIC_RECAPTCHA_SKIP_VERIFICATION'] === 'true') {
    console.warn('Skipping reCAPTCHA verification in development mode');
    return true;
  }

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY is not set in environment variables');
      return false;
    }

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
    });

    const data = await response.json();
    
    // Log the response for debugging (without sensitive data)
    console.log('reCAPTCHA verification result:', {
      success: data.success,
      score: data.score,
      action: data.action,
      hostname: data.hostname,
      timestamp: data.challenge_ts ? new Date(data.challenge_ts) : null,
    });

    // Verify the response
    if (!data.success) {
      console.error('reCAPTCHA verification failed:', data['error-codes']);
      return false;
    }

    // Optional: Check the score (if using reCAPTCHA v3)
    if (data.score !== undefined) {
      const minScore = parseFloat(process.env['RECAPTCHA_MIN_SCORE'] || '0.5');
      if (data.score < minScore) {
        console.warn(`reCAPTCHA score ${data.score} is below minimum threshold of ${minScore}`);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return false;
  }
}

/**
 * Client-side function to get a reCAPTCHA token
 * @param action The action name for reCAPTCHA v3
 * @returns Promise<string> The reCAPTCHA token
 */
export async function getRecaptchaToken(action: string): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('getRecaptchaToken can only be called on the client side');
  }

  if (!window.grecaptcha) {
    throw new Error('reCAPTCHA has not been loaded');
  }

  try {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) {
      throw new Error('NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set');
    }

    return await window.grecaptcha.execute(siteKey, { action });
  } catch (error) {
    console.error('Error getting reCAPTCHA token:', error);
    throw error;
  }
}
