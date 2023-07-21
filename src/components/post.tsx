import { ArrowBigDown, ArrowBigUp, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Post as IPost, Sub as ISub } from "@/db/schema";
import { fromNow } from "@/lib/utils";
import { Carousel } from "./ui/carousel";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";
import Link from "next/link";
import { StoredFile } from "@/types";

interface PostProps extends Omit<IPost, "updatedAt" | "subId"> {
  votes: number;
  subName: string;
  subCoverImage?: StoredFile;
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
}: // authorId,
// id
PostProps) => {
  return (
    <div className="flex gap-4 min-h-[128px] p-4 border rounded-sm shadow border-border">
      <div className="flex flex-col items-center text-secondary-foreground basis-[5%]">
        <button>
          <ArrowBigUp className="w-8 h-8" />
        </button>
        <span className="text-sm">{votes}</span>
        <button>
          <ArrowBigDown className="w-8 h-8" />
        </button>
      </div>

      <div className="flex flex-col grow">
        <Link href={`/r/${subName}`} className="flex gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={subCoverImage?.url} alt={subName} />
            <AvatarFallback>{subName[0]}</AvatarFallback>
          </Avatar>

          <div className="flex items-center gap-2 text-sm">
            <p>r/{subName}</p>
            <span className="text-muted-foreground">&#8226;</span>
            <p className="text-muted-foreground">u/{authorName}</p>
            <span className="text-muted-foreground">&#8226;</span>
            <p className="text-muted-foreground">
              {fromNow(createdAt?.toUTCString() || "")}
            </p>
          </div>
        </Link>
        <div className="mt-2">
          <Link
            href={`/r/${subName}/${"SLUG_LINK_HERE"}`}
            target="_blank"
            className="font-semibold"
          >
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
            <p className="text-sm text-muted-foreground">{content}</p>
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
    </div>
  );
};
