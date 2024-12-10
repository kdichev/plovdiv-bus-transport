import { cn } from "@/lib/utils";
import { chromium } from "playwright";
import testData from "./../test.json";
import { Bus } from "lucide-react";
import Link from "next/link";

export const revalidate = 60;

const scrapeData = async () => {
  const browser = await chromium.launch({ headless: true }); // Set to true if you don't want to see the browser
  const page = await browser.newPage();

  await page.goto("http://transport.plovdiv.bg/mobile/");

  await page.getByText("ТЪРСЕНЕ ПО НОМЕР НА СПИРКА").click();
  await page.waitForTimeout(500);

  await page
    .locator(".z-bandbox-rounded-inp")
    .pressSequentially(`хотел "Тримонциум"`);
  await page.waitForTimeout(1500);

  await page.getByText(`хотел "Тримонциум"`).click();
  await page.waitForTimeout(1500);
  const elements = await page.$$eval(".it-dummy .z-listitem > td", (nodes) =>
    nodes.map((node) => node.textContent?.trim())
  );
  const bussData = elements
    .reduce(
      (acc: (string | undefined)[][], _, i) =>
        i % 4 === 0 ? [...acc, elements.slice(i, i + 4)] : acc,
      []
    )
    .map((i) => {
      return {
        route: i[0],
        arrival: i[1],
        arrivalTime: i[2],
        destination: i[3],
        ...(colors[i[0] || 0] || {}),
      };
    });
  await browser.close();
  return bussData;
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ filter: string | string[] | undefined }>;
}) {
  const bussData = testData || (await scrapeData());
  const uniqueBusses = bussData.reduce((busses: Bus[], currBus: Bus) => {
    if (!busses.some((buss) => buss.route === currBus.route)) {
      busses.push(currBus);
    }
    return busses;
  }, []);
  const queryParams = await searchParams;
  const filters =
    (typeof queryParams.filter === "string"
      ? [queryParams.filter]
      : queryParams.filter) || [];

  console.log(filters);

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
            {uniqueBusses.map((bus) => {
              return (
                <Link
                  key={bus.route}
                  href={{
                    pathname: "/",
                    query: {
                      filter: filters.includes(bus.route || "")
                        ? filters.filter((route) => route !== bus.route)
                        : [...filters, bus.route],
                    },
                  }}
                >
                  <div
                    className={cn([
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2",
                      filters.includes(bus.route || "") && "brightness-50",
                    ])}
                    style={{
                      backgroundColor: bus.color,
                      color: bus.contrastColor || "white",
                    }}
                  >
                    {bus.route}
                  </div>
                </Link>
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

const colors: { [key: string]: { color: string; contrastColor: string } } = {
  "99": { color: "#17B2AE", contrastColor: "black" },
  "44": { color: "#7C70B1", contrastColor: "white" },
  "20": { color: "#008CD3", contrastColor: "white" },
  "4": { color: "#A76380", contrastColor: "white" },
  "26": { color: "#CAD406", contrastColor: "black" },
  "7": { color: "#A92482", contrastColor: "white" },
  "1": { color: "#63972E", contrastColor: "white" },
  "6": { color: "#E4097F", contrastColor: "white" },
  "9": { color: "#008CD3", contrastColor: "white" },
  "10": { color: "#898888", contrastColor: "white" },
  "11": { color: "#393186", contrastColor: "white" },
  "12": { color: "#33A13A", contrastColor: "white" },
  "15": { color: "#57A7B2", contrastColor: "black" },
  "16": { color: "#DDA606", contrastColor: "black" },
  "17": { color: "#E31F24", contrastColor: "white" },
  "18": { color: "#5DA494", contrastColor: "black" },
  "21": { color: "#EE7F1A", contrastColor: "black" },
  "22": { color: "#DDA606", contrastColor: "black" },
  "24": { color: "#393186", contrastColor: "white" },
  "25": { color: "#A65F48", contrastColor: "white" },
  "27": { color: "#EC7475", contrastColor: "black" },
  "29": { color: "#EB5770", contrastColor: "white" },
  "36": { color: "#8C232F", contrastColor: "white" },
  "37": { color: "#008CD3", contrastColor: "white" },
};
