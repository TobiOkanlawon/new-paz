import React, { useState, useEffect, useRef } from 'react';

// Fixed CardScrollIndicator Component
interface CardScrollIndicatorProps {
  totalCards: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  activeColor?: string;
  inactiveColor?: string;
}

const CardScrollIndicator: React.FC<CardScrollIndicatorProps> = ({
  totalCards,
  containerRef,
  activeColor = '#3b82f6',
  inactiveColor = '#cbd5e1',
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    if (!containerRef?.current) return;
    const container = containerRef.current;

    const handleScroll = (): void => {
      // Simple calculation based on scroll position
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.offsetWidth; // Each card takes full container width
      const currentIndex = Math.round(scrollLeft / cardWidth);
      
      // Ensure index is within bounds
      const validIndex = Math.max(0, Math.min(currentIndex, totalCards - 1));
      
      console.log('Scroll Left:', scrollLeft, 'Card Width:', cardWidth, 'Index:', validIndex);
      setActiveIndex(validIndex);
    };

    // Add scroll listener
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, totalCards]);

  const indicatorContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    marginTop: '16px',
    gap: '.7rem',
  };

  const getDotStyle = (isActive: boolean): React.CSSProperties => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: isActive ? activeColor : inactiveColor,
    transition: 'all 0.3s ease',
    transform: isActive ? 'scale(1.1)' : 'scale(1)',
    cursor: 'pointer',
  });

  const handleDotClick = (index: number) => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const cardWidth = container.offsetWidth;
    const scrollLeft = index * cardWidth;
    
    container.scrollTo({ 
      left: scrollLeft, 
      behavior: 'smooth' 
    });
  };

  return (
    <div style={indicatorContainerStyle}>
      {Array.from({ length: totalCards }).map((_, index) => (
        <div
          key={index}
          style={getDotStyle(activeIndex === index)}
          onClick={() => handleDotClick(index)}
        />
      ))}
    </div>
  );
};

export default CardScrollIndicator