import { Container } from "@/components/layout/container";
import { PageParams } from "@/types";
import { db } from "@/db";
import { sub as subModel } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function Subbearit({
  params,
}: PageParams<{ name: string }>) {
  const subName = params.name;

  const sub = await db.query.sub.findFirst({
    where: eq(subModel.name, subName),
  });
  if (!sub) {
    return notFound();
  }

  return <Container>Community name: {sub.name}</Container>;
}
