import React, { useState, useEffect } from 'react';
import fallbackWorkspaceImg from '../assets/images/mrs_hero_workspace_1792262853659.jpg';

interface ResilientImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  priority?: boolean;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className,
  onError,
  priority = false,
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackWorkspaceImg);

  useEffect(() => {
    setImgSrc(src || fallbackWorkspaceImg);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      onError={(e) => {
        if (imgSrc !== fallbackWorkspaceImg) {
          setImgSrc(fallbackWorkspaceImg);
        }
        onError?.(e);
      }}
      {...rest}
    />
  );
};
