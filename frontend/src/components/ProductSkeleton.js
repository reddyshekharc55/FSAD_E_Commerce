import React from 'react';
import './ProductSkeleton.css';

const ProductSkeleton = ({ count = 8 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="product-card skeleton">
          <div className="skeleton-image"></div>
          <div className="skeleton-info">
            <div className="skeleton-text skeleton-title"></div>
            <div className="skeleton-text skeleton-rating"></div>
            <div className="skeleton-text skeleton-price"></div>
            <div className="skeleton-button"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductSkeleton;
