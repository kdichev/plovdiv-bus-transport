import { chromium } from "playwright";

export async function GET() {
  const browser = await chromium.launch({ headless: true }); // Set to true if you don't want to see the browser
  const page = await browser.newPage();

  await page.goto("http://transport.plovdiv.bg/mobile/");

  const title = await page.title();
  await page.getByText("ТЪРСЕНЕ ПО НОМЕР НА СПИРКА").click();
  await page.waitForTimeout(500);

  await page
    .locator(".z-bandbox-rounded-inp")
    .pressSequentially(`срещу ТЕЦ "Север"`);
  await page.waitForTimeout(1500);

  await page.getByText(`срещу ТЕЦ "Север"`).click();
  await browser.close();
  return Response.json({ title });
}

export const revalidate = 60;
