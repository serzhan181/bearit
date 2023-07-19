import { Container } from "@/components/layout/container";
import { PageParams } from "@/types";
import { db } from "@/db";
import { sub as subModel } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { SubBannerImg } from "./_components/sub-banner-img";
import { SubCoverImg } from "./_components/sub-cover-img";
import { auth } from "@clerk/nextjs";

export default async function Subbearit({
  params,
}: PageParams<{ name: string }>) {
  const subName = params.name;
  const userId = auth().userId;

  const sub = await db.query.sub.findFirst({
    where: eq(subModel.name, subName),
  });
  if (!sub) {
    return notFound();
  }

  const isOwner = userId === sub.creatorId;

  return (
    <>
      <Container className="mt-0">
        {/* SubBannerImg */}
        <SubBannerImg
          image={sub?.backgroundImages && sub.backgroundImages[0]}
          subId={sub.id}
          name={sub.name}
          isOwner={isOwner}
        />
      </Container>
      <Container className="mt-0">
        <div className="flex items-center gap-4 px-2 py-4 bg-accent/30">
          {/* SubCoverImg */}
          <SubCoverImg
            image={sub?.coverImages && sub.coverImages[0]}
            subId={sub.id}
            name={sub.name}
            isOwner={isOwner}
          />
          <p className="text-2xl font-semibold">r/{sub.name}</p>
        </div>
      </Container>
    </>
  );
}
