import React, { useState, useEffect, useRef } from 'react';
import { ImageIcon } from 'lucide-react';

interface LazyImageProps {
  src: string | null;
  alt: string;
  className?: string;
  placeholder?: React.ReactNode;
}

export function LazyImage({ src, alt, className = '', placeholder }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => setError(true);

  const defaultPlaceholder = (
    <div className="flex items-center justify-center bg-gray-800 text-gray-400">
      <ImageIcon className="w-8 h-8" />
    </div>
  );

  if (error || !src) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-800`}>
        {placeholder || defaultPlaceholder}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={imgRef}>
      {!isLoaded && (
        <div className={`absolute inset-0 ${className} animate-pulse bg-gray-800`}>
          {placeholder || defaultPlaceholder}
        </div>
      )}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
}