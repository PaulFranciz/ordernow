"use client";

import React, { useState, useEffect } from "react";
import { FlipWords } from "../ui/flip-words";
import { CloudinaryImage } from "../ui/cloudinary-image";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export function Hero() {
  const words = ["Now", "Today", "Fresh", "Fast"];
  const images = [
    "https://res.cloudinary.com/djx3im1eb/image/upload/v1740562822/IMG_1945_ndrigs.heic",
    "https://res.cloudinary.com/djx3im1eb/image/upload/v1740562801/IMG_1934_not8d3.heic",
    "https://res.cloudinary.com/djx3im1eb/image/upload/v1740562780/IMG_1915_tor1mu.heic",
  ];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 1,
      scale: 1.1,
      zIndex: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 1,
      scale: 1.1,
      zIndex: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setCurrentImageIndex((prev) => (prev + newDirection + images.length) % images.length);
  };

  const direction = 1;

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-white/[0.2]">
        <div className="absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute h-[800px] w-[800px] bg-gradient-radial from-[#BF9B30]/10 to-transparent -top-1/2 left-1/4 -translate-x-1/2"
      />

      {/* Content container */}
      <div className="relative min-h-screen flex flex-col lg:flex-row">
        {/* Mobile image section */}
        <div className="lg:hidden relative w-full h-[50vh] overflow-hidden">
          <div className="absolute inset-0 bg-black/20" /> {/* Permanent dark overlay */}
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentImageIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                scale: { duration: 0.5 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute inset-0 will-change-transform"
            >
              <CloudinaryImage
                src={images[currentImageIndex]}
                alt={`Featured dish ${currentImageIndex + 1}`}
                width={800}
                height={800}
                className="object-cover h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
            </motion.div>
          </AnimatePresence>

          {/* Mobile image indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  index === currentImageIndex ? "bg-[#BF9B30] w-6" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Text section */}
        <div className="w-full lg:w-[55%] relative z-20 flex items-center justify-center py-12 lg:py-20 px-4 lg:px-12">
          <div className="max-w-2xl space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight text-white text-center lg:text-left"
            >
              Savor Excellence
              <br />
              <span className="inline-flex items-center justify-center lg:justify-start">
                <span className="text-white">Order</span>{" "}
                <FlipWords
                  words={words}
                  duration={3000}
                  className="bg-clip-text text-transparent bg-gradient-to-b from-[#BF9B30] to-[#A67B0B] ml-4"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl lg:text-2xl text-neutral-400 text-center lg:text-left"
            >
              Dine in, order online, or make a reservation. Experience gourmet dining your way, with delivery in under 30 minutes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4 justify-center lg:justify-start"
            >
              <Button 
                className="bg-[#BF9B30] hover:bg-[#A67B0B] text-black h-12 px-8 rounded-full text-lg"
                onClick={() => router.push('/order')}
              >
                Order Now
              </Button>
              <Button variant="outline" className="border-[#BF9B30] text-[#BF9B30] hover:bg-[#BF9B30]/10 h-12 px-8 rounded-full text-lg">
                Our Menu
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Desktop image section */}
        <div className="hidden lg:block absolute top-0 right-0 w-[50%] h-full overflow-hidden">
          <div className="absolute top-0 left-0 w-[150px] h-full bg-black transform -skew-x-6 -translate-x-1/2 z-10" />
          <div className="absolute inset-0 bg-black/20" /> {/* Permanent dark overlay */}
          
          <div className="relative h-full w-full">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={currentImageIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  scale: { duration: 0.5 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="absolute inset-0 will-change-transform"
              >
                <CloudinaryImage
                  src={images[currentImageIndex]}
                  alt={`Featured dish ${currentImageIndex + 1}`}
                  width={1200}
                  height={1600}
                  className="object-cover h-full w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Desktop image indicators */}
            <div className="absolute bottom-8 right-8 flex gap-2 z-20">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    index === currentImageIndex ? "bg-[#BF9B30] w-6" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center lg:left-[27.5%]"
      >
        <div className="w-6 h-10 rounded-3xl border-2 border-[#BF9B30] flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 bg-[#BF9B30] rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}