"use client";

export default function useGeoLocation() {
  const getCoordinates = () => {
    if ("geolocation" in navigator) {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
          const { latitude, longitude } = coords;
          resolve([latitude, longitude]);
        });
      }) as Promise<number[]>;
    }
  };
  return { getCoordinates };
}
