namespace NodeJS {
  interface ProcessEnv {
    // Next.js built-in environment variables
    NODE_ENV: 'development' | 'production' | 'test';
    
    // WordPress configuration
    NEXT_PUBLIC_WORDPRESS_URL: string;
    NEXT_PUBLIC_SITE_URL: string;
    
    // Add other environment variables as needed
  }
}
