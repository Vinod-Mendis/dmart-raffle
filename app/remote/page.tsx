/** @format */

"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  Wifi,
  WifiOff,
  Play,
  Square,
  Trophy,
  Eye,
  Activity,
  Clock,
  Zap,
  RefreshCcw,
} from "lucide-react";

export default function EventDashboard() {
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
      socket.emit("idle-screen");
    } else {
      console.log("Socket not connected");
    }
  };

  const handleShowRaffle = () => {
    if (socket && isConnected) {
      console.log("Emitting start-raffle event");
      socket.emit("start-raffle");
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

      setIsWinnerRevealed(false);
      setStatus("raffle");
      setSelectedEntry(data.selectedEntry);

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

    // show winner name
    newSocket.on("frontend-stop-raffle", (data) => {
      console.log("Received frontend-stop-raffle event:", data);
      console.log("Showing winner");
      setTimeout(() => {
        setStatus("winner-name");
        setTimeout(() => {
          setStatus("winner-details");
        }, 3000);
      }, 2000);
      addLog(`Showing Winner`, "info");
    });

    // Show IDLE
    newSocket.on("frontend-idle", () => {
      console.log("Received frontend-idle event");
      setStatus("IDLE");
      setShowWinnerDetails(false);
      addLog("Switched to IDLE Screen", "info");
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

  const idleBtnDisable =
    !isConnected || status === "raffle" || status === "winner-name";
  const raffleBtnDisable =
    !isConnected ||
    status == "raffle" ||
    status === "winner-name" ||
    status === "winner-details";
  const winnerBtnDisable =
    !isConnected ||
    status == "IDLE" ||
    status === "winner-name" ||
    status === "winner-details";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "IDLE":
        return "bg-red-100 text-slate-800 border-red-200";
      case "raffle":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "winner-name":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "winner-details":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getLogTypeStyles = (type: string) => {
    switch (type) {
      case "success":
        return "border-l-green-500 bg-green-50 text-green-800";
      case "error":
        return "border-l-red-500 bg-red-50 text-red-800";
      case "warning":
        return "border-l-yellow-500 bg-yellow-50 text-yellow-800";
      default:
        return "border-l-blue-500 bg-blue-50 text-blue-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <button
        className="bg-red-400 px-6 py-2 flex gap-2 items-center text-white rounded-md absolute right-4 top-4 transition hover:scale-95 cursor-pointer"
        onClick={() => {
          window.location.reload();
        }}>
        <RefreshCcw size={20} />
        Refresh
      </button>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-800 flex items-center justify-center gap-3">
            <Zap className="h-10 w-10 text-yellow-500" />
            Raffle Dashboard
          </h1>
          <p className="text-slate-600">
            Real-time raffle control and monitoring
          </p>
        </div>

        {/* Status Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Connection Status */}
          <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm">
            <div className="p-6 pb-3">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                {isConnected ? (
                  <Wifi className="h-5 w-5 text-green-500" />
                ) : (
                  <WifiOff className="h-5 w-5 text-red-500" />
                )}
                Connection Status
              </h3>
            </div>
            <div className="px-6 pb-6">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  isConnected
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}>
                {isConnected ? "Connected" : "Disconnected"}
              </span>
              {isConnected && (
                <p className="text-sm text-slate-600 mt-2">
                  socket connected succesfully
                </p>
              )}
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm">
            <div className="p-6 pb-3">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Activity className="h-5 w-5 text-blue-500" />
                Current Status
              </h3>
            </div>
            <div className="px-6 pb-6">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                  status
                )}`}>
                {status.toUpperCase()}
              </span>
              {selectedEntry && (
                <p className="text-sm text-slate-600 mt-2">
                  Selected: {selectedEntry.bpName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm">
          <div className="p-6 pb-3">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Raffle Controls
            </h3>
          </div>
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handleIDLEScreen}
                className={`h-16 flex items-center text-white bg-red-400 justify-center gap-2 rounded-lg transition-all duration-200 ${
                  idleBtnDisable
                    ? "opacity-30  cursor-not-allowed"
                    : " active:scale-95  hover:bg-red-500 cursor-pointer hover:scale-95 group"
                }`}
                disabled={idleBtnDisable}>
                <Square className="h-5 w-5 group-hover:scale-125 transition" />
                <span className="text-sm font-medium">IDLE</span>
              </button>

              <button
                onClick={handleShowRaffle}
                className={`h-16 flex items-center text-white bg-yellow-400  justify-center gap-2 rounded-lg transition-all duration-200 ${
                  raffleBtnDisable
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-yellow-500 active:scale-95 cursor-pointer hover:scale-95 group"
                }`}
                disabled={raffleBtnDisable}>
                <Play className="h-5 w-5 group-hover:scale-125 transition" />
                <span className="text-sm font-medium">Start Raffle</span>
              </button>

              <button
                onClick={handleShowWinner}
                className={`h-16 flex items-center text-white bg-blue-400 justify-center gap-2 rounded-lg border-2 transition-all duration-200 ${
                  winnerBtnDisable
                    ? "opacity-30 cursor-not-allowed"
                    : " hover:bg-blue-500 active:scale-95 cursor-pointer hover:scale-95 group"
                }`}
                disabled={winnerBtnDisable}>
                <Trophy className="h-5 w-5 group-hover:scale-125 transition" />
                <span className="text-sm font-medium">Show Winner</span>
              </button>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm">
          <div className="p-6 pb-3">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Clock className="h-5 w-5 text-slate-500" />
              Activity Log
            </h3>
          </div>
          <div className="px-6 pb-6">
            <div className="h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {logs.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-slate-500">
                  <div className="text-center">
                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No activity yet...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${getLogTypeStyles(
                        log.type
                      )}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{log.message}</p>
                        </div>
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white border border-gray-200 text-gray-600 ml-2">
                          {log.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
