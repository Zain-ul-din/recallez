"use client";
import BookMark from "@/types/bookmark";
import { createContext, ReactNode, useContext } from "react";

const Context = createContext<BookMark[]>([]);

export const BookMarksProvider = ({
  bookmarks,
  children
}: {
  bookmarks: BookMark[];
  children: ReactNode;
}) => {
  return <Context.Provider value={bookmarks}>{children}</Context.Provider>;
};

export const useBookMarks = () => {
  const bookmarks = useContext(Context);
  return bookmarks;
};
