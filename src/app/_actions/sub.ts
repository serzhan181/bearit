"use server";

import { InputsCreateSub } from "@/components/forms/create-sub-form";
import { db } from "@/db";
import { sub } from "@/db/schema";
import { StoredFile } from "@/types";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const allSubs = async () => {
  return await db.select().from(sub);
};

export const addSub = async ({
  name,
  creatorId,
}: InputsCreateSub & { creatorId: string }) => {
  const subsWithSameName = await db.query.sub.findFirst({
    where: eq(sub.name, name),
  });

  if (subsWithSameName) {
    throw new Error("Sub name already taken.");
  }

  await db.insert(sub).values({
    name,
    creatorId,
  });

  revalidatePath(`/r/${name}`);
};

export const updateSub = async ({
  name,
  backgroundImage,
  coverImage,
}: Pick<InputsCreateSub, "name"> & {
  backgroundImage?: StoredFile;
  coverImage?: StoredFile;
}) => {
  const user = auth().user;

  const targetSub = await db.query.sub.findFirst({ where: eq(sub.name, name) });

  if (!user) {
    throw new Error("You have to be signed in!");
  }

  if (targetSub?.creatorId !== user.id) {
    throw new Error("You are not the owner of this sub!");
  }

  if (backgroundImage) {
    await db
      .update(sub)
      .set({ backgroundImages: [backgroundImage] })
      .where(eq(sub.name, name));
  }
  if (coverImage) {
    await db
      .update(sub)
      .set({ coverImages: [coverImage] })
      .where(eq(sub.name, name));
  }

  revalidatePath(`/r/${name}`);
};
