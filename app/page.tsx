/** @format */
"use client";

import { useEffect, useRef, useState } from "react";
import VerticalCarousel from "./components/VerticalCarousel";
import { AnimatePresence, motion } from "motion/react";
import ConfettiComponent from "./components/ConfettiComponent";
import FloatingStars from "./components/FloatingStars";
import LoaderSVG from "./components/LoaderSVG";
import io from "socket.io-client";

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
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("IDLE");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isWinnerRevealed, setIsWinnerRevealed] = useState(false);

  // Winner data state - will be populated from socket data
  const [winnerData, setWinnerData] = useState({
    bpName: "",
    outletName: "",
    imageUrl: "",
  });

  const [raffleTimeInterval, setRaffleTimeInterval] = useState(400);
  const [showWinnerDetails, setShowWinnerDetails] = useState(false);

  const confettiRef = useRef(null);

  // const handleIDLEScreen = () => {
  //   // setStatus("IDLE");
  //   setShowWinnerDetails(false);
  //   window.location.reload();
  // };

  const handleConfettiClick = () => {
    confettiRef.current?.trigger();
  };

  // const handleShowRaffle = () => {
  //   setStatus("raffle");
  //   // setSelectedWinner({})
  //   setShowWinnerDetails(false);
  // };
  // const handleShowWinner = () => {
  //   setRaffleTimeInterval(150);
  //   setShowWinnerDetails(false);
  //   setTimeout(() => {
  //     setStatus("winner-name");
  //     handleConfettiClick();
  //   }, 5000);
  //   // setSelectedWinner({})
  // };
  // const handleShowWinnerDetails = () => {
  //   setRaffleTimeInterval(400);
  //   // setSelectedWinner({})
  //   setShowWinnerDetails(true);
  // };

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
      addLog("Connected to raffle server", "info");
    });

    // Disconnect to the socket
    newSocket.on("disconnect", () => {
      console.log("Disconnected from backend server");
      setIsConnected(false);
      addLog("Disconnected from raffle server", "warning");
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
      }, 5000);
    });

    newSocket.on("frontend-show-winner-details", () => {
      // console.log("Received frontend-stop-raffle event:", data);
      console.log("Showing winner details");
      setRaffleTimeInterval(400);
      setShowWinnerDetails(true);
    });

    // show IDLE screen
    newSocket.on("frontend-idle", () => {
      console.log("Received frontend-idle event");
      setStatus("IDLE"); // Or whatever your idle screen state is
      setShowWinnerDetails(false);

      setSelectedEntry(null);
      setWinnerData(null);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const addLog = (message: any, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev.slice(-9), { message, type, timestamp }]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* images and background animations */}
      <>
        <FloatingStars starCount={100} animationSpeed={1} />
        <ConfettiComponent ref={confettiRef} />
        {/* Blur shadow blob */}
        <div className="w-[45rem] h-52 bg-white/20 rounded-full blur-3xl absolute z-10"></div>
        {/* logo */};
        {/* <AnimatePresence>
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
      </AnimatePresence> */}
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
      {/* Controls */}
      {/* <div className="bg-slate-400 p-4 absolute top-4 left-4 flex flex-col gap-4 z-50">
        <button
          className="rounded-md p-2 bg-pink-400 cursor-pointer hover:scale-95 transition"
          onClick={handleIDLEScreen}>
          IDLE
        </button>
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
      </div> */}

      <AnimatePresence>
        {status === "IDLE" && (
          <div className="absolute z-30 top-[28rem] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            {/* logo */};
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
              <p className="text-6xl mt-6 gradient-text text-center font-bold uppercase">
                Ready to Raffle
              </p>
              <LoaderSVG />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Raffle */}
      {status === "raffle" && (
        <VerticalCarousel
          data={carouselData}
          autoPlayInterval={raffleTimeInterval}
        />
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
            className="text-8xl font-semibold text-yellow-400"
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
                className="text-4xl text-amber-200"
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
