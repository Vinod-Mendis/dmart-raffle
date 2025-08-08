/** @format */
"use client";

import { useState } from "react";
import VerticalCarousel from "./components/VerticalCarousel";

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

  const handleShowRaffle = () => {
    setStatus("raffle");
    // setSelectedWinner({})
    setShowWinnerDetails(false);
  };
  const handleShowWinner = () => {
    setStatus("winner-name");
    // setSelectedWinner({})
    setShowWinnerDetails(false);
  };
  const handleShowWinnerDetails = () => {
    // setSelectedWinner({})
    setShowWinnerDetails(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-slate-400 p-4 absolute top-4 left-4 flex flex-col gap-4">
        <button
          className="rounded-md p-2 bg-yellow-400"
          onClick={handleShowRaffle}>
          raffle
        </button>
        <button
          className="rounded-md p-2 bg-blue-400"
          onClick={handleShowWinner}>
          Show name
        </button>
        <button
          className="rounded-md p-2 bg-pink-400"
          onClick={handleShowWinnerDetails}>
          Show details
        </button>
      </div>
      {status === "raffle" && (
        <VerticalCarousel
          data={carouselData}
          onItemSelect={handleItemSelect}
          autoPlayInterval={400}
        />
      )}

      {status === "winner-name" && (
        <div className="flex flex-col gap-4">
          {showWinnerDetails && (
            <div className="w-96 h-96 rounded-xl overflow-hidden">
              <img
                src="https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"
                alt="carousel"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <h1 className="text-8xl">{selectedWinner.text}</h1>
          {showWinnerDetails && (
            <h1 className="text-4xl">{selectedWinner.category}</h1>
          )}
        </div>
      )}
    </div>
  );
}
