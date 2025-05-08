'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';

interface VirtualizedListProps<T> {
  data: T[]; // Array of data to render
  renderItem: (item: T, index: number) => ReactNode; // Render function for each item
  itemHeight: number; // Fixed height of each item in pixels
  height?: number; // Height of the visible container
  width?: string | number; // Width of the list
  overscan?: number; // Number of items to render outside of the visible area (for smoother scrolling)
  className?: string; // Additional CSS classes
  onEndReached?: () => void; // Called when scrolling near the end
  endReachedThreshold?: number; // Threshold to trigger onEndReached (0-1, percentage of list height)
}

/**
 * A virtualized list component that efficiently renders large lists
 * Only renders items that are visible in the viewport (plus overscan)
 */
export default function VirtualizedList<T>({
  data,
  renderItem,
  itemHeight,
  height = 400,
  width = '100%',
  overscan = 3,
  className = '',
  onEndReached,
  endReachedThreshold = 0.8
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalHeight = data.length * itemHeight;
  
  // Calculate which items are visible
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    data.length - 1,
    Math.floor((scrollTop + height) / itemHeight) + overscan
  );
  
  // Handle scroll events
  const handleScroll = () => {
    const element = containerRef.current;
    if (element) {
      setScrollTop(element.scrollTop);
      
      // Check if we're near the end to trigger loading more
      if (onEndReached) {
        const scrollPercentage = 
          (element.scrollTop + element.clientHeight) / element.scrollHeight;
          
        if (scrollPercentage > endReachedThreshold) {
          onEndReached();
        }
      }
    }
  };
  
  // Add scroll event listener
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    
    element.addEventListener('scroll', handleScroll);
    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [onEndReached, endReachedThreshold]);
  
  // Generate the visible items
  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          top: `${i * itemHeight}px`,
          height: `${itemHeight}px`,
          width: '100%'
        }}
      >
        {renderItem(data[i], i)}
      </div>
    );
  }
  
  return (
    <div
      ref={containerRef}
      style={{
        height,
        width,
        overflow: 'auto',
        position: 'relative'
      }}
      className={className}
    >
      <div
        style={{
          height: `${totalHeight}px`,
          position: 'relative'
        }}
      >
        {visibleItems}
      </div>
    </div>
  );
} 