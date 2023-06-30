import { Post } from "@/components/post";
import { db } from "@/db";

export default async function Home() {
  const posts = await db.query.post.findMany({
    with: {
      sub: true,
      votes: true,
    },
  });
  return (
    <main className="container flex flex-col gap-4 mt-10">
      {posts.map((p) => (
        <Post
          key={p.id}
          author={p.authorId}
          content={p.content || ""}
          subName={p.sub?.name || "ERROR"}
          title={p.title}
          votes={p.votes.length}
        />
      ))}
    </main>
  );
}
