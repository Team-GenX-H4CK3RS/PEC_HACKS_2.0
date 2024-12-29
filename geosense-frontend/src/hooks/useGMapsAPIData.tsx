"use client";
import { Axios } from "axios";

export default function useGMapsAPIData() {
  const axios = new Axios({
    baseURL: "https://maps.googleapis.com/maps/api/",
    params: { key: "AIzaSyBlJfGgpP2kN06cTUkpcY1VZLsflD2_ux0" },
  });
  const getLocationByAddress = async (loc: string) => {
    const response = await axios.get("geocode/json", {
      params: { address: loc },
    });
    const data = JSON.parse(response.data);
    return [
      data.results[0]["geometry"]["location"]["lat"],
      data.results[0]["geometry"]["location"]["lng"],
    ];
  };
  const getNearByPlaces = async (
    coords: number[],
    keyword: string,
    radius = 500
  ) => {
    try {
      const response = await axios.get("place/nearbysearch/json", {
        params: { location: coords.join(","), keyword, radius },
      });
      console.log(response.data);
      return JSON.parse(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return { getLocationByAddress, getNearByPlaces };
}
