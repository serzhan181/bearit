import { StoredFile } from "@/types";
import { InferModel, relations } from "drizzle-orm";
import {
  index,
  json,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

// Sub
export const sub = mysqlTable(
  "sub",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 16 }).notNull(),
    creatorId: varchar("creatorId", { length: 255 }).notNull(),
    images: json("images").$type<StoredFile[] | null>().default(null),

    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (table) => ({
    nameIdx: index("name_idx").on(table.name),
  })
);
export const subRelations = relations(sub, ({ many }) => ({
  posts: many(post),
  subscribers: many(subscription),
}));

export type Sub = InferModel<typeof sub>;

// Post
export const post = mysqlTable("post", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  authorId: varchar("authorId", { length: 255 }).notNull(),
  authorName: varchar("authorName", { length: 255 }).notNull(),
  subId: varchar("subId", { length: 255 }).notNull(),
  images: json("images").$type<StoredFile[] | null>().default(null),

  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});
export const postRelations = relations(post, ({ one, many }) => ({
  sub: one(sub, { fields: [post.subId], references: [sub.id] }),
  comments: many(comment),
  votes: many(vote),
}));

export type Post = InferModel<typeof post>;

// Subscription
export const subscription = mysqlTable(
  "subscription",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    subId: varchar("subId", { length: 255 }).notNull(),
  },
  (table) => ({
    pk: primaryKey(table.subId, table.userId),
  })
);
export const subscriptionRelations = relations(subscription, ({ one }) => ({
  sub: one(sub, { fields: [subscription.subId], references: [sub.id] }),
}));

export type Subscription = InferModel<typeof subscription>;

// Comment
export const comment = mysqlTable("comment", {
  id: serial("id").primaryKey(),
  text: text("text"),
  authorId: varchar("authorId", { length: 255 }).notNull(),
  postId: varchar("postId", { length: 255 }).notNull(),

  replyToId: varchar("replyToId", { length: 255 }),

  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});
export const commentRelations = relations(comment, ({ one, many }) => ({
  post: one(post, { fields: [comment.postId], references: [post.id] }),
  votes: many(commentVote),

  replyTo: one(comment, {
    fields: [comment.replyToId],
    references: [comment.id],
  }),
  replies: many(comment),
}));

export type Comment = InferModel<typeof comment>;

// Vote
export const vote = mysqlTable(
  "vote",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    postId: varchar("postId", { length: 255 }).notNull(),
    type: mysqlEnum("vote_type", ["UP", "DOWN"]),
  },
  (table) => ({
    pk: primaryKey(table.userId, table.postId),
  })
);
export const voteRealtions = relations(vote, ({ one }) => ({
  post: one(post, { fields: [vote.postId], references: [post.id] }),
}));

export type Vote = InferModel<typeof vote>;

// CommentVote
export const commentVote = mysqlTable(
  "commentVote",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    commentId: varchar("commentId", { length: 255 }).notNull(),
    type: mysqlEnum("vote_type", ["UP", "DOWN"]),
  },
  (table) => ({
    pk: primaryKey(table.userId, table.commentId),
  })
);
export const commentVoteRelations = relations(commentVote, ({ one }) => ({
  comment: one(comment, {
    fields: [commentVote.commentId],
    references: [comment.id],
  }),
}));

export type CommentVote = InferModel<typeof commentVote>;
