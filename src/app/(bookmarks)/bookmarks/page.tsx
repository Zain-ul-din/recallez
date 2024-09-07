import { ThemeToggler } from "@/components/bookmarks/theme-toggler";

export default function BookMarksPage() {
  return (
    <>
      <header className="w-full flex p-4 border-b">
        <ThemeToggler className="ml-auto" />
      </header>
      BookMark List
    </>
  );
}
