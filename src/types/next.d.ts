import type { 
  GetStaticProps, 
  GetStaticPaths, 
  GetServerSideProps,
  NextPage,
  NextApiRequest,
  NextApiResponse,
  NextApiHandler
} from 'next';

declare global {
  // Extend NodeJS.ProcessEnv
  namespace NodeJS {
    interface ProcessEnv {
      // Node.js
      NODE_ENV: 'development' | 'production' | 'test';
      
      // Next.js environment variables
      [key: `NEXT_PUBLIC_${string}`]: string | undefined;
      NEXT_SHARP_PATH?: string;
      NEXT_TELEMETRY_DEBUG?: string;
      NEXT_TELEMETRY_DISABLED?: string;
      NEXT_PHASE?: string;
      NEXT_RUNTIME?: 'nodejs' | 'edge';
      
      // Other environment variables
      [key: string]: string | undefined;
    }
  }

  // Extend Window interface
  interface Window {
    // Google Analytics gtag function
    gtag?: (command: string, ...args: unknown[]) => void;
    // Google Tag Manager data layer
    dataLayer?: Array<Record<string, unknown>>;
  }
}

declare module 'next' {
  // Core Next.js types
  export * from 'next/types';
  
  // Page component type
  export type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: React.ReactElement) => React.ReactNode;
  };

  // API route types
  export type { NextApiRequest, NextApiResponse, NextApiHandler };

  // Data fetching types
  export type { GetStaticProps, GetStaticPaths, GetServerSideProps };

  // Image optimization types
  export interface StaticImageData {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
  }

  export interface StaticImport {
    default: StaticImageData;
  }

  export type ImageLoader = (p: {
    src: string;
    width: number;
    quality?: number;
  }) => string;
}

// CSS modules type declarations
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

// Image file type declarations
declare module '*.png' {
  const content: import('next').StaticImageData;
  export default content;
}

declare module '*.jpg' {
  const content: import('next').StaticImageData;
  export default content;
}

declare module '*.jpeg' {
  const content: import('next').StaticImageData;
  export default content;
}

declare module '*.gif' {
  const content: import('next').StaticImageData;
  export default content;
}

declare module '*.webp' {
  const content: import('next').StaticImageData;
  export default content;
}

declare module '*.ico' {
  const content: import('next').StaticImageData;
  export default content;
}

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;
  export default src;
}

declare module '*.svg?url' {
  const content: string;
  export default content;
}

declare module '*.svg?inline' {
  const content: string;
  export default content;
}

// Extend NodeJS.ProcessEnv
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Node.js
      NODE_ENV: 'development' | 'production' | 'test';
      
      // Next.js environment variables
      [key: `NEXT_PUBLIC_${string}`]: string | undefined;
      NEXT_SHARP_PATH?: string;
      NEXT_TELEMETRY_DEBUG?: string;
      NEXT_TELEMETRY_DISABLED?: string;
      NEXT_PHASE?: string;
      NEXT_RUNTIME?: 'nodejs' | 'edge';
      
      // Other environment variables
      [key: string]: string | undefined;
    }
  }
}

// Extend Window interface
declare global {
  interface Window {
    // Google Analytics gtag function
    gtag?: (command: string, ...args: unknown[]) => void;
    // Google Tag Manager data layer
    dataLayer?: Array<Record<string, unknown>>;
    // Add other global window properties as needed
  }
}

// CSS modules type declarations
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

// Image file type declarations
declare module '*.png' {
  const content: StaticImageData;
  export default content;
}

declare module '*.jpg' {
  const content: StaticImageData;
  export default content;
}

declare module '*.jpeg' {
  const content: StaticImageData;
  export default content;
}

declare module '*.gif' {
  const content: StaticImageData;
  export default content;
}

declare module '*.webp' {
  const content: StaticImageData;
  export default content;
}

declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}

// Other file type declarations
declare module '*.md' {
  const content: string;
  export default content;
}

declare module '*.mdx' {
  let MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
}