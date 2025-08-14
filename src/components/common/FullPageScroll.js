import React, { useEffect, useRef, useState } from 'react';

const FullPageScroll = ({ children }) => {
  const containerRef = useRef(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let timeout;
    
    const handleWheel = (e) => {
      if (isScrolling) return;
      
      e.preventDefault();
      setIsScrolling(true);
      
      const container = containerRef.current;
      const sections = container.children;
      const direction = e.deltaY > 0 ? 1 : -1;
      
      let nextSection = currentSection + direction;
      nextSection = Math.max(0, Math.min(nextSection, sections.length - 1));
      
      if (nextSection !== currentSection) {
        sections[nextSection].scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        setCurrentSection(nextSection);
      }
      
      timeout = setTimeout(() => {
        setIsScrolling(false);
      }, 1200);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
      if (timeout) clearTimeout(timeout);
    };
  }, [currentSection, isScrolling]);

  return (
    <>
      <div 
        ref={containerRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      >
        {children}
      </div>
      
      {/* Navigation Dots */}
      <ScrollNavigation 
        currentSection={currentSection} 
        totalSections={React.Children.count(children)}
        onNavigate={(index) => {
          const container = containerRef.current;
          if (container && container.children[index]) {
            container.children[index].scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
            setCurrentSection(index);
          }
        }}
      />
    </>
  );
};

const FullPageSection = ({ children, className = '', id, ...props }) => {
  return (
    <section 
      id={id}
      className={`h-screen snap-start snap-always ${className}`} 
      {...props}
    >
      {children}
    </section>
  );
};

const ScrollNavigation = ({ currentSection, totalSections, onNavigate }) => {
  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
      <div className="flex flex-col space-y-3">
        {Array.from({ length: totalSections }).map((_, index) => (
          <button
            key={index}
            onClick={() => onNavigate(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSection
                ? 'bg-blue-500 scale-125 shadow-lg'
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 hover:scale-110'
            }`}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export { FullPageScroll, FullPageSection };
