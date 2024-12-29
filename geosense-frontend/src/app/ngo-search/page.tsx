"use client";
import useServerData from "@/hooks/useServerData";
import { ChangeEvent, useEffect, useState } from "react";

export default function NgoSearch() {
  const [states, setStates] = useState<string[][]>();
  const [sectors, setSectors] = useState<string[][]>();
  const [selectedState, setSelectedState] = useState<string>();
  const [selectedSectors, setSelectedSectors] = useState<string[]>();
  const [districts, setDistricts] = useState<string[][]>();
  const [selectedDistrict, setSelectedDistrict] = useState<string>();
  const [results, setResults] = useState<Record<string, string>[]>();
  const data = useServerData();

  useEffect(() => {
    const fetchStates = async () => setStates(await data.ngos.getStates());
    const fetchSectors = async () => setSectors(await data.ngos.getSectors());
    fetchStates();
    fetchSectors();
  }, []);

  useEffect(() => {
    setDistricts(undefined);
    if (!selectedState) return;
    const fetchDistricts = async () =>
      setDistricts(await data.ngos.getDistricts(selectedState));
    fetchDistricts();
  }, [selectedState]);

  const handleStateSelectionChanged = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedState(event.target!.value);
  };

  const handleSectorsSelectionChanged = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target!.value;
    if (value.length === 0) return;
    setSelectedSectors((sects) => {
      let newSects = sects;
      if (!sects) newSects = [value];
      else if (sects.indexOf(value) === -1) newSects = [...sects, value];
      if (event.target) event.target.selectedIndex = 0;
      return newSects;
    });
  };

  const handleDistrictSelectionChanged = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedDistrict(event.target!.value);
  };

  const handleSectorChipClicked = (value: string) => {
    setSelectedSectors((sects) => {
      const filteredSects = sects?.filter((v) => v !== value);
      return filteredSects?.length === 0 ? undefined : filteredSects;
    });
  };

  const handleSearchButtonClicked = async () => {
    setResults(
      await data.ngos.search(selectedState, selectedDistrict, selectedSectors)
    );
  };

  return (
    <div className="p-4 flex flex-col space-y-2 select-none">
      <p className="text-2xl font-bold">NGO Search</p>
      <hr />
      <div className="flex flex-col items-stretch mt-2">
        <label className="flex flex-col items-stretch px-2 py-1">
          <p className="font-semibold">State</p>
          <select
            className="appearance-none px-3 py-1 capitalize rounded-lg border-2 border-slate-300 focus:outline-teal-600 disabled:border-transparent disabled:bg-slate-200 transition"
            value={selectedState}
            onChange={handleStateSelectionChanged}
            disabled={states == undefined}
          >
            <option>{states ? undefined : "Loading..."}</option>
            {states?.map((v) => (
              <option key={v[0]} value={v[0]}>
                {v[1].toLowerCase()}
              </option>
            ))}
          </select>
        </label>
        {selectedState ? (
          <label className="flex flex-col items-stretch px-2 py-1">
            <p className="font-semibold">District</p>
            <select
              className="appearance-none px-3 py-1 capitalize rounded-lg border-2 border-slate-300 focus:outline-teal-600 disabled:border-transparent disabled:bg-slate-200 transition"
              value={selectedDistrict}
              onChange={handleDistrictSelectionChanged}
              disabled={districts == undefined}
            >
              <option>{districts ? undefined : "Loading..."}</option>
              {districts?.map((v) => (
                <option key={v[0]} value={v[0]}>
                  {v[1]}
                </option>
              ))}
            </select>
          </label>
        ) : (
          ""
        )}
        <label className="flex flex-col items-stretch px-2 py-1">
          <p className="font-semibold">Sectors</p>
          <select
            disabled={sectors == undefined}
            onChange={handleSectorsSelectionChanged}
            className="appearance-none px-3 py-1 capitalize rounded-lg border-2 border-slate-300 focus:outline-teal-600 disabled:border-transparent disabled:bg-slate-200 transition"
          >
            <option>{sectors ? undefined : "Loading..."}</option>
            {sectors?.map((v) => (
              <option key={v[1]} value={v[1]}>
                {v[1]}
              </option>
            ))}
          </select>
        </label>
        {selectedSectors && selectedSectors.length > 0 ? (
          <ul className="flex flex-wrap gap-2 p-2">
            {selectedSectors.map((v, i) => {
              return (
                <li
                  className="text-xs bg-teal-100 rounded-md font-semibold px-3 py-px flex items-center space-x-2"
                  key={i}
                >
                  <p>{v}</p>
                  <button onClick={() => handleSectorChipClicked(v)}>
                    <span className="material-symbols-rounded text-base msr-bold">
                      close
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : undefined}
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
      </div>
      <hr />
      {results ? (
        <div>
          <p className="text-xl font-semibold">Results</p>
          <div className="flex flex-col gap-2 mt-2">
            {results.map((v) => (
              <div
                role="radiogroup"
                key={v["ngo_name_title"]}
                className="overflow-hidden rounded-md border-2 border-teal-800 bg-teal-800 text-white"
              >
                <input
                  type="radio"
                  name="results-item"
                  id={`result-item-radio-${v["ngo_name_title"]}`}
                  className="hidden peer"
                />
                <label htmlFor={`result-item-radio-${v["ngo_name_title"]}`}>
                  <p className="font-semibold w-full px-4 py-2 capitalize">
                    {v["ngo_name_title"].toLowerCase()}
                  </p>
                </label>
                <div className="bg-slate-50 text-slate-800 text-sm overflow-hidden h-0 p-0 peer-checked:h-fit peer-checked:p-2 transition-all">
                  <p className="font-semibold mb-1">
                    Sectors:{" "}
                    <span className="font-normal capitalize flex flex-wrap gap-1">
                      {v["key_issues"]
                        .toLowerCase()
                        .split(",")
                        .map((v: string, i: number) => (
                          <span className="px-1 bg-teal-100 rounded" key={i}>
                            {v}
                          </span>
                        ))}
                    </span>
                  </p>
                  <p className="font-semibold">
                    NGO Type:{" "}
                    <span className="font-normal capitalize">
                      {v["ngo_type"].toLowerCase()}
                    </span>
                  </p>
                  <p className="font-semibold">
                    Email:{" "}
                    <span className="font-normal font-mono bg-slate-200 rounded px-1 select-text">
                      {v["email_n"].replace("(at)", "@").replace("[dot]", ".")}
                    </span>
                  </p>
                  <p className="font-semibold">
                    City:{" "}
                    <span className="font-normal capitalize">
                      {v["ngo_city_p"].toLowerCase()}
                    </span>
                  </p>
                  <p className="font-semibold">
                    State:{" "}
                    <span className="font-normal capitalize">
                      {v["ngo_state_p"].toLowerCase()}
                    </span>
                  </p>
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="capitalize">{v["address"].toLowerCase()}</p>
                  </div>
                  <div>
                    <a
                      href={v["ngo_web_url"]}
                      className="flex items-center space-x-2 bg-teal-100 text-teal-800 font-semibold w-fit px-2 rounded-lg mt-1"
                    >
                      <p>Website</p>
                      <span className="material-symbols-rounded text-lg msr-bold">
                        open_in_new
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : undefined}
    </div>
  );
}
