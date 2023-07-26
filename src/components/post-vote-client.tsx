"use client";

import { cn } from "@/lib/utils";
import { PostVoteRequest } from "@/lib/validators/vote";
import { usePrevious } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// postId={post.id}
// initialVotesAmt={_votesAmt}
// initialVote={_currentVote?.type}

type VoteType = "UP" | "DOWN";

interface PostVoteClientProps {
  postId: number;
  initialVotesAmt: number;
  initialVote?: VoteType | null;
}

export const PostVoteClient = ({
  initialVotesAmt,
  postId,
  initialVote,
}: PostVoteClientProps) => {
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);

  // ensure sync with server
  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  const { mutate: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: PostVoteRequest = {
        voteType: type,
        postId: postId.toString(),
      };

      await axios.patch("/api/subearit/post/vote", payload);
    },
    onError: (err, voteType) => {
      if (voteType === "UP") setVotesAmt((prev) => prev - 1);
      else setVotesAmt((prev) => prev + 1);

      // reset current vote
      setCurrentVote(prevVote);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast.error("You have to sign in first!");
        }
      }

      return toast.error("Someting went wrong!");
    },
    onMutate: (type: VoteType) => {
      if (currentVote === type) {
        // User is voting the same way again, so remove their vote
        setCurrentVote(undefined);
        if (type === "UP") setVotesAmt((prev) => prev - 1);
        else if (type === "DOWN") setVotesAmt((prev) => prev + 1);
      } else {
        // User is voting in the opposite direction, so subtract 2
        setCurrentVote(type);
        if (type === "UP") setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
        else if (type === "DOWN")
          setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
      }
    },
  });

  return (
    <div className="flex flex-col items-center text-secondary-foreground basis-[5%]">
      <button
        onClick={() => vote("UP")}
        className={cn({
          "text-red-500": currentVote === "UP",
        })}
      >
        <ArrowBigUp
          className={cn("h-5 w-5 text-zinc-700", {
            "text-emerald-500 fill-emerald-500": currentVote === "UP",
          })}
        />
      </button>
      <span className="text-sm text-primary">{votesAmt}</span>
      <button
        onClick={() => vote("DOWN")}
        className={cn({
          "text-emerald-500": currentVote === "DOWN",
        })}
      >
        <ArrowBigDown
          className={cn("h-5 w-5 text-zinc-700", {
            "text-red-500 fill-red-500": currentVote === "DOWN",
          })}
        />
      </button>
    </div>
  );
};
