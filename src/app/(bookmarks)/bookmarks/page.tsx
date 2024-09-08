/* eslint-disable @next/next/no-img-element */
"use client";
import { ThemeToggler } from "@/components/bookmarks/theme-toggler";
import { useBookMarks } from "@/providers/bookmarks";
import BookMark from "@/types/bookmark";
import { useState } from "react";

export default function BookMarksPage() {
  const bookmarks = useBookMarks();

  return (
    <>
      <header className="w-full p-4 border-b text-white flex items-center">
        <ThemeToggler className="ml-auto" />
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-4 py-4">
        {bookmarks.map((bookmark, idx) => (
          <BookMarkCard key={idx} bookmark={bookmark} />
        ))}
      </section>
    </>
  );
}

const BookMarkCard = ({ bookmark }: { bookmark: BookMark }) => {
  const [imgUrl, setImgUrl] = useState<string>(bookmark.ogCard);

  // useEffect(() => {
  //   if (imgUrl.length === 0) {
  //     setImgUrl("/images/placeholder.svg");
  //   } else if (imgUrl.startsWith("http")) {
  //     axios(imgUrl)
  //       .then((res) => {
  //         console.log(res.status);
  //       })
  //       .catch((error) => {
  //         console.log(bookmark.title, " ", error.response);
  //         // Handle error response
  //         if (error.response) {
  //           // The server responded with a status code outside the 2xx range
  //           console.log("Error status code:", error.response.status);
  //         } else if (error.request) {
  //           // The request was made, but no response was received
  //           console.log("No response received:", error.request);
  //         } else {
  //           // Something happened in setting up the request that triggered an Error
  //           console.log("Error setting up request:", error.message);
  //         }
  //       });

  //     // fetch(imgUrl).then(async (res) => {
  //     //   alert(res.status);
  //     //   console.log(res.status);
  //     //   if (res.ok) {
  //     //     console.log("Status code:", res.status);
  //     //     const blob = await res.blob();
  //     //     console.log("from: ", bookmark.title, " ", " - ", blob);
  //     //   } else {
  //     //     console.log("Res is not ok");
  //     //     alert("hey");
  //     //   }
  //     // });
  //   }
  // }, [imgUrl]);

  return (
    <div className="bg-background hover:bg-accent/15 border rounded-lg shadow-lg overflow-hidden">
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <img src="${imgUrl}" alt="${bookmark.title} card" style="width:100%; height:12rem; object-fit: cover;" onerror="this.onerror=null;this.src='/images/placeholder.svg'"/>
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
      <div className="p-4">
        <h1 className="text-lg font-medium line-clamp-2">{bookmark.title}</h1>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
          {bookmark.description}
        </p>
      </div>
    </div>
  );
};
