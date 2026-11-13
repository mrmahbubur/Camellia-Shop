import React, { useState, useEffect } from 'react';
import fallbackWorkspaceImg from '../assets/images/mrs_hero_workspace_1792262853659.jpg';

interface ResilientImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className,
  onError,
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
      loading="lazy"
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
