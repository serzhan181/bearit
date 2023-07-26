// https://github.com/joschan21/breadit/blob/master/src/app/api/subreddit/post/vote/route.ts

import { db } from "@/db";
import { post, vote } from "@/db/schema";
import { redis } from "@/lib/redis";
import { PostVoteValidator } from "@/lib/validators/vote";
import { CachedPost } from "@/types/redis";
import { currentUser } from "@clerk/nextjs/app-beta";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const CACH_AFTER_UPVOTES = parseInt(process.env.CACH_AFTER_UPVOTES || "1");

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { postId, voteType } = PostVoteValidator.parse(body);

    const session = await currentUser();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // check if user already voted;
    const existingVote = await db.query.vote.findFirst({
      where: (fields, { and, eq }) =>
        and(eq(fields.postId, postId), eq(fields.userId, session.id)),
    });

    const postToVote = await db.query.post.findFirst({
      where: eq(post.id, parseInt(postId)),
      with: {
        votes: true,
      },
    });

    if (!postToVote) {
      return new Response("Post not found", { status: 404 });
    }

    if (existingVote) {
      // if vote type is the same as existing vote, delete the vote
      if (existingVote.type === voteType) {
        await db
          .delete(vote)
          .where(and(eq(vote.postId, postId), eq(vote.userId, session.id)));
      }

      //   Recount the votes
      const votesAmt = postToVote.votes.reduce((acc, vote) => {
        if (vote.type === "UP") return acc + 1;
        if (vote.type === "DOWN") return acc - 1;
        return acc;
      }, 0);

      //   Cache high voted posts so it's quicker to access to
      if (votesAmt >= CACH_AFTER_UPVOTES) {
        const cachePaylaod: CachedPost = {
          authorUsername: postToVote.authorName,
          content: postToVote.content || "",
          id: postToVote.id,
          title: postToVote.title,
          currentVote: null,
          createdAt: postToVote.createdAt?.toUTCString() || null,
        };

        await redis.hset(`post:${postToVote.id}`, cachePaylaod);
      }

      return new Response("OK");
    }

    // If no existing vote, create
    await db
      .insert(vote)
      .values({ type: voteType, userId: session.id, postId });

    //   Recount the votes
    const votesAmt = postToVote.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;
      return acc;
    }, 0);

    //   Cache high voted posts so it's quicker to access to
    if (votesAmt >= CACH_AFTER_UPVOTES) {
      const cachePaylaod: CachedPost = {
        authorUsername: postToVote.authorName,
        content: postToVote.content || "",
        id: postToVote.id,
        title: postToVote.title,
        currentVote: null,
        createdAt: postToVote.createdAt?.toUTCString() || null,
      };

      await redis.hset(`post:${post.id}`, cachePaylaod);
    }

    return new Response("OK");
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(err.message, { status: 400 });
    }

    return new Response(
      "Could not post to subearit at this time. Please try later",
      { status: 500 }
    );
  }
}
