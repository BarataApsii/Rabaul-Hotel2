import 'next';

declare module 'next' {
  /**
   * Page props for App Router pages
   */
  export type PageProps<
    TParams extends Record<string, string> = Record<string, never>,
    TSearchParams extends Record<string, string | string[]> = Record<string, never>
  > = {
    params: TParams;
    searchParams: TSearchParams;
  };

  /**
   * GenerateMetadata function type
   */
  export type GenerateMetadataProps<TParams = Record<string, never>> = {
    params: TParams;
    searchParams: { [key: string]: string | string[] | undefined };
  };

  /**
   * GenerateStaticParams function return type
   */
  export type GenerateStaticParams<TParams = Record<string, never>> = Array<{
    params: TParams;
  }>;
}

declare module 'next/link' {
  import { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';
  
  export type LinkProps = Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, 'href'> & {
    href: string | URL;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
  };

  const Link: React.FC<LinkProps>;
  export default Link;
}

declare module 'next/image' {
  import { ImgHTMLAttributes } from 'react';

  export type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'ref' | 'width' | 'height' | 'loading'> & {
    src: string | StaticImport;
    width?: number;
    height?: number;
    alt: string;
    fill?: boolean;
    loader?: ImageLoader;
    quality?: number | string;
    priority?: boolean;
    loading?: 'eager' | 'lazy';
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    unoptimized?: boolean;
    onLoadingComplete?: (img: HTMLImageElement) => void;
  };

  const Image: React.FC<ImageProps>;
  export default Image;
}

// Additional type definitions for Next.js 15.5.3
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      // Use an index signature for NEXT_PUBLIC_* variables
      [key: `NEXT_PUBLIC_${string}`]: string | undefined;
    }
  }
}