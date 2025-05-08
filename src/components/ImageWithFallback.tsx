'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { FiImage } from 'react-icons/fi';

interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc?: string;
}

const ImageWithFallback = (props: ImageWithFallbackProps) => {
  const { src, fallbackSrc, alt, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleLoadingError = () => {
    if (hasError) return;
    
    if (fallbackSrc) {
        setImgSrc(fallbackSrc);
    } else {
      setHasError(true); 
    }
  };

  if (hasError || !imgSrc) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-500">
        <FiImage size="30%" /> 
      </div>
    );
  }

  return (
    <Image
      alt={alt}
      src={imgSrc}
      onError={handleLoadingError}
      {...rest}
    />
  );
};

export default ImageWithFallback; 