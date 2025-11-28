import React from 'react';

export default function ImagePlaceholder({ src, alt, className, fallback }) {
  return (
    <img
      src={src || `https://images.unsplash.com/photo-${fallback || '1546069901-ba9599a7e63c'}?w=800&auto=format&fit=crop`}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        e.target.src = 'https://via.placeholder.com/800x600/10b981/ffffff?text=MealWell';
      }}
    />
  );
}
