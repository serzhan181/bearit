import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Post as IPost, Sub as ISub, Vote } from "@/db/schema";
import { fromNow } from "@/lib/utils";
import { Carousel } from "./ui/carousel";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";
import Link from "next/link";
import { StoredFile } from "@/types";
import { PostVoteClient } from "./post-vote-client";
import { markdownToHtml } from "@/lib/editor";

type PartialVote = Pick<Vote, "type">;

export interface PostProps
  extends Omit<IPost, "updatedAt" | "subId" | "createdAt"> {
  votes: number;
  subName?: string;
  subCoverImage?: StoredFile;
  createdAt?: string;
  currentVote?: PartialVote;
}

export const Post = ({
  authorName,
  content,
  subName,
  title,
  votes,
  createdAt,
  images,
  subCoverImage,
  currentVote,
  id,
}: // authorId,
// id
PostProps) => {
  return (
    <div className="flex gap-4 min-h-[128px] p-4 border rounded-sm shadow border-border">
      <PostVoteClient
        postId={id}
        initialVote={currentVote?.type}
        initialVotesAmt={votes}
      />

      <PostBody
        authorName={authorName}
        title={title}
        content={content}
        createdAt={createdAt}
        images={images}
        subCoverImage={subCoverImage}
        subName={subName}
        postId={id}
      />
    </div>
  );
};

interface PostBodyProps {
  subName?: string;
  subCoverImage?: StoredFile;
  createdAt?: string;
  authorName: string;
  title: string;
  images?: StoredFile[] | null;
  content: string | null;
  postId: number;
}

export const PostBody = ({
  createdAt,
  subCoverImage,
  subName,
  authorName,
  title,
  images,
  content,
  postId,
}: PostBodyProps) => {
  return (
    <div className="flex flex-col grow">
      <Link href={`/r/${subName}`} className="flex gap-2">
        <Avatar className="w-6 h-6">
          <AvatarImage src={subCoverImage?.url} alt={subName} />
          <AvatarFallback>{subName ? subName[0] : "U"}</AvatarFallback>
        </Avatar>

        <div className="flex items-center gap-2 text-sm">
          <p>r/{subName}</p>
          <span className="text-muted-foreground">&#8226;</span>
          <p className="text-muted-foreground">u/{authorName}</p>
          <span className="text-muted-foreground">&#8226;</span>
          <p className="text-muted-foreground">{fromNow(createdAt || "")}</p>
        </div>
      </Link>
      <div className="mt-2">
        <Link href={`/r/${subName}/${postId}`} className="font-semibold">
          {title}
        </Link>
        {/* Hide text content if images are present. */}
        {images ? (
          <div className="mt-2 ">
            {images.length > 1 ? (
              <Carousel>
                {images.map((img) => (
                  <AspectRatio key={img.id} ratio={16 / 9}>
                    <Image
                      fill
                      className="object-contain"
                      src={img.url}
                      alt={img.name}
                    />
                  </AspectRatio>
                ))}
              </Carousel>
            ) : (
              <AspectRatio ratio={16 / 9}>
                <Image
                  fill
                  className="object-contain"
                  src={images[0].url}
                  alt={images[0].name}
                />
              </AspectRatio>
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            <span
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: markdownToHtml(content || ""),
              }}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col mt-2">
        <div className="flex items-center self-end gap-4 mt-2">
          <button className="flex items-center gap-1 text-sm">
            <span className="tracking-tighter text-muted-foreground">
              share
            </span>
          </button>
          <Separator orientation="vertical" className="h-5 bg-muted" />
          <button className="flex items-center gap-1 text-sm">
            <Link
              href={`/r/${subName}/${"SLUG_LINK_HERE"}`}
              target="_blank"
              className="tracking-tighter text-muted-foreground"
            >
              1.2k comments
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};
