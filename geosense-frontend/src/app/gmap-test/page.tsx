"use client";
import useGMapsAPIData from "@/hooks/useGMapsAPIData";
import useServerData from "@/hooks/useServerData";
import { useState } from "react";
import { Geolocation } from "@capacitor/geolocation";

export default function GMapTestPage() {
  const presetPOIs = [
    "pharmacy",
    "hospital",
    "hotel",
    "restaurant",
    "park",
    "blood bank",
  ];
  const [coords, setCoords] = useState<number[]>();
  const [results, setResults] = useState<Record<string, string>[]>();
  const [placeDetails, setPlaceDetails] = useState<Record<string, string>[]>();
  const [routesDetails, setRoutesDetails] =
    useState<Record<string, string>[]>();
  const serverData = useServerData();
  const gMapsData = useGMapsAPIData();
  const [locationText, setLocationText] = useState<string>("");
  const [selectedPOI, setSelectedPOI] = useState<string>("");

  const getCurrCordinates = async () => {
    const { coords } = await Geolocation.getCurrentPosition();
    return [coords.latitude, coords.longitude];
  };

  const handleSearchButtonClicked = async () => {
    if (!selectedPOI || selectedPOI == "") return;
    const currCoords: number[] | undefined =
      locationText != ""
        ? await gMapsData.getLocationByAddress(locationText)
        : await getCurrCordinates();
    console.log(currCoords);

    setCoords(currCoords);
    setResults(
      await serverData.gmaps.getNearByPlaces(currCoords!, selectedPOI!)
    );
  };
  const handlePlaceDetailsButtonClicked = async (
    place: Record<string, string>
  ) => {
    if (!selectedPOI || selectedPOI == "") return;
    setPlaceDetails(
      await serverData.gmaps.getNearByPlaceDetailsById(place["place_id"])
    );
    setRoutesDetails(
      await serverData.gmaps.getRoutes(coords!, [
        place["geometry"]["location"]["lat"],
        place["geometry"]["location"]["lng"],
      ])
    );
  };

  const isBusinessOpen = (place: Record<string, string>) => {
    return place["opening_hours"]
      ? place["opening_hours"]["open_now"]
      : place["business_status"] === "OPERATIONAL";
  };
  return (
    <div className="p-4 flex flex-col space-y-2 select-none">
      <p className="text-2xl font-bold">POIs Search</p>
      <hr />
      <label className="flex flex-col items-stretch px-2 py-1">
        <p className="font-semibold">Enter Location</p>
        <input
          className="appearance-none px-3 py-1 capitalize rounded-lg border-2 border-slate-300 focus:outline-teal-600 transition"
          value={locationText}
          placeholder="Default: Your Location"
          onChange={(e) => setLocationText(e.target.value)}
        ></input>
      </label>
      <div className="flex flex-col items-stretch px-2 py-1 gap-3">
        <p className="font-semibold whitespace-nowrap">Choose a POI</p>
        <div className="flex flex-wrap gap-2">
          {presetPOIs?.map((v) => (
            <button
              key={v}
              className={`capitalize px-4 rounded-full transition ${
                selectedPOI == v ? "bg-teal-200" : "bg-slate-100"
              }`}
              onClick={() => setSelectedPOI(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      <label className="flex flex-col items-stretch px-2 py-1">
        <p className="font-semibold">Or enter a POI</p>
        <input
          className="appearance-none px-3 py-1 capitalize rounded-lg border-2 border-slate-300 focus:outline-teal-600 transition"
          value={selectedPOI}
          onChange={(e) => setSelectedPOI(e.target.value)}
        ></input>
      </label>
      <div className="grid grid-cols-2 gap-2 p-2">
        <button
          className="flex items-center justify-center font-bold p-2 space-x-2 bg-teal-700 text-white rounded-lg"
          onClick={handleSearchButtonClicked}
        >
          <p>Search</p>
          <span className="material-symbols-rounded msr-bold">search</span>
        </button>
        <button className="flex items-center justify-center font-bold p-2 space-x-2 bg-slate-200 rounded-lg">
          <p>Clear</p>
          <span className="material-symbols-rounded msr-bold">clear</span>
        </button>
      </div>
      <hr />

      {results ? (
        <div>
          <p className="text-xl font-semibold">Results</p>
          <div className="flex flex-col gap-2 mt-2">
            {results.map((v) => (
              <div
                role="radiogroup"
                key={v["place_id"]}
                className="overflow-hidden rounded-md border-2 border-teal-800 bg-teal-800 text-white"
              >
                <input
                  type="radio"
                  name="results-item"
                  id={`result-item-radio-${v["place_id"]}`}
                  className="hidden peer"
                  onChange={() => setPlaceDetails(undefined)}
                />
                <label
                  className="flex items-center px-4 py-2 gap-2"
                  htmlFor={`result-item-radio-${v["place_id"]}`}
                >
                  <p className="font-semibold w-full py-2 text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    {v["name"]}
                  </p>
                  <div className="flex-grow"></div>
                  <p
                    className={`font-semibold rounded-full px-4 py-1 whitespace-nowrap ${
                      isBusinessOpen(v)
                        ? "bg-white/80 text-teal-700"
                        : "bg-white/80 text-red-700"
                    }`}
                  >
                    {isBusinessOpen(v) ? "Open" : "Closed"}
                  </p>
                </label>
                <div className="bg-white text-slate-800 overflow-hidden h-0 p-0 peer-checked:h-fit peer-checked:p-4 transition-all text-lg">
                  <p className="font-semibold">
                    Address:{" "}
                    <span className="font-normal">{v["vicinity"]}</span>
                  </p>
                  <p className="font-semibold">
                    Ratings:{" "}
                    <span className="font-normal font-mono bg-slate-200 rounded px-2 select-text">
                      {v["rating"]}
                    </span>
                  </p>

                  {placeDetails ? (
                    <>
                      <p className="font-semibold">
                        Phone:{" "}
                        {!("formatted_phone_number" in placeDetails) ? (
                          "Not Available"
                        ) : (
                          <span className="font-normal font-mono bg-slate-200 rounded px-1 select-text">
                            {placeDetails["formatted_phone_number"] as string}
                          </span>
                        )}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={placeDetails["website"]}
                          className="flex items-center space-x-2 bg-teal-100 text-teal-800 font-semibold w-fit px-2 rounded-lg mt-1"
                        >
                          <p>Website</p>
                          <span className="material-symbols-rounded text-lg msr-bold">
                            open_in_new
                          </span>
                        </a>
                        <a
                          href={placeDetails["url"]}
                          className="flex items-center space-x-2 bg-teal-100 text-teal-800 font-semibold w-fit px-2 rounded-lg mt-1"
                        >
                          <p>Google Places Url</p>
                          <span className="material-symbols-rounded text-lg msr-bold">
                            open_in_new
                          </span>
                        </a>
                      </div>
                      {placeDetails["reviews"] ? (
                        <div className="flex flex-col gap-2 pt-2">
                          <p className="font-semibold">Reviews:</p>
                          {placeDetails["reviews"].map((rev, ri) => (
                            <div
                              key={ri}
                              className="flex flex-col items-stretch bg-slate-50 border p-3 rounded-md"
                            >
                              <div className="flex py-1 gap-4">
                                <p className="text-base capitalize font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                                  {rev["author_name"]}
                                </p>
                                <div className="flex-grow"></div>
                                <p className="text-sm whitespace-nowrap">
                                  {rev["relative_time_description"]}
                                </p>
                              </div>
                              <p className="text-sm font-semibold">
                                Rating:{" "}
                                <span className="font-normal rounded px-2 select-text">
                                  {v["rating"]}
                                </span>
                              </p>
                              <p className="text-xs text-justify pt-2">
                                {rev["text"]}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        ""
                      )}
                      {placeDetails["opening_hours"] &&
                      placeDetails["opening_hours"]["weekday_text"] ? (
                        <div className="flex flex-col pt-2">
                          <p className="font-semibold">Opening Periods:</p>
                          <div className="text-sm flex flex-col p-2">
                            {placeDetails["opening_hours"]["weekday_text"].map(
                              (ot, oti) => (
                                <p key={oti}>{ot}</p>
                              )
                            )}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => handlePlaceDetailsButtonClicked(v)}
                      className="bg-slate-200 px-4 py-1 rounded-lg mt-2 flex items-center space-x-2 text-sm w-full"
                    >
                      <p>View More</p>
                      <span className="flex-grow"></span>
                      <span className="material-symbols-rounded">
                        keyboard_arrow_down
                      </span>
                    </button>
                  )}
                  {routesDetails ? (
                    <>
                      <p className="font-semibold">
                        Phone:{" "}
                        {!("formatted_phone_number" in placeDetails) ? (
                          "Not Available"
                        ) : (
                          <span className="font-normal font-mono bg-slate-200 rounded px-1 select-text">
                            {placeDetails["formatted_phone_number"] as string}
                          </span>
                        )}
                      </p>
                    </>
                  ) : (
                    ""
                  )}

                  {/* <div>
                        <a
                          href={v["ngo_web_url"]}
                          className="flex items-center space-x-2 bg-teal-100 text-teal-800 font-semibold w-fit px-2 rounded-lg mt-1"
                        >
                          <p>Website</p>
                          <span className="material-symbols-rounded text-lg msr-bold">
                            open_in_new
                          </span>
                        </a>
                      </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : undefined}
    </div>
  );
}
