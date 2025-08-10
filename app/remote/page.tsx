/** @format */
"use client";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";

export default function page() {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("IDLE");
  const [raffleActive, setRaffleActive] = useState(false);
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
  const [selectedWinner, setSelectedWinner] = useState("");

  const handleIDLEScreen = () => {
    if (socket && isConnected) {
      console.log("Emitting start-raffle event");
      socket.emit("idle-screen"); // start raffle and store data
    } else {
      console.log("Socket not connected");
    }
  };

  const handleShowRaffle = () => {
    if (socket && isConnected) {
      console.log("Emitting start-raffle event");
      socket.emit("start-raffle"); // start raffle and store data
    } else {
      console.log("Socket not connected");
    }
  };

  const handleShowWinner = () => {
    setShowWinnerDetails(false);
    if (socket && isConnected) {
      console.log("Emitting stop-raffle event");
      socket.emit("stop-raffle");
    } else {
      console.log("Socket not connected");
    }
  };

  const handleShowWinnerDetails = () => {
    if (socket && isConnected) {
      console.log("Emitting stop-raffle event");
      socket.emit("show-winner-details");
    } else {
      console.log("Socket not connected");
    }
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
      setIsConnected(true);
      addLog("Connected to raffle server", "info");
    });

    // Disconnect to the socket
    newSocket.on("disconnect", () => {
      console.log("Disconnected from backend server");
      setIsConnected(false);
      addLog("Disconnected from raffle server", "warning");
    });

    // show Raffle screen
    newSocket.on("raffle-started", (data) => {
      console.log("Raffle started confirmation:", data);
      setStatus("raffle");
      addLog("Raffle started", "success");
    });

    newSocket.on("raffle-stopped", (data) => {
      console.log("Raffle stopped confirmation:", data);
      setRaffleActive(false);
      addLog("Raffle stopped", "warning");
    });

    newSocket.on("frontend-start-raffle", (data) => {
      console.log("Received frontend-start-raffle event:", data);
      console.log("Selected raffle entry:", data.selectedEntry.bpName);
      //   playAudio(); // Play audio when raffle stops

      // Reset to main screen
      setIsWinnerRevealed(false);
      setStatus("raffle");
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

      addLog(
        `Winner data received: ${data.selectedEntry?.bpName || "Unknown"}`,
        "info"
      );
    });

    // Listen for raffle stop event - show the winner
    newSocket.on("frontend-stop-raffle", (data) => {
      console.log("Received frontend-stop-raffle event:", data);
      console.log("Showing winner");
      //   playAudio(); // Play audio when raffle stops

      setStatus("winner-name");
      // setRaffleStatus("show-winner-details");

      addLog(`Winner is: ${winnerData?.bpName || "Unknown"}`, "info");
    });

    newSocket.on("frontend-show-winner-details", () => {
      console.log("Showing winner details");
      setShowWinnerDetails(true);

      addLog("Revealing winner", "success");
    });

    newSocket.on("frontend-idle", () => {
      console.log("Received frontend-idle event");
      setStatus("IDLE"); // Or whatever your idle screen state is
      setShowWinnerDetails(false);
      addLog("switched to IDLE Screen", "info");

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
    <div className="h-screen overflow-hidden w-full flex flex-col justify-center items-center">
      <div
        className={`text-center mb-6 p-4 rounded-lg border ${
          isConnected
            ? "bg-green-100 border-green-300 text-green-800"
            : "bg-red-100 border-red-300 text-red-800"
        }`}>
        Connection Status: {isConnected ? "Connected" : "Disconnected"}
      </div>

      {status && (
        <div className="">
          <p className="">{status} </p>
        </div>
      )}
      <div className="bg-slate-400 p-4 flex flex-col gap-4 z-50">
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
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-gray-200">
          Activity Log
        </h3>

        <div className=" bg-gray-50 p-4 rounded">
          {logs.length === 0 ? (
            <p className="text-gray-500 italic">No activity yet...</p>
          ) : (
            logs.map((log, index) => (
              <div
                key={index}
                className={`mb-2 p-3 bg-white rounded border-l-4 ${
                  log.type === "success"
                    ? "border-green-500"
                    : log.type === "error"
                    ? "border-red-500"
                    : log.type === "warning"
                    ? "border-yellow-500"
                    : "border-blue-500"
                }`}>
                <span className="text-xs text-gray-500 mr-2">
                  [{log.timestamp}]
                </span>
                <span
                  className={`${
                    log.type === "success"
                      ? "text-green-600"
                      : log.type === "error"
                      ? "text-red-600"
                      : log.type === "warning"
                      ? "text-yellow-600"
                      : "text-gray-700"
                  }`}>
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
