import { Container } from "@/components/layout/container";
import { PostBody } from "@/components/post";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel } from "@/components/ui/carousel";
import { PostVoteServer } from "@/components/ui/post-vote-server";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { Post, Vote } from "@/db/schema";
import { redis } from "@/lib/redis";
import { fromNow } from "@/lib/utils";
import { CachedPost } from "@/types/redis";
import { ArrowBigDown, ArrowBigUp, Link, Loader2 } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface DetailedPostPageProps {
  params: {
    postId: string;
    name: string;
  };
}

export default async function DetailedPostPage({
  params,
}: DetailedPostPageProps) {
  const subName = params.name;
  const cachedPost = (await redis.hgetall(
    `post:${params.postId}`
  )) as CachedPost;

  let post: (Post & { votes: Vote[] }) | null | undefined = null;

  if (!cachedPost) {
    post = await db.query.post.findFirst({
      where: (fields, { eq }) => eq(fields.id, parseInt(params.postId)),
      with: {
        votes: true,
      },
    });
  }

  if (!post && !cachedPost) return notFound();

  return (
    <Container>
      <div className="flex gap-4 min-h-[128px] p-4 border rounded-sm shadow border-border">
        <Suspense fallback={<PostVoteShell />}>
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
            getData={async () =>
              await db.query.post.findFirst({
                where: (fields, { eq }) =>
                  eq(fields.id, parseInt(params.postId)),
                with: { votes: true },
              })
            }
          />
        </Suspense>

        <PostBody
          postId={post?.id ?? cachedPost.id}
          authorName={"example"}
          title={post?.title ?? cachedPost?.title}
          content={post?.content ?? cachedPost.content}
          createdAt={
            post?.createdAt?.toUTCString() ??
            (cachedPost?.createdAt || undefined)
          }
          images={post?.images}
          subName={subName}
        />
      </div>
    </Container>
  );
}

function PostVoteShell() {
  return (
    <div className="flex flex-col items-center text-secondary-foreground basis-[5%]">
      <span>
        <ArrowBigUp />
      </span>
      <span className="text-sm text-primary">
        <Loader2 className="w-6 h-6 animate-spin" />
      </span>
      <span>
        <ArrowBigDown />
      </span>
    </div>
  );
}
