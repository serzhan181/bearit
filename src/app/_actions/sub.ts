"use server";

import { db } from "@/db";
import { sub } from "@/db/schema";

export const allSubs = async () => {
  return await db.select().from(sub);
};
