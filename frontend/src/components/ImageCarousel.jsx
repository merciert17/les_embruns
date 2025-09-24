import React, { useRef, useEffect, useState } from 'react';

const ImageCarousel = ({ images, speed = 0.5 }) => {
  const containerRef = useRef(null);
  const scrollRef = useRef(0);
  const requestRef = useRef();
  const [visibleItems, setVisibleItems] = useState(4);
  const [autoScroll, setAutoScroll] = useState(true);
  const [imageHeight, setImageHeight] = useState('50vh');

  // Gestion responsive de la hauteur et du nombre d'images visibles
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;

      if (width < 640) {       // mobile
        setImageHeight('20vh');
        setVisibleItems(10);
      } else if (width < 1024) { // tablette
        setImageHeight('25vh');
        setVisibleItems(10);
      } else {                  // desktop
        setImageHeight('30vh');
        setVisibleItems(10);
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  // Défilement automatique
  useEffect(() => {
    if (!autoScroll) return;
    const container = containerRef.current;

    const animate = () => {
      if (!container) return;

      scrollRef.current += speed;
      if (scrollRef.current >= container.scrollWidth / 2) {
        scrollRef.current = 0;
      }

      container.style.transform = `translateX(-${scrollRef.current}px)`;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [speed, visibleItems, autoScroll]);

  // Largeur des images en fonction du nombre d'images visibles
  const imageWidth = 30 / visibleItems;

  return (
    <div className="relative w-full overflow-hidden" style={{ height: imageHeight }}>
      <div
        ref={containerRef}
        className="flex w-max h-full"
        style={{ transition: autoScroll ? 'none' : 'transform 0.5s' }}
      >
        {[...images, ...images].map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 overflow-hidden"
            style={{ width: `${imageWidth}%`, height: '100%' }}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
