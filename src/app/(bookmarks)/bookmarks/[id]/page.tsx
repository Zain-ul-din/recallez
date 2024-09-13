import BookmarkDetailsCard from "@/components/bookmarks/details-card";
import { Button } from "@/components/ui/button";
import { connectNeo4j } from "@/lib/neo4j";
import BookMark from "@/types/bookmark";
import { PlusIcon } from "lucide-react";
import neo4j from "neo4j-driver";

export default async function SingleBookMark({
  params: { id }
}: {
  params: { id: string };
}) {
  const { session, driver } = connectNeo4j();

  const res = await session.run(
    `MATCH (s:Site) WHERE id(s) = $id 
    MATCH (s)-[:CONTAINS]->(t:Tag) RETURN s, collect(t) as tags 
  `,
    {
      id: neo4j.int(id)
    }
  );

  const bookmark = (
    res.records.length > 0
      ? {
          id,
          ...res.records[0].get("s").properties,
          tags: res.records[0].get("tags").map((tag: any) => {
            return {
              id: tag.identity.toString(),
              ...tag.properties
            };
          })
        }
      : null
  ) as BookMark;

  await session.close();
  await driver.close();

  return (
    <div
      className="w-full h-full grid"
      style={{
        gridTemplateColumns: "1fr min(700px, calc(100% - 16px)) 1fr"
      }}
    >
      <div></div>
      <BookmarkDetailsCard bookmark={bookmark} />
      <div></div>
    </div>
  );
}
