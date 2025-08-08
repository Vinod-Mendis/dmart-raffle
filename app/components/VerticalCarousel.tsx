/** @format */

"use client";

import React, { useState, useEffect } from "react";
import cn from "classnames";

// Type definitions
interface CarouselItem {
  id: string | number;
  text: string;
}

interface VerticalCarouselProps {
  data: CarouselItem[];
  onItemSelect?: (item: CarouselItem, index: number) => void;
  autoPlayInterval?: number;
}

const VerticalCarousel: React.FC<VerticalCarouselProps> = ({
  data,
  onItemSelect,
  autoPlayInterval = 1000,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Auto-play effect
  useEffect(() => {
    if (data.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const newIndex = prevIndex + 1 > data.length - 1 ? 0 : prevIndex + 1;

        if (onItemSelect) {
          onItemSelect(data[newIndex], newIndex);
        }

        return newIndex;
      });
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [data.length, autoPlayInterval, onItemSelect, data]);

  // Used to determine which items appear above the active item
  const halfwayIndex = Math.ceil(data.length / 2);

  // Used to determine the height/spacing of each item
  const itemHeight = 120; // ← ITEM SPACING - Increase this if you use larger text sizes (recommended: 80-200px)

  // Used to determine at what point an item is moved from the top to the bottom
  const shuffleThreshold = halfwayIndex * itemHeight;

  // Used to determine which items should be visible - INCREASED to show 3 items above and below
  const visibleStyleThreshold = itemHeight * 3.5; // Shows 3-4 items above and below the active item

  const determinePlacement = (itemIndex: number): number => {
    if (activeIndex === itemIndex) return 0;

    // Calculate the shortest path (forward or backward) for smooth infinite looping
    const totalItems = data.length;
    let distance = itemIndex - activeIndex;

    // Wrap around for infinite effect - choose shortest path
    if (distance > totalItems / 2) {
      distance = distance - totalItems;
    } else if (distance < -totalItems / 2) {
      distance = distance + totalItems;
    }

    return distance * itemHeight;
  };

  const getItemStyles = (itemIndex: number) => {
    const isActive = activeIndex === itemIndex;
    const placement = determinePlacement(itemIndex);

    // Calculate distance using the shortest path for infinite loop
    const totalItems = data.length;
    let distance = Math.abs(itemIndex - activeIndex);

    // Use shortest path for distance calculation
    if (distance > totalItems / 2) {
      distance = totalItems - distance;
    }

    const isVisible = Math.abs(placement) <= visibleStyleThreshold;

    if (!isVisible && !isActive) {
      return {
        className: "opacity-0",
        textSize: "",
        transform: `translateY(${placement}px)`,
        blur: "",
      };
    }

    if (isActive) {
      return {
        className: "opacity-100 text-yellow-600 font-bold",
        textSize: "text-7xl", // ← ACTIVE ITEM SIZE - Change this for middle item (options: text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, text-4xl, text-5xl, text-6xl, text-7xl, text-8xl, text-9xl)
        transform: `translateY(${placement}px)`,
        blur: "", // No blur for active item
      };
    }

    // Progressive sizing based on distance from active item
    let textSize = "";
    let opacity = "";
    let blur = "";

    switch (distance) {
      case 1:
        textSize = "text-5xl"; // ← 1 STEP AWAY SIZE - Change this for items next to middle
        opacity = "opacity-70";
        blur = "blur-sm"; // Light blur
        break;
      case 2:
        textSize = "text-4xl"; // ← 2 STEPS AWAY SIZE - Change this for items further out
        opacity = "opacity-50";
        blur = "blur-md"; // Medium blur
        break;
      case 3:
        textSize = "text-3xl"; // ← 3 STEPS AWAY SIZE - Change this for items even further
        opacity = "opacity-35";
        blur = "blur-lg"; // More blur
        break;
      case 4:
        textSize = "text-2xl"; // ← 4 STEPS AWAY SIZE - Now visible
        opacity = "opacity-25";
        blur = "blur-xl"; // Heavy blur
        break;
      default:
        textSize = "text-xl"; // ← 5+ STEPS AWAY SIZE - For any items beyond 4 steps
        opacity = "opacity-15";
        blur = "blur-2xl"; // Maximum blur
        break;
    }

    return {
      className: `${opacity} text-white font-medium transition-all duration-300 ${blur}`,
      textSize,
      transform: `translateY(${placement}px)`,
      blur,
    };
  };

  const handleItemClick = (index: number): void => {
    setActiveIndex(index);

    if (onItemSelect) {
      onItemSelect(data[index], index);
    }
  };

  return (
    <div className="flex justify-center items-center p-8 w-full relative z-30">
      <div className="flex flex-col items-center w-full max-w-6xl">
        <div className="flex flex-col items-center w-full">
          <div className="relative h-[800px] w-full overflow-hidden">
            {" "}
            {/* ← CONTAINER HEIGHT - Increased to accommodate more visible items */}
            <div className="relative h-full flex flex-col items-center justify-center">
              {data.map((item, i) => {
                const styles = getItemStyles(i);

                return (
                  <button
                    type="button"
                    onClick={() => handleItemClick(i)}
                    className={cn(
                      "absolute flex items-center justify-center transition-all duration-500 ease-in-out text-center whitespace-nowrap",
                      styles.className,
                      styles.textSize
                    )}
                    key={item.id}
                    style={{
                      transform: styles.transform,
                    }}
                    aria-label={`Select ${item.text}`}>
                    {item.text}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerticalCarousel;
