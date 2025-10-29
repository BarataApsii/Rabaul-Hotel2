import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface WordPressImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string;
  alt: string;
  width: number;
  height: number;
  quality?: number;
  priority?: boolean;
  unoptimized?: boolean;
  className?: string;
}

export function WordPressImage({
  src,
  alt,
  width,
  height,
  quality = 80,
  priority = false,
  unoptimized = false,
  className = '',
  ...props
}: WordPressImageProps) {
  const [imageError, setImageError] = useState(false);
  
  // If there's an error or no source, return a placeholder
  if (imageError || !src) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500">Image not available</span>
      </div>
    );
  }

  // Handle both relative and absolute URLs
  let imageUrl = src;
  
  if (!src) {
    setImageError(true);
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500">No image</span>
      </div>
    );
  }

  // If it's a relative path, make it absolute to the WordPress site
  if (src.startsWith('/') && !src.startsWith('//')) {
    // Use the WordPress site URL from environment variables or fallback
    const wpUrl = process.env['NEXT_PUBLIC_WORDPRESS_URL'] || '';
    imageUrl = `${wpUrl}${src}`;
  } else if (src.startsWith('http:')) {
    // Convert HTTP to HTTPS
    imageUrl = src.replace('http:', 'https:');
  }

  // Convert to HTTPS if needed and handle WordPress image URLs
  try {
    const url = new URL(imageUrl);
    // If this is a WordPress media URL, we can add size parameters
    if (url.pathname.includes('/wp-content/uploads/')) {
      // Remove any existing size parameters
      const pathParts = url.pathname.split('/');
      const fileName = pathParts.pop() || '';
      const fileNameParts = fileName.split('.');
      const extension = fileNameParts.pop() || '';
      const baseName = fileNameParts.join('.');
      
      // Get the closest WordPress size based on the requested width
      const wpSize = getWordPressSize(width);
      
      // If we're not using the original size, modify the URL
      if (wpSize) {
        const newFileName = `${baseName}-${wpSize}.${extension}`;
        pathParts.push(newFileName);
        url.pathname = pathParts.join('/');
        imageUrl = url.toString();
      }
    }
  } catch (e) {
    console.warn('Invalid image URL:', src);
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      <Image
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        unoptimized={unoptimized}
        onError={() => setImageError(true)}
        className="object-cover w-full h-full"
        {...props}
      />
    </div>
  );
}

// Helper function to determine the best WordPress image size
function getWordPressSize(requestedWidth: number): string | null {
  // Common WordPress image sizes
  const sizes = [
    { name: 'thumbnail', width: 150 },
    { name: 'medium', width: 300 },
    { name: 'medium_large', width: 768 },
    { name: 'large', width: 1024 },
    { name: '1536x1536', width: 1536 },
    { name: '2048x2048', width: 2048 },
  ];

  // Sort by width to ensure we're checking in order
  sizes.sort((a, b) => a.width - b.width);

  // Find the first size that's at least as large as requested
  const size = sizes.find(s => s.width >= requestedWidth);
  
  // If no size is large enough, return null to use the original
  return size ? size.name : null;
}
