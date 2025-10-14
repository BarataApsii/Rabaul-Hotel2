import 'next';

declare module 'next' {
  export interface PageProps {
    params: { [key: string]: string };
    searchParams?: { [key: string]: string | string[] | undefined };
  }
}

declare module 'next/link' {
  import { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';
  
  export type LinkProps = DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > & {
    href: string;
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
