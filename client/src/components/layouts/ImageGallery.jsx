import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ImageGallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % images.length),
      4000
    );
    return () => clearInterval(interval);
  }, [images.length, isPaused]);

  if (!images || images.length === 0) return null;

  return (
    <div
      className="w-full h-72 md:h-96 bg-white rounded-xl shadow-md flex items-center justify-center relative overflow-hidden transition-colors"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Service example ${currentIndex + 1}`}
          className="object-cover w-full h-full absolute inset-0 transition-all"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6 }}
        />
      </AnimatePresence>
      <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full border-2 border-black transition-all ${index === currentIndex ? "bg-black " : "bg-white "}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;