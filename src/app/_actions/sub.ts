"use server";

import { InputsCreateSub } from "@/components/forms/create-sub-form";
import { db } from "@/db";
import { sub } from "@/db/schema";
import { StoredFile } from "@/types";
import { currentUser } from "@clerk/nextjs/app-beta";
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
  const user = await currentUser().user;

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

  // revalidatePath(`/r/${name}`);
};

// ! https://stackoverflow.com/questions/76259396/invariant-method-expects-to-have-requestasyncstorage-none-available
// export const subscribeToSub = async (subId: number) => {
// const user = auth().user;
// if (!user) {
//   throw new Error("You are not logged in!");
// }

// console.log("JUST A FUCKING CONSOLE LOG, CAN YOU DO THAT U SCUMBAG??!");

// user.id;
// const subsriptionExists = await db.query.subscription.findFirst({
//   where: (fields, { and }) =>
//     and(eq(fields.subId, subId.toString()), eq(fields.userId, user.id)),
// });

// if (subsriptionExists) {
//   throw new Error("You are already subscribed brotha chill out.");
// }

// await db
//   .insert(subscription)
//   .values({ subId: subId.toString(), userId: user.id });
// };
