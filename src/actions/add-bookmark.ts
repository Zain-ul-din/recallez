"use server";

import { connectNeo4j } from "@/lib/neo4j";
import { delay } from "@/lib/utils";
import * as cheerio from "cheerio";
import { revalidatePath } from "next/cache";

type FormState = {
  message?: string;
  error?: string;
};

export default async function addBookMark(
  prevState: FormState,
  formData: FormData
) {
  const url = formData.get("url") as string;

  if (!isValidURL(url)) return { error: "invalid url" };

  const content = await Promise.race([fetchContent(url), delay(3000)]);

  if (typeof content != "string") return { error: "Unable to fetch url" };

  // fetch social cards
  const $ = cheerio.load(content);

  const ogCard = $(`head > [property="og:image"]`).attr("content") || "";
  const title = $(`head > title`).text();
  const description =
    $(`head > meta[name="description"]`).attr("content") ||
    "No description found.";

  console.log(content, "og Card:", ogCard, title, " ", description);

  // if([].every()) validate before

  const { driver, session } = connectNeo4j();

  const res = await session.run(
    `CREATE (
    s:Site 
    { url: $url, ogCard: $ogCard, title: $title, description: $description }
  ) RETURN s;`,
    {
      url,
      ogCard,
      title,
      description
    }
  );

  console.log(res.records.map((r) => r.get(0).properties));

  await session.close();
  await driver.close();

  revalidatePath("/bookmarks");

  return {
    message: "hello world"
  };
}

const fetchContent = async (url: string) => {
  const res = await (
    await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
      }
    })
  ).text();
  return res;
};

const isValidURL = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};
