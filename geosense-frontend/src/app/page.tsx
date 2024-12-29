"use client";
import usePrediction from "@/hooks/usePrediction";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const predictor = usePrediction();
  return (
    <div className="p-4 flex flex-col">
      <div
        className={`absolute bottom-24 inset-x-8 px-6 py-4 text-center flex flex-col rounded-xl items-center text-white ${predictor.getClassNameFromSeverity()}`}
      >
        <span className="material-symbols-rounded msr-bold text-4xl">
          warning
        </span>
        <p className="text-lime-200xl font-bold">Alert</p>
        <p>
          This location has{" "}
          <span className="font-semibold">
            {predictor.getTextFromSeverity()}
          </span>{" "}
          Alert. Prepare & Protect Yourself.
        </p>
      </div>
      <div className="bg-[#d9d9d9] flex items-center justify-center py-3 rounded-2xl pt-10 mb-4 m-2">
        <img
          src="homeview-min.jpeg"
          alt="logo"
          className="w-2/5 self-center rounded-lg mb-6"
        />
      </div>
      <div className="grid grid-cols-3 p-4 gap-4">
        <button
          className="bg-slate-200 rounded-xl flex flex-col items-center p-3 space-y-4"
          onClick={() => router.push("/gmap-test")}
        >
          <span className="material-symbols-rounded text-4xl">pin_drop</span>
          <p className="font-semibold text-center">Find POIs Near You</p>
        </button>
        <button
          className="bg-slate-200 rounded-xl flex flex-col items-center p-3 space-y-4"
          onClick={() => router.push("/ngo-search")}
        >
          <span className="material-symbols-rounded text-4xl">
            travel_explore
          </span>
          <p className="font-semibold text-center">Find NGOs Near You</p>
        </button>
        <button
          className="bg-slate-200 rounded-xl flex flex-col items-center p-3 space-y-4"
          onClick={() => router.push("/med-chatbot")}
        >
          <span className="material-symbols-rounded text-4xl">smart_toy</span>
          <p className="font-semibold text-center">Medical Chatbot</p>
        </button>
        <a
          className="bg-slate-200 rounded-xl flex flex-col items-center p-3 space-y-4"
          href="https://askdisha.irctc.co.in/"
        >
          <p className="font-semibold text-center">IRCTC Disha Chatbot</p>
        </a>
        {/* 
        <div className="flex flex-col items-stretch text-sm space-y-2">
          <button
            className="bg-slate-200 rounded-xl flex flex-col items-center px-5 py-2 space-y-4"
            onClick={() => router.push("/arcgis-lpv")}
          >
            <p className="font-semibold text-center">ArcGIS Landslide Map</p>
          </button>
          <button
            className="bg-slate-200 rounded-xl flex flex-col items-center px-5 py-2 space-y-4"
            onClick={() => router.push("ext/nasa-lv")}
          >
            <p className="font-semibold text-center">
              NASA Landslide Visualizer
            </p>
          </button>
          <button
            className="bg-slate-200 rounded-xl flex flex-col items-center px-5 py-2 space-y-4"
            onClick={() => router.push("ext/arcgis-lpv")}
          >
            <p className="font-semibold text-center">ArcGIS Landslide Map</p>
          </button>
        </div> */}
      </div>
      <p className="hidden bg-yellow-600 bg-orange-600 bg-orange-700 bg-red-600 bg-red-800"></p>
    </div>
  );
}
