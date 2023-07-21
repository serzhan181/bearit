import { Post } from "@/components/post";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/db";

export default async function Home() {
  const posts = await db.query.post.findMany({
    with: {
      sub: true,
      votes: true,
    },
    orderBy: (fields, { asc, desc }) => [desc(fields.createdAt)],
  });
  return (
    <main className="container flex flex-col gap-4 mt-10">
      <Tabs defaultValue="feed">
        <TabsList>
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="my_subscriptions">My subscriptions</TabsTrigger>
        </TabsList>
        <Separator className="my-4" />
        <TabsContent value="feed" className="space-y-4">
          {posts.map((p) => (
            <Post
              key={p.id}
              authorName={p.authorName}
              content={p.content || ""}
              subName={p.sub?.name || "ERROR"}
              title={p.title}
              votes={p.votes.length}
              id={p.id}
              createdAt={p.createdAt}
              authorId={p.authorId}
              images={p.images}
              subCoverImage={
                p.sub.coverImages ? p.sub.coverImages[0] : undefined
              }
            />
          ))}
        </TabsContent>
        <TabsContent value="my_subscriptions">
          ONLY SUBS THAT USER SUBSCRIBED TO.
        </TabsContent>
      </Tabs>
    </main>
  );
}
