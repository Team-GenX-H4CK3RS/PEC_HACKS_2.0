"use client";
export default function useServerData() {
  const baseURL = "http://192.168.248.44:5000/";

  const fetchData = async (url, options = {}) => {
    const response = await fetch(baseURL + url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  };

  const getNGOStates = async () => {
    return await fetchData(`ngos/states`);
  };

  const getNGOSectors = async () => {
    return await fetchData(`ngos/sectors`);
  };

  const getNGODistricts = async (state) => {
    return await fetchData(`ngos/states/${state}/districts`);
  };

  const searchNGOs = async (state, district, sectors) => {
    const params = new URLSearchParams({
      state,
      district,
      sectors: sectors ? sectors.join(",") : undefined,
    });
    return await fetchData(`ngos/search?${params.toString()}`);
  };

  const getGMapsNearByPlaces = async (coords, place) => {
    const params = new URLSearchParams({
      location: coords.join(","),
      place,
    });
    const data = await fetchData(`gmaps/nearbyplaces?${params.toString()}`);
    console.log(data);
    return data.results;
  };

  const getGMapsNearByPlaceDetailsById = async (placeId) => {
    const params = new URLSearchParams({ place_id: placeId });
    const data = await fetchData(
      `gmaps/nearbyplaces/details?${params.toString()}`
    );
    console.log(data.result);
    return data.result;
  };

  const getGMapsRoutes = async (origin, destination) => {
    const params = new URLSearchParams({
      origin: origin.join(","),
      dest: destination.join(","),
    });
    const data = await fetchData(`gmaps/routes?${params.toString()}`);
    console.log(data);
    return data.result;
  };

  const createMedChatBot = async () => {
    const data = await fetchData(`medchat/new`);
    return data.sessionId;
  };

  const sendMedChatMsg = async (sessionId, msg) => {
    const response = await fetch(`${baseURL}medchat/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId, msg }),
    });
    const data = await response.json();
    return data.result;
  };

  const closeMedChatBot = async (sessionId) => {
    await fetch(`${baseURL}medchat/close`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    });
  };

  const convertSpeechToText = async (audio) => {
    const response = await fetch(`${baseURL}speechttext`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ audio }),
    });
    const data = await response.json();
    return data.text;
  };

  return {
    ngos: {
      getStates: getNGOStates,
      getDistricts: getNGODistricts,
      getSectors: getNGOSectors,
      search: searchNGOs,
    },
    gmaps: {
      getNearByPlaces: getGMapsNearByPlaces,
      getNearByPlaceDetailsById: getGMapsNearByPlaceDetailsById,
      getRoutes: getGMapsRoutes,
    },
    medchat: {
      newChat: createMedChatBot,
      send: sendMedChatMsg,
      closeChat: closeMedChatBot,
    },
    s2t: {
      convertSpeechToText,
    },
  };
}
