import { Post } from "@/components/post";

export default function Home() {
  return (
    <main className="container flex flex-col gap-4 mt-10">
      <Post
        author="gigachad"
        content="Descriptions should be descriptive"
        subName="makessense"
        title="Titles should be clickbaitive"
        votes={69}
      />
      <Post
        author="gigachad"
        content="Descriptions shouldnt be as descriptive"
        subName="doesntmakessense"
        title="Or should they?"
        votes={69}
      />
    </main>
  );
}
