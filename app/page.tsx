/** @format */
"use client";

import { useEffect, useRef, useState } from "react";
import VerticalCarousel from "./components/VerticalCarousel";
import { AnimatePresence, motion } from "motion/react";
import ConfettiComponent from "./components/ConfettiComponent";
import FloatingStars from "./components/FloatingStars";
import LoaderSVG from "./components/LoaderSVG";
import io from "socket.io-client";

// Remove the hardcoded carouselData array

export default function MyPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("IDLE");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isWinnerRevealed, setIsWinnerRevealed] = useState(false);

  // Add state for carousel data loaded from JSON
  const [carouselData, setCarouselData] = useState([]);

  // Winner data state - will be populated from socket data
  const [winnerData, setWinnerData] = useState({
    bpName: "",
    outletName: "",
    imageUrl: "",
  });

  const [raffleTimeInterval, setRaffleTimeInterval] = useState(400);
  const [showWinnerDetails, setShowWinnerDetails] = useState(false);

  const confettiRef = useRef(null);

  const handleConfettiClick = () => {
    confettiRef.current?.trigger();
  };

  // Load carousel data from JSON file
  useEffect(() => {
    const loadCarouselData = async () => {
      try {
        const response = await fetch("/data/csvjson.json");
        const jsonData = await response.json();

        // Transform the JSON data to carousel format
        const transformedData = jsonData.map((item, index) => ({
          id: index + 1,
          text: item["OUTLET NAME"], // Use the outlet name from JSON
          category: item["CHAIN/ IND"], // Optional: use chain/individual info
          image:
            "https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg", // Default image
          bpName: item["BP NAME"],
          bpCode: item["BP CODE"],
          outletCode: item["OUTLET CODE"],
          area: item["AREA"],
          location: item["LOCATION"],
          tier: item["TIER"],
          headcount: item["HEADCOUNT"],
          award: item["AWARD Y/N"],
        }));

        setCarouselData(transformedData);
      } catch (error) {
        console.error("Error loading carousel data:", error);
        // Fallback to empty array or show error message
        setCarouselData([]);
      }
    };

    loadCarouselData();
  }, []);

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
      setIsConnected(true);
    });

    // Disconnect to the socket
    newSocket.on("disconnect", () => {
      console.log("Disconnected from backend server");
      setIsConnected(false);
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
      setShowWinnerDetails(false);
      setSelectedEntry(data.selectedEntry);

      // Update winner data from socket response
      if (data.selectedEntry) {
        const userData = data.selectedEntry;

        setWinnerData({
          bpName: userData.bpName,
          outletName: userData.outletName,
          imageUrl: userData.imageUrl,
        });
      }
    });

    // Show the winner name
    newSocket.on("frontend-stop-raffle", (data) => {
      console.log("Received frontend-stop-raffle event:", data);
      console.log("Showing winner");
      setRaffleTimeInterval(150);
      setShowWinnerDetails(false);
      setTimeout(() => {
        setStatus("winner-name");
        handleConfettiClick();
        setTimeout(() => {
          setRaffleTimeInterval(400);
          setShowWinnerDetails(true);
        }, 3000);
      }, 2000);
    });

    newSocket.on("frontend-show-winner-details", () => {
      console.log("Showing winner details");
    });

    // show IDLE screen
    newSocket.on("frontend-idle", () => {
      console.log("Received frontend-idle event");
      window.location.reload();
      setStatus("IDLE");
      setShowWinnerDetails(false);

      setSelectedEntry(null);
      setWinnerData(null);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
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

      <AnimatePresence>
        {status === "IDLE" && (
          <div className="absolute z-30 top-[28rem] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            {/* logo */}
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

      {/* Raffle - Only render if carouselData is loaded */}
      {status === "raffle" && carouselData.length > 0 && (
        <VerticalCarousel
          data={carouselData}
          autoPlayInterval={raffleTimeInterval}
        />
      )}

      {/* Loading state for carousel data */}
      {status === "raffle" && carouselData.length === 0 && (
        <div className="absolute z-30 flex items-center justify-center">
          <p className="text-white text-2xl">Loading raffle data...</p>
        </div>
      )}

      {status === "winner-name" && (
        <motion.div className="flex flex-col items-center gap-4 relative z-30">
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
                  src={
                    winnerData.imageUrl ||
                    "https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg"
                  }
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
            className="text-6xl font-semibold text-white"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            layout // lets the name move down smoothly when image appears
          >
            {winnerData.bpName || "no bp name"}
          </motion.h1>

          <AnimatePresence>
            {showWinnerDetails && (
              <motion.h1
                key="winner-category"
                className="text-4xl text-violet-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                layout>
                {winnerData.outletName || "no outlet name"}
              </motion.h1>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
