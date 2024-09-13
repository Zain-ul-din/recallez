"use client";

import BookMark from "@/types/bookmark";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { useFormState, useFormStatus } from "react-dom";
import { addTag } from "@/actions/add-tag";

export default function BookmarkDetailsCard({
  bookmark
}: {
  bookmark: BookMark;
}) {
  return (
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
