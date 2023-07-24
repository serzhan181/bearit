import { db } from "@/db";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);

  // TODO: Posts from followed communities
  // const auth = auth();

  try {
    const { limit, page, subName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subName: z.string().nullish().optional(),
      })
      .parse({
        subName: url.searchParams.get("subName"),
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
      });

    const posts = await db.query.post.findMany({
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit), // skip should start from 0 for page 1
      orderBy: (fields, { desc }) => [desc(fields.createdAt)],
      with: {
        sub: true,
        votes: true,
        comments: true,
      },
    });

    return new Response(JSON.stringify(posts));
  } catch (err) {
    console.log("Something went wrong:", err);
    return new Response("Could not fetch posts", { status: 500 });
  }
}
