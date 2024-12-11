"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface Bus {
  id?: number;
  route: string;
  destination: string | undefined;
  destinationLatin?: string;
  arrival: string | undefined;
  arrivalTime: string | undefined;
  stops?: { name: string; timeFromStart: number }[];
  zeroCount?: number;
  color: string;
  contrastColor?: string;
}

export function StationBoard({ bussData }: { bussData: Bus[] }) {
  const uniqueBusses = bussData.reduce((busses: Bus[], currBus: Bus) => {
    if (!busses.some((buss) => buss.route === currBus.route)) {
      busses.push(currBus);
    }
    return busses;
  }, []);
  const [filters, setFilters] = useState<string[]>([]);
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-2">
        <div className="p-3 rounded-lg " style={{ backgroundColor: "#015495" }}>
          <div className="flex justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Спирка Тримонциум
              </h1>
              <span className="text-md text-white">Bus Stop Trimontium</span>
            </div>
            <div className="text-5xl text-white font-bold">45</div>
          </div>
          <div className="flex">
            {uniqueBusses.map((bus, index) => {
              return (
                <div
                  key={index}
                  className={cn([
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2",
                    filters.includes(bus.route) && "brightness-50",
                  ])}
                  style={{
                    backgroundColor: bus.color,
                    color: bus.contrastColor || "white",
                  }}
                  onClick={() => {
                    setFilters((prevFilter) =>
                      prevFilter.includes(bus.route)
                        ? prevFilter.filter((route) => route !== bus.route)
                        : [...prevFilter, bus.route]
                    );
                  }}
                >
                  {bus.route}
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-2">
          {(filters.length > 0
            ? bussData.filter((route) => filters.includes(route.route || ""))
            : bussData
          ).map((bus, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-2 hover:bg-gray-50 transition-colors mt-2"
            >
              <div className="flex">
                <div
                  className="w-12 flex items-center justify-center font-bold rounded-lg mr-2 text-2xl"
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
                  <div className="text-xs text-gray-500">test</div>
                </div>
                <div className="flex flex-col flex-1">
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
  );
}
