"use server";

import { db } from "@/db";
import { post } from "@/db/schema";
import { revalidatePath } from "next/cache";

export const addPostToSub = async ({
  userId,
  subId,
  content,
  title,
}: {
  userId: string;
  subId: string;
  content: string;
  title: string;
}) => {
  await db.insert(post).values({ authorId: userId, title, subId, content });

  revalidatePath("/");
};
