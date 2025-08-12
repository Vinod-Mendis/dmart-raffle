/** @format */
"use client";

import { useEffect, useRef, useState } from "react";
import VerticalCarousel from "./components/VerticalCarousel";
import { AnimatePresence, motion } from "motion/react";
import ConfettiComponent from "./components/ConfettiComponent";
import FloatingStars from "./components/FloatingStars";
import LoaderSVG from "./components/LoaderSVG";
import io from "socket.io-client";
import CasinoRoller from "./components/CasinoRoller";

export default function MyPage() {
  const [showRaflle, setShowRaflle] = useState(false);
  const [status, setStatus] = useState("IDLE");
  const [preloadedBlobUrl, setPreloadedBlobUrl] = useState<string | null>(null);
  const [showWinnerDetails, setShowWinnerDetails] = useState(false);
  const [isSpeedUp, setIsSpeedUp] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number[]>([2, 0, 0, 4]);
  const confettiRef = useRef<{ trigger: () => void }>(null);
  const [winnerData, setWinnerData] = useState({
    bpName: "",
    outletName: "",
    imageUrl: "",
    tokenNumber: "",
  });

  const handleConfettiClick = () => {
    confettiRef.current?.trigger();
  };

  // Add this useEffect to see when winnerData actually updates
  useEffect(() => {
    console.log("Winner data updated:", winnerData);
  }, [winnerData]);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL);

    // Connect to the socket
    newSocket.on("connect", () => {
      console.log("Connected to backend server");
    });

    // Disconnect to the socket
    newSocket.on("disconnect", () => {
      console.log("Disconnected from backend server");
    });

    // show start (just to say it started )- (raffle 1)
    newSocket.on("raffle-started", (data) => {
      console.log("Raffle started confirmation:", data);
    });

    newSocket.on("raffle-stopped", (data) => {
      console.log("Raffle stopped confirmation:", data);
    });

    // show raffle and Select winner - (raffle 2)
    newSocket.on("frontend-start-raffle", (data) => {
      console.log("Received frontend-start-raffle event:", data);
      console.log("Selected raffle entry:", data.selectedEntry);

      setWinnerData(data);

      console.log("Data :", winnerData);

      // Reset to raffle screen
      setStatus("raffle");
      setShowRaflle(true);
      setShowWinnerDetails(false);

      // Update winner data from socket response
      if (data.selectedEntry) {
        const userData = data.selectedEntry;

        setWinnerData({
          bpName: userData.bpName,
          outletName: userData.outletName,
          imageUrl: userData.imageUrl,
          tokenNumber: "",
        });

        // ! check token
        // UPDATE THIS SECTION - Handle token number for selectedNumber
        if (userData.token && userData.token.trim() !== "") {
          // If token exists and is not empty, convert to array of numbers
          const tokenArray = userData.token.split("").map(Number);
          // Pad with zeros if less than 4 digits, or truncate if more than 4
          const paddedToken = [...tokenArray, 0, 0, 0, 0].slice(0, 4);
          setSelectedNumber(paddedToken);
        } else {
          // If no token or empty token, show x x x x (represented as -1 for display)
          setSelectedNumber([-1, -1, -1, -1]);
        }
        // ADD THIS: Preload the image
        if (userData.imageUrl) {
          console.log("Image:", userData.imageUrl);

          fetch(userData.imageUrl)
            .then((response) => response.blob())
            .then((blob) => {
              const blobUrl = URL.createObjectURL(blob);
              setPreloadedBlobUrl(blobUrl);
              console.log("Image preloaded as blob successfully");
            })
            .catch((error) => {
              console.log("Failed to preload image:", error);
              setPreloadedBlobUrl(null);
            });
        }
      }
    });

    // Show the winner name
    newSocket.on("frontend-stop-raffle", (data) => {
      console.log("Received frontend-stop-raffle event:", data);
      console.log("Showing winner");
      setIsSpeedUp(true);
      setShowWinnerDetails(false);
      setTimeout(() => {
        setStatus("winner-name");
        setIsStopped(true);
        handleConfettiClick();
      }, 2000);
    });

    // Show the details
    newSocket.on("frontend-show-winner-details", () => {
      console.log("Showing winner details");
      setShowWinnerDetails(true);
    });

    newSocket.on("frontend-show-winner-details", () => {
      console.log("Showing winner details");
    });

    // show IDLE screen
    newSocket.on("frontend-idle", () => {
      console.log("Received frontend-idle event");
      window.location.reload();
      setShowRaflle(false);
      setStatus("IDLE");
      setShowWinnerDetails(false);
      setWinnerData({
        bpName: "",
        outletName: "",
        imageUrl: "",
        tokenNumber: "",
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden">
      {/* images and background animations */}
      <>
        <FloatingStars starCount={100} animationSpeed={1} />
        <ConfettiComponent ref={confettiRef} />
        {/* Blur shadow blob */}
        <div className="w-[45rem] h-52 bg-white/20 rounded-full blur-3xl absolute z-10"></div>
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
      </>

      {/* logo */}
      <AnimatePresence>
        {status === "IDLE" && (
          <div className="absolute z-30 top-[28rem] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <motion.div
              key="raffle-logo"
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-[35rem] h-auto aspect-square scale-animation">
              <img
                src="/images/dmart-logo-1.png"
                alt="logo"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="flex flex-col items-center">
              <p className="text-6xl mt-6 text-violet-300 text-center font-bold uppercase">
                Ready to Raffle
              </p>
              <LoaderSVG />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main content container with smooth animations */}
      <motion.div
        className="flex flex-col items-center justify-center relative z-30"
        layout
        transition={{ duration: 0.8, ease: "easeInOut" }}>
        {/* Casino Roller Container with smooth scaling and positioning */}
        <AnimatePresence>
          {showRaflle && (
            <motion.div
              key="casino-roller-container"
              className="flex justify-center items-center"
              initial={{ scale: 3, y: 0 }}
              animate={{
                scale: showWinnerDetails ? 1 : 3,
                y: showWinnerDetails ? 1 : 0,
              }}
              transition={{
                duration: 0.8,
                ease: "easeInOut",
                scale: { duration: 0.8 },
                y: { duration: 0.8 },
              }}
              layout>
              <CasinoRoller
                isSpeedUp={isSpeedUp}
                isStopped={isStopped}
                selectedNumber={selectedNumber}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Winner Details Container */}
        <AnimatePresence>
          {showWinnerDetails && (
            <motion.div
              key="winner-details-container"
              className="flex flex-col items-center gap-4 mt-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: 0.2, // Slight delay to let casino roller finish moving
              }}
              layout>
              {/* Winner Image */}
              <motion.div
                className="w-96 h-96 rounded-xl overflow-hidden neon-flow-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
                layout>
                {preloadedBlobUrl ? (
                  <motion.img
                    src={preloadedBlobUrl}
                    alt="carousel"
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                ) : (
                  <motion.img
                    src={
                      "https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"
                    }
                    alt="carousel"
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                )}
              </motion.div>

              {/* Winner Name */}
              <motion.h1
                className={`${
                  winnerData.bpName &&
                  winnerData.bpName.length >
                    "WICKREMARATNA LOGISTICS (PVT) LTD".length
                    ? "text-4xl"
                    : "text-6xl"
                } font-semibold text-white text-center`}
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                layout>
                {winnerData.bpName || "no bp name"}
              </motion.h1>

              {/* Winner Category */}
              <motion.h1
                className="text-4xl text-violet-300 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
                layout>
                {winnerData.outletName || "no outlet name"}
              </motion.h1>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
