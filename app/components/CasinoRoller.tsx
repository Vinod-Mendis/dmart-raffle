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
  //   const [isSpeedUp, setIsSpeedUp] = useState(false);
  //   const [isStopped, setIsStopped] = useState(false);
  //   const selectedNumber = [2, 0, 0, 4]; // The target number to show when stopped

  //   const speedUp = () => {
  //     setIsSpeedUp(true);
  //   };

  //   const slowDown = () => {
  //     setIsSpeedUp(false);
  //   };

  //   const stop = () => {
  //     setIsStopped(true);
  //   };

  //   const restart = () => {
  //     setIsStopped(false);
  //   };

  return (
    <div className="relative z-50 flex flex-col items-center justify-center">
      <div
        className={`flex gap-2 bg-black p-6 rounded-lg shadow-2xl transition-all duration-1000 neon-flow ${
          isStopped ? "scale-110 shadow-violet-400/50 animate-pulse" : ""
        }`}>
        {[0, 1, 2, 3].map((index) => (
          <DigitColumn
            key={index}
            isSpeedUp={isSpeedUp}
            isStopped={isStopped}
            targetDigit={selectedNumber[index]}
          />
        ))}
      </div>

      {/* {isStopped && (
        <div className="text-3xl font-bold text-yellow-300 mb-4 animate-bounce">
          🎉 WINNER! 🎉
        </div>
      )} */}

      {/* <div className="flex gap-4">
        {!isStopped ? (
          <>
            <button
              onClick={speedUp}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-lg transition-colors shadow-lg">
              SPEED UP
            </button>

            <button
              onClick={slowDown}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-lg transition-colors shadow-lg">
              SLOW DOWN
            </button>

            <button
              onClick={stop}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white text-xl font-bold rounded-lg transition-colors shadow-lg">
              STOP
            </button>
          </>
        ) : (
          <button
            onClick={restart}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-lg transition-colors shadow-lg">
            RESTART
          </button>
        )}
      </div> */}
    </div>
  );
};

const DigitColumn: React.FC<{
  isSpeedUp: boolean;
  isStopped: boolean;
  targetDigit: number;
}> = ({ isSpeedUp, isStopped, targetDigit }) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (isStopped) {
      // When stopped, show the target digit
      setOffset(targetDigit);
      return;
    }

    const intervalTime = isSpeedUp ? 30 : 200; // Fast: 30ms, Normal: 200ms

    const intervalId = setInterval(() => {
      setOffset((prev) => prev + 1); // Remove modulo - let it increment continuously
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

      {/* Winner sparkle effects */}
      {/* {isStopped && (
        <>
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping delay-100"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping delay-200"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pink delay-300"></div>
        </>
      )} */}
    </div>
  );
};

export default CasinoRoller;
