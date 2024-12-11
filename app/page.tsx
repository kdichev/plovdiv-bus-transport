import { chromium } from "playwright";
// import testData from "./../test.json";
import { StationBoard } from "@/components/bus-schedule-station";

export const revalidate = 60;

const scrapeData = async () => {
  const browser = await chromium.launch({ headless: true });
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
        route: i[0] || "",
        arrival: i[1],
        arrivalTime: i[2],
        destination: i[3],
        ...(colors[i[0] || 0] || {}),
      };
    });
  await browser.close();
  return bussData;
};

export default async function Home() {
  const bussData = await scrapeData();
  return <StationBoard bussData={bussData} />;
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
