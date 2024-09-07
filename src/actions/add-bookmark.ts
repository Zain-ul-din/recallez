"use server";

type FormState = {
  message: string;
};

export default async function addBookMark(
  prevState: FormState,
  formData: FormData
) {
  const url = formData.get("url");

  await new Promise((r) => setTimeout(r, 3000));

  return {
    message: "hello world"
  };
}
