"use server";

import { InputsCreatePost } from "@/components/forms/create-post-form";
import { db } from "@/db";
import { post } from "@/db/schema";
import { StoredFile } from "@/types";
import { revalidatePath } from "next/cache";

export const addPostToSub = async ({
  userId,
  subId,
  content,
  title,
  authorName,
  images,
}: InputsCreatePost & {
  authorName: string;
  userId: string;
  images: StoredFile[] | null;
}) => {
  await db.insert(post).values({
    authorId: userId,
    title,
    subId,
    content,
    authorName,
    images,
  });

  revalidatePath("/");
};
