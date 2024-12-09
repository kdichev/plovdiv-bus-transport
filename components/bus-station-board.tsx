"use client";

import { useEffect, useState } from "react";
import { Clock, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Bus {
  id: number;
  route: string;
  destination: string;
  destinationLatin: string;
  arrival: string;
  arrivalTime: string;
  stops: { name: string; timeFromStart: number }[];
  zeroCount: number;
  color: string;
}

const initialBuses: Bus[] = [
  {
    id: 1,
    route: "99",
    destination: "Гара Тракия",
    destinationLatin: "Gara Trakia",
    arrival: "5",
    arrivalTime: "10:05",
    stops: [
      { name: "Central Station", timeFromStart: 0 },
      { name: "Main Street", timeFromStart: 5 },
      { name: "Downtown", timeFromStart: 10 },
    ],
    zeroCount: 0,
    color: "#17B2AE",
    contrastColor: "black",
  },
  {
    id: 2,
    route: "44",
    destination: "ул. Цар Симеон",
    destinationLatin: "Tsar Simeon",
    arrival: "10",
    arrivalTime: "10:10",
    stops: [
      { name: "Central Station", timeFromStart: 0 },
      { name: "Highway 1", timeFromStart: 10 },
      { name: "Airport", timeFromStart: 20 },
    ],
    zeroCount: 0,
    color: "#7C70B1",
  },
  {
    id: 3,
    route: "20",
    destination: "Коматево",
    destinationLatin: "Komatevo",
    arrival: "15",
    arrivalTime: "10:15",
    stops: [
      { name: "Central Station", timeFromStart: 0 },
      { name: "Campus Road", timeFromStart: 8 },
      { name: "University", timeFromStart: 15 },
    ],
    zeroCount: 0,
    color: "#008CD3",
  },
  {
    id: 4,
    route: "4",
    destination: "Тракия А-13",
    destinationLatin: "Trakia A-13",
    arrival: "20",
    arrivalTime: "10:20",
    stops: [
      { name: "Central Station", timeFromStart: 0 },
      { name: "High Street", timeFromStart: 7 },
      { name: "Shopping Mall", timeFromStart: 15 },
    ],
    zeroCount: 0,
    color: "#A76380",
  },
  {
    id: 5,
    route: "26",
    destination: "Юндола",
    destinationLatin: "Yundola",
    arrival: "25",
    arrivalTime: "10:25",
    stops: [
      { name: "Central Station", timeFromStart: 0 },
      { name: "Coastal Highway", timeFromStart: 15 },
      { name: "Beach", timeFromStart: 25 },
    ],
    zeroCount: 0,
    color: "#CAD406",
    contrastColor: "black",
  },
  {
    id: 6,
    route: "7",
    destination: "Беломорски",
    destinationLatin: "Belomorski",
    arrival: "30",
    arrivalTime: "10:30",
    stops: [
      { name: "Central Station", timeFromStart: 0 },
      { name: "Stadium Drive", timeFromStart: 12 },
      { name: "Sports Stadium", timeFromStart: 25 },
    ],
    zeroCount: 0,
    color: "#A92482",
  },
];

export default function BusStationBoard() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [buses, setBuses] = useState(initialBuses);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const updatedBuses = buses
          .map((bus) => {
            const newArrival = Math.max(0, parseInt(bus.arrival) - 1);
            const newZeroCount =
              newArrival === 0 ? bus.zeroCount + 1 : bus.zeroCount;
            return {
              ...bus,
              arrival: newArrival.toString(),
              zeroCount: newZeroCount,
            };
          })
          .filter((bus) => bus.zeroCount < 2); // Remove buses that have been at zero more than once
        setBuses(updatedBuses);
        setIsLoading(false);
      }, 2000); // Simulate 2 seconds loading time
    };

    const dataRefreshInterval = setInterval(fetchData, 60000); // 60000 ms = 1 minute

    return () => {
      clearInterval(dataRefreshInterval);
    };
  }, [buses]);

  const handleBusClick = (bus: Bus) => {
    setSelectedBus(bus);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedBus(null);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4 pt-1">
      <div className="w-full max-w-6xl overflow-hidden">
        <div className="text-sm text-gray-600 mb-1 flex justify-between">
          <div>
            {currentDateTime.toLocaleDateString("bg-BG", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div>
            {currentDateTime.toLocaleTimeString("bg-BG").split(" ч.")[0]}
          </div>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: "#015495" }}>
          <div className="flex justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Спирка Тримонциум
              </h1>
              <span className="text-xs text-gray-600 text-white">
                Bus Stop "Trimontium"
              </span>
              <div className="flex">
                {initialBuses.map((bus) => (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2"
                    style={{
                      backgroundColor: bus.color,
                      color: bus.contrastColor || "white",
                    }}
                  >
                    {bus.route}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div
                className="text-6xl text-white font-bold "
                style={{ textAlign: "end" }}
              >
                45
              </div>
            </div>
          </div>
        </div>
        <div className="p-0 relative pt-2">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
              <RefreshCw className="animate-spin text-gray-600 w-8 h-8" />
            </div>
          )}
          <div className="hidden md:grid md:grid-cols-5 md:gap-4 font-bold mb-2 text-lg border-b border-gray-300 pb-2">
            <div className="flex flex-col">
              <span>Линия</span>
              <span className="text-xs text-gray-500">Route</span>
            </div>
            <div className="col-span-2 flex flex-col">
              <span>Дестинация</span>
              <span className="text-xs text-gray-500">Destination</span>
            </div>
            <div className="text-right flex flex-col items-end">
              <span>Пристига след</span>
              <span className="text-xs text-gray-500">Arrives in</span>
            </div>
            <div className="text-right flex flex-col items-end">
              <span>Час на пристигане</span>
              <span className="text-xs text-gray-500">Arrival time</span>
            </div>
          </div>
          {buses.length > 0 ? (
            <div className="md:hidden space-y-2">
              {buses.map((bus) => (
                <BusCard
                  key={bus.id}
                  bus={bus}
                  onClick={() => handleBusClick(bus)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xl">
              <p>В момента няма автобуси. Моля, проверете по-късно.</p>
              <p className="text-sm text-gray-500">
                No buses at the moment. Please check back later.
              </p>
            </div>
          )}
          <div className="hidden md:block">
            {buses.length > 0
              ? buses.map((bus) => (
                  <BusRow
                    key={bus.id}
                    bus={bus}
                    onClick={() => handleBusClick(bus)}
                  />
                ))
              : null}
          </div>
        </div>
      </div>
      <RouteDetailsModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        bus={selectedBus}
      />
    </div>
  );
}

function BusCard({ bus, onClick }: { bus: Bus; onClick: () => void }) {
  return (
    <div
      className="bg-white shadow rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div
            className="w-10 h-10 flex items-center justify-center text-white font-bold rounded-lg mr-2 px-2 text-1xl"
            style={{
              backgroundColor: bus.color,
              color: bus?.contrastColor || "white",
            }}
          >
            {bus.route}
          </div>
          <div>
            <div className="font-semibold">{bus.destination}</div>
            <div className="text-xs text-gray-500">{bus.destinationLatin}</div>
          </div>
        </div>
        <div className="font-mono text-right">{bus.arrivalTime}</div>
      </div>
      <div className="text-right text-lg font-semibold">
        {parseInt(bus.arrival)} мин
      </div>
    </div>
  );
}

function BusRow({ bus, onClick }: { bus: Bus; onClick: () => void }) {
  return (
    <div
      className="grid grid-cols-5 gap-4 py-2 border-b border-gray-200 text-lg cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center">
        <div
          className="w-10 h-10 flex items-center justify-center text-white font-bold rounded-lg px-2 text-1xl"
          style={{
            backgroundColor: bus.color,
            color: bus?.contrastColor || "white",
          }}
        >
          {bus.route}
        </div>
      </div>
      <div className="col-span-2">
        <div>{bus.destination}</div>
        <div className="text-xs text-gray-500">{bus.destinationLatin}</div>
      </div>
      <div className="font-mono text-right">{parseInt(bus.arrival)} мин</div>
      <div className="font-mono text-right">{bus.arrivalTime}</div>
    </div>
  );
}

function RouteDetailsModal({
  isOpen,
  onClose,
  bus,
}: {
  isOpen: boolean;
  onClose: () => void;
  bus: Bus | null;
}) {
  if (!bus) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-gray-800 border border-gray-300">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <div
              className="w-12 h-10 flex items-center justify-center text-white font-bold rounded-lg mr-2 px-2"
              style={{ backgroundColor: bus.color }}
            >
              {bus.route}
            </div>
            <span>Маршрут до {bus.destination}</span>
          </DialogTitle>
          <span className="text-sm text-gray-500">
            Route to {bus.destinationLatin}
          </span>
        </DialogHeader>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">
            <span>Спирки:</span>
            <span className="text-sm text-gray-500 ml-2">Stops:</span>
          </h3>
          <div className="space-y-4">
            {bus.stops.map((stop, index) => (
              <div key={index} className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-800 flex items-center justify-center mr-4">
                  {index + 1}
                </div>
                <div className="flex-grow">
                  <p className="font-medium">{stop.name}</p>
                  <p className="text-sm text-gray-500">
                    {stop.timeFromStart} мин от началото / mins from start
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">
            <span>Визуализация на маршрута:</span>
            <span className="text-sm text-gray-500 ml-2">
              Route Visualization:
            </span>
          </h3>
          <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
            {bus.stops.map((stop, index) => (
              <div
                key={index}
                className="absolute top-0 w-4 h-4 rounded-full bg-gray-400"
                style={{
                  left: `calc(${
                    (stop.timeFromStart /
                      bus.stops[bus.stops.length - 1].timeFromStart) *
                    100
                  }% - 8px)`,
                }}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
