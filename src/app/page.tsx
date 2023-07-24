import { Post } from "@/components/post";
import { PostFeed } from "@/components/post-feed";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { POSTS_LIMIT_PER_PAGE } from "@/config";
import { db } from "@/db";

export default async function Home() {
  const posts = await db.query.post.findMany({
    with: {
      sub: true,
      votes: true,
    },
    orderBy: (fields, { desc }) => [desc(fields.createdAt)],
    limit: POSTS_LIMIT_PER_PAGE,
  });
  return (
    <main className="container flex flex-col gap-4 mt-10">
      <Tabs defaultValue="feed">
        <TabsList>
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="my_subscriptions">My subscriptions</TabsTrigger>
        </TabsList>
        <Separator className="my-4" />
        <TabsContent value="feed">
          {/* TODO: Change later (createdAt field is complaining) */}
          {/* @ts-ignore */}
          <PostFeed initialPosts={posts} />
        </TabsContent>
        <TabsContent value="my_subscriptions">
          ONLY SUBS THAT USER SUBSCRIBED TO.
        </TabsContent>
      </Tabs>
    </main>
  );
}
