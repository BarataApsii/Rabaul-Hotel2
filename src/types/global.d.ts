// Extend the Window interface to include the grecaptcha property
declare global {
  interface Window {
    grecaptcha: {
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      // Add other grecaptcha methods if needed
    };
  }
}

export {}; // This file needs to be a module
