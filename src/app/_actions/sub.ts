"use server";

import { InputsCreateSub } from "@/components/forms/create-sub-form";
import { db } from "@/db";
import { sub } from "@/db/schema";
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
