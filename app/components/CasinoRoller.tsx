/** @format */

import React, { useState, useEffect } from "react";

interface CasinoRollerProps {
  isSpeedUp: boolean;
  isStopped: boolean;
  selectedNumber: number[]; // Array of numbers like [2, 0, 0, 4]
}

const CasinoRoller: React.FC<CasinoRollerProps> = ({
  isSpeedUp,
  isStopped,
  selectedNumber,
}) => {
  return (
    <div className="relative z-50 flex flex-col items-center justify-center">
      <div
        className={`flex gap-2 bg-black p-6 rounded-lg shadow-2xl transition-all duration-1000 neon-flow ${
          isStopped ? "scale-110 shadow-violet-400/50 animate-pulse" : ""
        }`}>
        {[0, 1, 2, 3].map((index) => (
          <DigitColumn
            key={index}
            columnIndex={index} // Add unique index for each column
            isSpeedUp={isSpeedUp}
            isStopped={isStopped}
            targetDigit={selectedNumber[index]}
          />
        ))}
      </div>
    </div>
  );
};

const DigitColumn: React.FC<{
  columnIndex: number; // Add column index prop
  isSpeedUp: boolean;
  isStopped: boolean;
  targetDigit: number;
}> = ({ columnIndex, isSpeedUp, isStopped, targetDigit }) => {
  const [offset, setOffset] = useState(columnIndex * 3); // Start each column at different position

  useEffect(() => {
    if (isStopped) {
      // When stopped, show the target digit
      setOffset(targetDigit);
      return;
    }

    const intervalTime = isSpeedUp ? 30 : 200; // Fast: 30ms, Normal: 200ms

    const intervalId = setInterval(() => {
      setOffset((prev) => prev + 1);
    }, intervalTime);

    return () => clearInterval(intervalId);
  }, [isSpeedUp, isStopped, targetDigit]);

  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="relative w-16 text-center flex flex-col items-center h-20 bg-white border-2 border-violet-300 overflow-hidden rounded">
      <div
        className={`absolute flex flex-col transition-all ${
          isStopped ? "ease-out duration-500" : "ease-linear duration-75"
        }`}
        style={{
          transform: `translateY(-${(offset % 20) * 80}px)`, // Use modulo 20 for seamless loop
        }}>
        {/* Create two sets of digits for seamless looping */}
        {[...digits, ...digits].map((digit, index) => (
          <div
            key={index}
            className={`h-20 flex items-center text-center bg-white justify-center text-4xl font-black transition-all duration-500 ${
              isStopped ? "text-violet-500 scale-110" : "text-black"
            }`}>
            {digit}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CasinoRoller;
