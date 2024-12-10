"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Bus {
  id?: number;
  route: string | undefined;
  destination: string | undefined;
  destinationLatin?: string;
  arrival: string | undefined;
  arrivalTime: string | undefined;
  stops?: { name: string; timeFromStart: number }[];
  zeroCount?: number;
  color: string;
  contrastColor?: string;
}

export default function BusStationBoard({ data }: { data: Bus[] }) {
  const [busFilter, setBusFilter] = useState<string[]>([]);
  return (
    <div className="flex flex-col items-center  min-h-screen bg-gray-100 text-gray-800 p-4 pt-1">
      <div className="w-full max-w-6xl overflow-hidden">
        <div className="p-4 rounded-lg" style={{ backgroundColor: "#015495" }}>
          <div className="flex">
            <div>
              <h1 className="text-4xl font-bold text-white">
                Спирка Тримонциум
              </h1>
              <span className="text-xs text-gray-600 text-white">
                Bus Stop Trimontium
              </span>
            </div>
            <div className="text-5xl text-white font-bold flex flex-col items-end flex-1">
              45
            </div>
          </div>
          <div className="flex">
            {data
              .reduce((acc: Bus[], curr: Bus) => {
                if (!acc.some((item: Bus) => item.route === curr.route)) {
                  acc.push(curr);
                }
                return acc;
              }, [])
              .map((bus) => (
                <div
                  key={bus.route}
                  className={cn([
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2",
                    busFilter.includes(bus.route || "") && "brightness-50",
                  ])}
                  style={{
                    backgroundColor: bus.color,
                    color: bus.contrastColor || "white",
                  }}
                  onClick={() => {
                    setBusFilter((prev) => {
                      if (prev.map((p) => p).includes(bus.route || "")) {
                        return prev.filter((a) => a !== bus.route);
                      }
                      return [...prev, bus.route || ""];
                    });
                  }}
                >
                  {bus.route}
                </div>
              ))}
          </div>
        </div>
        <div className="p-0 relative pt-2">
          <div className="space-y-2">
            {(busFilter.length > 0
              ? data.filter((route) => busFilter.includes(route.route || ""))
              : data
            ).map((bus: Bus, i) => (
              <div
                key={i}
                className="bg-white  rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className="w-12 flex items-center justify-center text-white font-bold rounded-lg mr-2 px-2 text-1xl text-2xl"
                      style={{
                        backgroundColor: bus.color,
                        color: bus?.contrastColor || "white",
                      }}
                    >
                      {bus.route}
                    </div>
                    <div>
                      <div className="text-lg font-semibold leading-none">
                        {bus.destination}
                      </div>
                      <div className="text-xs text-gray-500">
                        {bus.destinationLatin}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-xs text-gray-500 text-right">
                      {bus.arrivalTime}
                    </div>
                    <div className="text-right text-lg font-semibold">
                      {parseInt(bus?.arrival || "0")}&nbsp;мин
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
