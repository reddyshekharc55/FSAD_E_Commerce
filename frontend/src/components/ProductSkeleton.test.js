import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductSkeleton from './ProductSkeleton';

describe('ProductSkeleton Component', () => {
  test('renders correct number of skeleton cards', () => {
    const { container } = render(<ProductSkeleton count={4} />);
    const skeletonCards = container.querySelectorAll('.product-card.skeleton');
    
    expect(skeletonCards).toHaveLength(4);
  });

  test('renders default 8 skeleton cards when count not provided', () => {
    const { container } = render(<ProductSkeleton />);
    const skeletonCards = container.querySelectorAll('.product-card.skeleton');
    
    expect(skeletonCards).toHaveLength(8);
  });

  test('renders skeleton elements correctly', () => {
    const { container } = render(<ProductSkeleton count={1} />);
    
    expect(container.querySelector('.skeleton-image')).toBeInTheDocument();
    expect(container.querySelector('.skeleton-title')).toBeInTheDocument();
    expect(container.querySelector('.skeleton-rating')).toBeInTheDocument();
    expect(container.querySelector('.skeleton-price')).toBeInTheDocument();
    expect(container.querySelector('.skeleton-button')).toBeInTheDocument();
  });
});
