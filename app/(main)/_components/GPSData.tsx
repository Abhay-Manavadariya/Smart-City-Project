"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface DataResponse {
  latitude: number;
  longitude: number;
  timestamp: number;
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
          const { latitude, longitude } = position.coords;
          const timestamp = position.timestamp;
          const newLocation = { latitude, longitude, timestamp };
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
    <div className="flex flex-col justify-center space-y-4">
      <div>
        <Button size="lg" onClick={startWatchingLocation}>
          Start Collecting Data
        </Button>
        {watchId !== null && (
          <Button size="lg" onClick={stopWatchingLocation} className="ml-4">
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
            <h2>Current User Location</h2>
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
          </div>
        ) : (
          error && <p className="text-red-500">{error}</p>
        )}
        <h3 className="text-base sm:text-xl md:text-2xl font-medium mt-4">
          Location History
        </h3>
        <table className="table-auto border-collapse border border-gray-400 mt-2">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Latitude</th>
              <th className="border border-gray-300 px-4 py-2">Longitude</th>
              <th className="border border-gray-300 px-4 py-2">Timestamp</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
