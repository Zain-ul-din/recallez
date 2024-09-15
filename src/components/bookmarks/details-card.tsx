"use client";
import BookMark from "@/types/bookmark";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { useFormState, useFormStatus } from "react-dom";
import { addTag } from "@/actions/add-tag";
// @ts-ignore
import * as Viva from "vivagraphjs";

export default function BookmarkDetailsCard({
  bookmark
}: {
  bookmark: BookMark;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const graph = Viva.Graph.graph();

    // add nodes
    graph.addNode(`bookmark-${bookmark.id}`, {
      url: bookmark.ogCard
    });

    bookmark.tags?.forEach((tag) => {
      graph.addNode(`tag-${tag.id}`, { name: tag.name });
    });

    // add connections
    bookmark.tags?.forEach((tag) => {
      graph.addLink(`bookmark-${bookmark.id}`, `tag-${tag.id}`, {
        connectionStrength: 10
      });
    });

    // {graph.addNode("anvaka", {
    //   url: "https://secure.gravatar.com/avatar/91bad8ceeec43ae303790f8fe238164b"
    // });
    // graph.addNode("manunt", {
    //   url: "https://secure.gravatar.com/avatar/c81bfc2cf23958504617dd4fada3afa8"
    // });
    // graph.addNode("thlorenz", {
    //   url: "https://secure.gravatar.com/avatar/1c9054d6242bffd5fd25ec652a2b79cc"
    // });
    // graph.addNode("bling", {
    //   url: "https://secure.gravatar.com/avatar/24a5b6e62e9a486743a71e0a0a4f71af"
    // });
    // graph.addNode("diyan", {
    //   url: "https://secure.gravatar.com/avatar/01bce7702975191fdc402565bd1045a8?"
    // });
    // graph.addNode("pocheptsov", {
    //   url: "https://secure.gravatar.com/avatar/13da974fc9716b42f5d62e3c8056c718"
    // });
    // graph.addNode("dimapasko", {
    //   url: "https://secure.gravatar.com/avatar/8e587a4232502a9f1ca14e2810e3c3dd"
    // });

    // graph.addLink("anvaka", "manunt");
    // graph.addLink("anvaka", "thlorenz");
    // graph.addLink("anvaka", "bling");
    // graph.addLink("anvaka", "diyan");
    // graph.addLink("anvaka", "pocheptsov");
    // graph.addLink("anvaka", "dimapasko");}

    const graphics = Viva.Graph.View.svgGraphics();

    graphics
      .node(function (node: any) {
        if (node.data.name) {
          var ui = Viva.Graph.svg("g");
          const svgText = Viva.Graph.svg("text")
            .attr("fill", "white")
            .attr("font-size", "12px")
            .attr("text-anchor", "middle") // Centers the text horizontally
            .text(node.data.name);

          const circle = Viva.Graph.svg("circle")
            .attr("r", 30)
            .attr("fill", "rgba(255,2,0,0.2)");

          ui.append(svgText);
          ui.append(circle);
          return ui;
        }

        // The function is called every time renderer needs a ui to display node
        return Viva.Graph.svg("image")
          .attr("width", 150)
          .attr("height", 120)
          .link(node.data.url); // node.data holds custom object passed to graph.addNode();
      })
      .placeNode(function (nodeUI: any, pos: any) {
        if (nodeUI.tagName === "circle") {
          // Position the circle a bit apart from the image (adjust as needed)
          nodeUI.attr("cx", pos.x).attr("cy", pos.y);
        } else if (nodeUI.tagName === "g") {
          nodeUI.attr("transform", `translate(${pos.x}, ${pos.y})`);

          // Find the text and move it relative to the circle (adjust as needed)
          const text = nodeUI.childNodes[1]; // Assuming the text is appended after the circle
          text.attr("x", 0).attr("y", 0); // Place the text below the circle
        } else {
          // Shift image to let links go to the center:
          nodeUI.attr("x", pos.x - 180 / 2).attr("y", pos.y - 150 / 2);
        }
      });

    const layout = Viva.Graph.Layout.forceDirected(graph, {
      gravity: -8, // Repulsion between nodes
      springTransform: (link: any, spring: any) => {
        spring.length = 250; // Define link length between nodes
      }
    });

    const renderer = Viva.Graph.View.renderer(graph, {
      container: ref.current,
      graphics,
      layout
    });

    renderer.run();

    return () => {
      renderer.dispose();
    };
  }, [bookmark, ref]);

  return (
    <>
      <div ref={ref} className="graph border"></div>
      <div className="w-full border rounded-md rounded-t-none my-12">
        <div
          dangerouslySetInnerHTML={{
            __html: `
          <img src="${bookmark.ogCard}" alt="${bookmark.title} card" style="width:100%; max-width: 100%; height: auto; max-height: 450px; border-radius: .2rem; object-fit: cover;" onerror="this.onerror=null;this.src='/images/placeholder.svg'"/>
          `
          }}
        ></div>
        <div className="p-4 my-4">
          <h1 className="text-xl font-medium">{bookmark.title}</h1>
          <p className="mt-2 text-muted-foreground">{bookmark.description}</p>
          <div className="mt-6">
            <h1 className="text-lg font-medium">Tags</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {(bookmark.tags || []).map((tag, idx) => {
                return (
                  <span
                    key={idx}
                    className="p-2 border rounded-[1rem] px-4 bg-primary-foreground/40 hover:bg-accent cursor-pointer min-w-14 text-center text-sm"
                  >
                    {tag.name}
                  </span>
                );
              })}
              <AddTagForm bookmarkId={bookmark.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const AddTagForm = ({ bookmarkId }: { bookmarkId: string }) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [state, action] = useFormState(addTag, { message: "" });

  useEffect(() => {
    if (isFocus && inputRef.current) inputRef.current.focus();
  }, [isFocus]);

  return (
    <form
      onSubmit={(e) => {
        setIsFocus(false);
      }}
      action={(payload) => {
        action(payload);
      }}
    >
      {!isFocus ? (
        <AddTagBtn onClick={() => setIsFocus(true)} />
      ) : (
        <>
          <input type="hidden" name="bookmarkId" value={bookmarkId} />
          <Input
            ref={inputRef}
            size={12}
            placeholder="Add tag name"
            className="rounded-[1rem]"
            onBlur={() => {
              setIsFocus(false);
            }}
            name="tag"
          />
        </>
      )}
    </form>
  );
};

const AddTagBtn = ({ onClick }: { onClick: () => void }) => {
  const { pending } = useFormStatus();
  return (
    <Button
      variant={"outline"}
      className="rounded-[1rem] w-16"
      onClick={onClick}
      isLoading={pending}
    >
      <PlusIcon />
    </Button>
  );
};
