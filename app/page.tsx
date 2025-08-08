/** @format */
"use client";

import VerticalCarousel from "./components/VerticalCarousel";

const carouselData = [
  { id: 1, text: "Urban Threads Boutique" },
  { id: 2, text: "The Golden Harvest Market" },
  { id: 3, text: "Pixel & Paper Creative Studio" },
  { id: 4, text: "Fresh Bloom Floral Designs" },
  { id: 5, text: "Luxe Lane Fashion & Accessories" },
  { id: 6, text: "Brew & Bite Artisan Café" },
  { id: 7, text: "The Gear Garage Workshop" },
  { id: 8, text: "Luxe Lane Fashion & Accessories" },
  { id: 9, text: "Brew & Bite Artisan Café" },
  { id: 10, text: "The Gear Garage Workshop" },
];

export default function MyPage() {
  const handleItemSelect = (item: any, index: number) => {
    console.log(`Selected: ${item.text} at index ${index}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* <div className=" w-full  h-96 absolute top-0 z-10  backdrop-blur-[6px] blur-sm"></div>
      <div className=" w-full  h-96 absolute bottom-0 z-10  backdrop-blur-[6px] blur-sm"></div> */}
      {/* an overlay to avoid any pointer events */}
      <VerticalCarousel
        data={carouselData}
        onItemSelect={handleItemSelect}
        autoPlayInterval={500}
      />
    </div>
  );
}
