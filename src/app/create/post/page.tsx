import { allSubs } from "@/app/_actions/sub";
import { CreatePostForm } from "@/components/forms/create-post-form";

export default async function CreatePost() {
  const subs = await allSubs();
  return (
    <main className="container flex flex-col gap-4 mt-10">
      <CreatePostForm
        subsOptions={subs.map((s) => ({
          label: s.name,
          value: s.id.toString(),
          imageUrl: "/images/bear.png",
        }))}
      />
    </main>
  );
}
