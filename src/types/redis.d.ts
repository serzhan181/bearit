import { Vote } from "@prisma/client";

export type CachedPost = {
  id: number;
  title: string;
  authorUsername: string;
  content: string;
  currentVote: Vote["type"] | null;
  createdAt: Date | null;
};
