import { useState } from "react";
//http://landslide.lalithadithyan.online/phone/req/<lat>/<lon>
export default function usePrediction() {
  const [status, setStatus] = useState<string>();
  const [severity, setSeverity] = useState<number>();
  const [date, setDate] = useState<string>();
  const pingStatus = async (lat: number, lon: number) => {
    const response = await fetch(
      `http://landslide.lalithadithyan.online/phone/req/${lat}/${lon}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
    setStatus(data.status);
    if (data.status === "error") return;
    setSeverity(data.payload.sev);
    setDate(data.payload.date);
  };
  const getTextFromSeverity = () => {
    return ["None", "Yellow", "Orange", "Orange Red", "Red", "Severe Red"][
      severity
    ];
  };
  const getClassNameFromSeverity = () => {
    return [
      "None",
      "bg-yellow-600",
      "bg-orange-600",
      "bg-orange-700",
      "bg-red-600",
      "bg-red-800",
    ][severity];
  };
  const start = (lat: number = 30.285, lon: number = 78.9829) => {
    setInterval(async () => {
      await pingStatus(lat, lon);
    }, 5000);
  };
  return {
    status,
    severity,
    date,
    start,
    getTextFromSeverity,
    getClassNameFromSeverity,
  };
}
