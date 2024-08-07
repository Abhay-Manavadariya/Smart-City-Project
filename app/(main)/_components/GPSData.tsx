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

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  };

  const calculateSpeed = (
    prevLocation: DataResponse | null,
    currentLocation: DataResponse
  ): number | null => {
    if (!prevLocation) return null;
    const distance = calculateDistance(
      prevLocation.latitude,
      prevLocation.longitude,
      currentLocation.latitude,
      currentLocation.longitude
    );
    const timeElapsed =
      (currentLocation.timestamp - prevLocation.timestamp) / 1000; // in seconds
    const speed = distance / timeElapsed; // in meters/second
    return speed;
  };

  const startWatchingLocation = () => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const timestamp = position.timestamp;
          const currentLocation = {
            latitude,
            longitude,
            timestamp,
            speed: null,
          };
          const speed = calculateSpeed(userLocation, currentLocation);
          const newLocation = { ...currentLocation, speed };

          setUserLocation(newLocation);
          setLocationHistory((prevHistory) => [...prevHistory, newLocation]);
          setError(null); // Clear any previous errors
        },
        (error) => {
          console.error("Error getting user location:", error);
          setError("Failed to get user location. Please try again.");
        }
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
    <div className="flex flex-col justify-center space-y-4 p-4">
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
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">
              Current User Location
            </h2>
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
            {userLocation.speed !== null && (
              <p>
                <span className="font-bold">Speed:</span>{" "}
                {userLocation.speed.toFixed(2)} m/s
              </p>
            )}
          </div>
        ) : (
          error && <p className="text-red-500">{error}</p>
        )}
        <h3 className="text-base sm:text-xl md:text-2xl font-medium mt-4">
          Location History
        </h3>
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-400 mt-2 w-full">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Latitude</th>
                <th className="border border-gray-300 px-4 py-2">Longitude</th>
                <th className="border border-gray-300 px-4 py-2">Timestamp</th>
                <th className="border border-gray-300 px-4 py-2">
                  Speed (m/s)
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
                      ? location.speed.toFixed(2)
                      : "N/A"}
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
