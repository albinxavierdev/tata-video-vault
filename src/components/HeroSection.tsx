import React, { useRef, useEffect } from 'react';

export const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden -mt-[1px]">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
        poster="/tata-logo.jpg"
      >
        <source 
          src="/intra-hero-video.mp4" 
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
        {/* Logo */}
        <img
          src="/hero-intra-logo.png"
          alt="Tata Intra Logo"
          className="w-80 md:w-96 lg:w-[500px] mb-8 drop-shadow-lg"
        />
        
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 drop-shadow-lg">
          Tata Intra, Happy Customers Stories
        </h1>
        <p className="text-xl md:text-2xl text-center max-w-2xl mb-8 drop-shadow-lg">
          Discover the success stories of our happy customers and their journey with Tata Intra
        </p>
        <div className="flex justify-center">
          <a
            href="/videos"
            className="px-12 py-5 bg-[#307FE2] text-white font-semibold rounded-md hover:bg-[#2b6fc7] transition-colors text-xl"
          >
            Customer Stories
          </a>
        </div>
      </div>
    </div>
  );
}; 