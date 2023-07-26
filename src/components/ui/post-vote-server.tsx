import { Post, Vote } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/app-beta";
import { notFound } from "next/navigation";
import { PostVoteClient } from "../post-vote-client";

interface PostVoteServerProps {
  postId: number;
  initialVotesAmt?: number;
  initialVote?: Vote["type"] | null;
  getData?: () => Promise<(Post & { votes: Vote[] }) | null | undefined>;
}

export const PostVoteServer = async ({
  postId,
  initialVotesAmt,
  initialVote,
  getData,
}: PostVoteServerProps) => {
  const user = await currentUser();

  let votesAmt = 0;
  let curVote: Vote["type"] | null | undefined = undefined;

  if (getData) {
    // fetch data in component
    const post = await getData();
    if (!post) return notFound();

    votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;
      return acc;
    }, 0);

    curVote = post.votes.find((vote) => vote.userId === user?.id)?.type;
  } else {
    // passed as props
    votesAmt = initialVotesAmt!;
    curVote = initialVote;
  }

  return (
    <PostVoteClient
      postId={postId}
      initialVotesAmt={votesAmt}
      initialVote={curVote}
    />
  );
};
