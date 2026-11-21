import React, { useState, useEffect } from 'react';
import fallbackWorkspaceImg from '../assets/images/mrs_hero_workspace_1792262853659.jpg';

const INLINE_SVG_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f8fafc'/%3E%3Crect x='140' y='85' width='120' height='95' rx='12' fill='%23e2e8f0'/%3E%3Ccircle cx='175' cy='118' r='12' fill='%2394a3b8'/%3E%3Cpath d='M150 168l36-32 24 22 18-16 22 26z' fill='%2394a3b8'/%3E%3Ctext x='200' y='218' font-family='system-ui,sans-serif' font-size='14' font-weight='600' text-anchor='middle' fill='%2364748b'%3EProduct Image%3C/text%3E%3C/svg%3E";

const DEFAULT_RESPONSIVE_SIZES =
  '(max-width: 480px) 92vw, (max-width: 767px) 46vw, (max-width: 1024px) 31vw, (max-width: 1440px) 23vw, 19vw';

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
  sizes,
  srcSet,
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackWorkspaceImg);

  useEffect(() => {
    setImgSrc(src || fallbackWorkspaceImg);
  }, [src]);

  const resolvedAlt = alt?.trim() || 'Partner store product photo';
  const resolvedSrcSet =
    srcSet || (imgSrc && !imgSrc.startsWith('data:') ? `${imgSrc} 1x` : undefined);

  return (
    <img
      src={imgSrc}
      srcSet={resolvedSrcSet}
      sizes={sizes || DEFAULT_RESPONSIVE_SIZES}
      alt={resolvedAlt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      onError={(e) => {
        if (imgSrc !== fallbackWorkspaceImg && imgSrc !== INLINE_SVG_PLACEHOLDER) {
          setImgSrc(fallbackWorkspaceImg);
        } else if (imgSrc !== INLINE_SVG_PLACEHOLDER) {
          setImgSrc(INLINE_SVG_PLACEHOLDER);
        }
        onError?.(e);
      }}
      {...rest}
    />
  );
};
