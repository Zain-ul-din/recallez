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

  const res = await session.run(`MATCH (s:Site) WHERE id(s) = $id RETURN s`, {
    id: neo4j.int(id)
  });

  const bookmark = (
    res.records.length > 0 ? res.records[0].get("s").properties : null
  ) as BookMark;

  await session.close();
  await driver.close();

  return (
    <div
      className="w-full h-full grid py-12"
      style={{
        gridTemplateColumns: "1fr min(700px, calc(100% - 16px)) 1fr"
      }}
    >
      <div></div>
      <div className="w-full border rounded-md rounded-t-none">
        <div
          dangerouslySetInnerHTML={{
            __html: `
          <img src="${bookmark.ogCard}" alt="${bookmark.title} card" style="width:100%; max-width: 100%; height: auto; max-height: 450px; border-radius: .2rem; object-fit: cover;" onerror="this.onerror=null;this.src='/images/placeholder.svg'"/>
          `
          }}
        >
          {/* <img
          src={imgUrl}
          alt={`${bookmark.title} og card`}
          className="w-full h-48 object-cover"
          onError={(e) => {
            alert("error");
            console.log(e);
            }}
            /> */}
        </div>
        <div className="p-4 my-4">
          <h1 className="text-xl font-medium">{bookmark.title}</h1>
          <p className="mt-2 text-muted-foreground">{bookmark.description}</p>
          <div className="mt-6">
            <h1 className="text-lg font-medium">Tags</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                "AI",
                "Personal Project",
                "Node js",
                "Blogs",
                "Dev 2",
                "Blogs",
                "Dev 2",
                "Blogs",
                "Dev 2",
                "Blogs",
                "Dev 2"
              ].map((tag, idx) => {
                return (
                  <span
                    key={idx}
                    className="p-2 border rounded-[1rem] px-4 bg-primary-foreground/40 hover:bg-accent cursor-pointer min-w-14 text-center text-sm"
                  >
                    {tag}
                  </span>
                );
              })}
              <Button className="rounded-[1rem] w-16">
                <PlusIcon />
              </Button>
              {/* <span className="p-2 border rounded-[1rem] px-6 cursor-pointer hover:bg-accent/50">
                <PlusIcon />
              </span> */}
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
}
