"use client";

import axios from "axios";
import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useSession } from "@clerk/nextjs";
import { useInfiniteQuery } from "@tanstack/react-query";
import { POSTS_LIMIT_PER_PAGE } from "@/config";
import { Post, PostProps } from "./post";
import { Sub, Vote } from "@/db/schema";
import { Loader2 } from "lucide-react";

interface ExtendedPost extends Omit<PostProps, "votes" | "createdAt"> {
  votes: Vote[];
  sub: Sub;
  createdAt?: Date | null | string;
}

interface PostFeedProps {
  subName?: string;
  initialPosts: ExtendedPost[];
}

export const PostFeed = ({ subName, initialPosts }: PostFeedProps) => {
  const lastPostRef = useRef<HTMLElement>();
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { session } = useSession();

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-query"],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${POSTS_LIMIT_PER_PAGE}&page=${pageParam}` +
        (!!subName ? `&subName=${subName}` : "");

      const { data } = await axios.get(query);
      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: { pages: [initialPosts], pageParams: [1] },
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className="space-y-4">
      {posts.map((p, idx) => {
        const votesAmt = p.votes.reduce((acc, v) => {
          if (v.type === "UP") return acc + 1;
          if (v.type === "DOWN") return acc - 1;
          return acc;
        }, 0);

        const curVote = p.votes.find((v) => v.userId === session?.user.id);
        p.id;

        if (idx === posts.length - 1) {
          return (
            <li key={p.id} ref={ref}>
              <Post
                currentVote={curVote}
                key={p.id}
                authorName={p.authorName}
                content={p.content || ""}
                subName={p.sub?.name || "ERROR"}
                title={p.title}
                votes={p.votes.length}
                id={p.id}
                createdAt={p.createdAt?.toString()}
                authorId={p.authorId}
                images={p.images}
                subCoverImage={
                  p.sub.coverImages ? p.sub.coverImages[0] : undefined
                }
              />
            </li>
          );
        } else {
          return (
            <li key={p.id}>
              <Post
                key={p.id}
                authorName={p.authorName}
                content={p.content || ""}
                subName={p.sub?.name || "ERROR"}
                title={p.title}
                votes={p.votes.length}
                id={p.id}
                createdAt={p.createdAt?.toString()}
                authorId={p.authorId}
                images={p.images}
                subCoverImage={
                  p.sub.coverImages ? p.sub.coverImages[0] : undefined
                }
              />
            </li>
          );
        }
      })}

      {isFetchingNextPage && (
        <li className="flex justify-center my-4">
          <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
        </li>
      )}
    </ul>
  );
};
