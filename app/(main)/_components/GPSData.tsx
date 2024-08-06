"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DataResponse {
  latitude: number;
  longitude: number;
}

export const GPSData = () => {
  const [userLocation, setUserLocation] = useState<DataResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setError(null); // Clear any previous errors
        },
        (error) => {
          console.error("Error getting user location:", error);
          setError("Failed to get user location. Please try again.");
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setError("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="flex flex-col justify-center space-y-4">
      <div>
        <Button size="lg" onClick={getUserLocation}>
          Collect Data
        </Button>
      </div>
      <div className="flex flex-col justify-center space-y-4">
        <h3 className="text-base sm:text-xl md:text-2xl font-medium">
          GPS Data
        </h3>
        {userLocation ? (
          <div>
            <h2>User Location</h2>
            <p>
              <span className="font-bold">Latitude:</span>{" "}
              {userLocation.latitude}
            </p>
            <p>
              <span className="font-bold">Longitude:</span>
              {userLocation.longitude}
            </p>
          </div>
        ) : (
          error && <p className="text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
};
