"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface DataResponse {
  latitude: number;
  longitude: number;
  timestamp: number;
  speed: number | null;
}

export const GPSData = () => {
  const [userLocation, setUserLocation] = useState<DataResponse | null>(null);
  const [locationHistory, setLocationHistory] = useState<DataResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  useEffect(() => {
    // Cleanup the watchPosition when the component unmounts
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const startWatchingLocation = () => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          console.log("position: - ", position.coords);
          const { latitude, longitude, speed } = position.coords;
          const timestamp = position.timestamp;
          const newLocation = {
            latitude,
            longitude,
            timestamp,
            speed,
          };

          setUserLocation(newLocation);
          setLocationHistory((prevHistory) => [...prevHistory, newLocation]);
          setError(null);
        },
        (error) => {
          console.error("Error getting user location:", error);
          setError("Failed to get user location. Please try again.");
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
      );
      setWatchId(id);
    } else {
      console.error("Geolocation is not supported by this browser.");
      setError("Geolocation is not supported by this browser.");
    }
  };

  const stopWatchingLocation = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
        <Button size="lg" onClick={startWatchingLocation}>
          Start Collecting Data
        </Button>
        {watchId !== null && (
          <Button size="lg" onClick={stopWatchingLocation}>
            Stop Collecting Data
          </Button>
        )}
      </div>
      <div className="flex flex-col justify-center space-y-4">
        <h3 className="text-base sm:text-xl md:text-2xl font-medium">
          GPS Data
        </h3>
        {userLocation ? (
          <div className="text-sm sm:text-base">
            <h2 className="font-bold">Current User Location</h2>
            <p>
              <span className="font-bold">Latitude:</span>{" "}
              {userLocation.latitude}
            </p>
            <p>
              <span className="font-bold">Longitude:</span>{" "}
              {userLocation.longitude}
            </p>
            <p>
              <span className="font-bold">Timestamp:</span>{" "}
              {new Date(userLocation.timestamp).toLocaleString()}
            </p>
            <p>
              <span className="font-bold">Speed:</span>{" "}
              {userLocation.speed !== null
                ? (userLocation.speed * 3.6).toFixed(2)
                : "Speed not available"}{" "}
              km/h
            </p>
          </div>
        ) : (
          error && <p className="text-red-500">{error}</p>
        )}
        <h3 className="text-base sm:text-xl md:text-2xl font-medium mt-4">
          Location History
        </h3>
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-400 mt-2 w-full text-xs sm:text-sm">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Latitude</th>
                <th className="border border-gray-300 px-4 py-2">Longitude</th>
                <th className="border border-gray-300 px-4 py-2">Timestamp</th>
                <th className="border border-gray-300 px-4 py-2">
                  Speed (km/h)
                </th>
              </tr>
            </thead>
            <tbody>
              {locationHistory.map((location, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    {location.latitude}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {location.longitude}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(location.timestamp).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {location.speed !== null
                      ? (location.speed * 3.6).toFixed(2)
                      : "0.00"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
