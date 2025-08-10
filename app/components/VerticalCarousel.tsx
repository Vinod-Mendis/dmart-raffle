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

  // Auto-play effect with smooth casino-style rolling
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

    // Calculate smooth transition duration based on autoPlayInterval
    // For fast intervals (casino effect), use shorter transitions
    // For slow intervals, use longer transitions for smoothness
    const transitionDuration = Math.max(autoPlayInterval * 0.8, 50); // At least 50ms, max 80% of interval

    // Check if we should apply uniform blur (fast rolling effect)
    const isFastRolling = autoPlayInterval <= 200;
    const uniformBlurAmount = 8; // Consistent blur for fast rolling

    if (!isVisible && !isActive) {
      return {
        className: "opacity-0",
        fontSize: 16, // Base font size for invisible items
        transform: `translateY(${placement}px)`,
        blur: isFastRolling ? uniformBlurAmount : 0,
        transitionDuration,
      };
    }

    if (isActive) {
      return {
        className: "opacity-100 text-violet-300 font-bold",
        fontSize: 72, // ← ACTIVE ITEM SIZE - Change this for middle item (pixels)
        transform: `translateY(${placement}px)`,
        blur: isFastRolling ? uniformBlurAmount : 0, // Blur middle text if fast rolling
        transitionDuration,
      };
    }

    // Smooth progressive sizing based on distance from active item
    // Using mathematical interpolation for smooth transitions
    const maxFontSize = 72; // Active item font size
    const minFontSize = 20; // Furthest visible item font size
    const maxDistance = 5; // Maximum distance we care about for sizing

    // Clamp distance to maxDistance for consistent behavior
    const clampedDistance = Math.min(distance, maxDistance);

    // Calculate font size using exponential decay for smoother transitions
    const fontSizeRatio = Math.pow(0.7, clampedDistance); // 0.7 creates a nice decay curve
    const fontSize = Math.max(minFontSize, maxFontSize * fontSizeRatio);

    // Calculate opacity with smooth decay
    const opacityRatio = Math.pow(0.8, clampedDistance);
    const opacity = Math.max(0.15, opacityRatio);

    // Calculate blur - uniform for fast rolling, progressive for slow rolling
    const blurAmount = isFastRolling
      ? uniformBlurAmount
      : Math.min(clampedDistance * 3, 15);

    return {
      className: `text-white font-medium`,
      fontSize: Math.round(fontSize),
      opacity,
      transform: `translateY(${placement}px)`,
      blur: blurAmount,
      transitionDuration,
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
                      "absolute flex items-center justify-center text-center whitespace-nowrap",
                      styles.className
                    )}
                    key={item.id}
                    style={{
                      transform: styles.transform,
                      fontSize: `${styles.fontSize}px`,
                      opacity: styles.opacity,
                      filter: `blur(${styles.blur}px)`,
                      transition: `all ${styles.transitionDuration}ms linear`, // Linear for casino effect, dynamic duration
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
