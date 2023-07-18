"use client";

import { updateSub } from "@/app/_actions/sub";
import { uploadFiles } from "@/lib/uploadthing";
import { StoredFile } from "@/types";
import { Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import { toast } from "sonner";

interface SubCoverImgProps {
  image: StoredFile | null;
  subId: number;
  name: string;
}
export const SubCoverImg = ({ image, subId, name }: SubCoverImgProps) => {
  const coverImgRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleUpload = (
    endpoint: "subCoverImage" | "subBackgroundImage",
    file: File
  ) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("coverImage", file);
        const [res] = await uploadFiles({
          endpoint,
          files: [file],
        });

        await updateSub({
          coverImage: {
            id: subId.toString(),
            name,
            url: res.fileUrl,
          },
          name,
        });

        toast.success("Updated!");

        router.push(`/r/${name}`);
        router.refresh();
      } catch (err) {
        console.log("Something went wrong", err);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        className="relative overflow-hidden border border-dashed rounded-full w-28 h-28 border-border"
        onClick={() => coverImgRef.current?.click()}
        disabled={isPending}
      >
        {image ? (
          <Image
            src={image.url}
            alt="cover image"
            fill
            className="object-contain"
          />
        ) : (
          "Nothing here lol!"
        )}
        {isPending ? (
          <Loader2 className="w-6 h-6 mx-auto" />
        ) : (
          <Plus className="w-6 h-6 mx-auto" />
        )}
        <span className="mx-auto text-xs text-muted-foreground">
          cover image (yet to be supported)
        </span>
      </button>
      <input
        ref={coverImgRef}
        multiple={false}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) =>
          handleUpload("subCoverImage", e.target.files![0] as unknown as File)
        }
      />
    </>
  );
};
