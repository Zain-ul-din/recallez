"use server";

import { connectNeo4j } from "@/lib/neo4j";
import { delay } from "@/lib/utils";
import { revalidatePath } from "next/cache";

type FormState = {
  message?: string;
  error?: string;
};

// TODO: add validation

export async function addTag(prevState: FormState, formData: FormData) {
  const tag = formData.get("tag");
  const bookmarkId = formData.get("bookmarkId");
  const { driver, session } = connectNeo4j();

  const res = await session.run(
    `
        MATCH (s:Site) WHERE id(s) = toInteger($bookmarkId)
        MERGE (t:Tag { name: $tag })
        MERGE (s)-[:CONTAINS]->(t)
        MERGE (t)-[:TAGGED]->(s)
        RETURN s,t    
    `,
    {
      bookmarkId,
      tag
    }
  );

  await session.close();
  await driver.close();

  revalidatePath(`/bookmarks/${bookmarkId}`);

  return {
    message: ""
  };
}
