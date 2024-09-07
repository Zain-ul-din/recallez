"use client";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function SideBar() {
  return (
    <div
      className={cn(
        "absolute left-0 top-0 bottom-0 w-2/12  border-r max-w-screen-sm min-w-72",
        "border-border rounded-r-md bg-secondary dark:bg-background",
        "-translate-x-[95%] hover:translate-x-0 transition-all duration-200",
        "p-6 flex flex-col"
      )}
    >
      <h1 className="text-xl font-medium">Bookmarks</h1>

      <AddBtn />
    </div>
  );
}

import { useFormState, useFormStatus } from "react-dom";
import addBookMark from "@/actions/add-bookmark";

const AddBtn = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [state, action] = useFormState(addBookMark, {
    message: ""
  });

  return (
    <>
      <div className="mt-12 flex flex-col">
        <span
          onClick={() => {
            setIsOpen((v) => !v);
          }}
          className="p-2 bg-white dark:bg-background border relative w-8 h-8 flex justify-center items-center  rounded-[50%] hover:bg-secondary hover:dark:bg-accent cursor-pointer"
        >
          <PlusIcon className="w-4 h-4 inset-0" />
        </span>

        <form
          action={action}
          className={cn(
            "my-2 flex flex-col gap-2 transition-all duration-75 ease-in-out",
            isOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <Input placeholder="Enter Website URL" name="url" size={8} required />{" "}
          <FormSubmitBtn />
        </form>
      </div>
    </>
  );
};

const FormSubmitBtn = () => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant={"outline"} isLoading={pending}>
      Add
    </Button>
  );
};
