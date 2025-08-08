/** @format */
"use client";

import { useRef, useState } from "react";
import VerticalCarousel from "./components/VerticalCarousel";
import { AnimatePresence, motion } from "motion/react";
import ConfettiComponent from "./components/ConfettiComponent";
import FloatingStars from "./components/FloatingStars";

const carouselData = [
  {
    id: 1,
    text: "Urban Threads Boutique",
    category: "Clothing & Fashion",
    image:
      "https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg",
  },
  {
    id: 2,
    text: "The Golden Harvest Market",
    category: "Grocery & Organic Foods",
    image:
      "https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg",
  },
  {
    id: 3,
    text: "Pixel & Paper Creative Studio",
    category: "Design & Printing",
    image:
      "https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg",
  },
  {
    id: 4,
    text: "Fresh Bloom Floral Designs",
    category: "Florist",
    image:
      "https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg",
  },
  {
    id: 5,
    text: "Luxe Lane Fashion & Accessories",
    category: "Clothing & Fashion",
    image:
      "https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg",
  },
  {
    id: 6,
    text: "Brew & Bite Artisan Café",
    category: "Café & Bakery",
    image:
      "https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg",
  },
  {
    id: 7,
    text: "The Gear Garage Workshop",
    category: "Automotive & Tools",
    image:
      "https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg",
  },
  {
    id: 8,
    text: "Luxe Lane Fashion & Accessories",
    category: "Clothing & Fashion",
    image:
      "https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg",
  },
  {
    id: 9,
    text: "Brew & Bite Artisan Café",
    category: "Café & Bakery",
    image:
      "https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg",
  },
  {
    id: 10,
    text: "The Gear Garage Workshop",
    category: "Automotive & Tools",
    image:
      "https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg",
  },
];

export default function MyPage() {
  const [status, setStatus] = useState("raffle");
  const [showWinnerDetails, setShowWinnerDetails] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState(carouselData[0]);
  const handleItemSelect = (item: any, index: number) => {
    console.log(`Selected: ${item.text} at index ${index}`);
  };

  const confettiRef = useRef(null);

  const handleConfettiClick = () => {
    confettiRef.current?.trigger();
  };

  const handleShowRaffle = () => {
    setStatus("raffle");
    // setSelectedWinner({})
    setShowWinnerDetails(false);
  };
  const handleShowWinner = () => {
    setStatus("winner-name");
    // setSelectedWinner({})
    setShowWinnerDetails(false);
    handleConfettiClick();
  };
  const handleShowWinnerDetails = () => {
    // setSelectedWinner({})
    setShowWinnerDetails(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <FloatingStars starCount={100} animationSpeed={1} />
      <ConfettiComponent ref={confettiRef} />
      {/* Blur shadow blob */}
      <div className="w-[45rem] h-52 bg-white/20 rounded-full blur-3xl absolute z-10"></div>
      {/* logo */};
      <AnimatePresence>
        {status === "raffle" && (
          <motion.div
            key="raffle-logo"
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute w-52 h-auto aspect-square z-30 top-20">
            <img
              src="/images/dmart-logo-1.png"
              alt="logo"
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Background image */}
      <div className="w-full h-screen absolute inset-0 z-0">
        <img
          src="/images/background-2.png"
          alt="background image"
          className="w-full h-full object-fill object-center"
        />
      </div>
      {/* Golden frame */}
      <div className="w-full h-screen absolute inset-0 z-10">
        <img
          src="/images/golden-frame.png"
          alt="golden-frame"
          className="w-full h-full object-fill"
        />
      </div>
      {/* Controls */}
      <div className="bg-slate-400 p-4 absolute top-4 left-4 flex flex-col gap-4 z-50">
        <button
          className="rounded-md p-2 bg-yellow-400 cursor-pointer hover:scale-95 transition"
          onClick={handleShowRaffle}>
          raffle
        </button>
        <button
          className="rounded-md p-2 bg-blue-400 cursor-pointer hover:scale-95 transition"
          onClick={handleShowWinner}>
          Show name
        </button>
        <button
          className="rounded-md p-2 bg-pink-400 cursor-pointer hover:scale-95 transition"
          onClick={handleShowWinnerDetails}>
          Show details
        </button>
      </div>
      {/* Raffle */}
      {status === "raffle" && (
        <VerticalCarousel
          data={carouselData}
          onItemSelect={handleItemSelect}
          autoPlayInterval={400}
        />
      )}
      {status === "winner-name" && (
        <motion.div className="flex flex-col gap-4 relative z-30">
          <AnimatePresence>
            {showWinnerDetails && (
              <motion.div
                key="winner-image"
                className="w-96 h-96 rounded-xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                layout // animates space changes
              >
                <motion.img
                  src="https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"
                  alt="carousel"
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.h1
            key="winner-text"
            className="text-8xl font-semibold text-yellow-400"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            layout // lets the name move down smoothly when image appears
          >
            {selectedWinner.text}
          </motion.h1>

          <AnimatePresence>
            {showWinnerDetails && (
              <motion.h1
                key="winner-category"
                className="text-4xl text-amber-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                layout>
                {selectedWinner.category}
              </motion.h1>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
