"use client";

import { updateSub } from "@/app/_actions/sub";
import { uploadFiles } from "@/lib/uploadthing";
import { StoredFile } from "@/types";
import { Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import { toast } from "sonner";

interface SubBannerImgProps {
  image: StoredFile | null;
  subId: number;
  name: string;
  isOwner: boolean;
}
export const SubBannerImg = ({
  image,
  subId,
  name,
  isOwner,
}: SubBannerImgProps) => {
  const backgroundImgRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleUpload = (
    endpoint: "subCoverImage" | "subBackgroundImage",
    file: File
  ) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("backgroundImage", file);
        const [res] = await uploadFiles({
          endpoint,
          files: [file],
        });
        await updateSub({
          backgroundImage: {
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

  return isOwner ? (
    <>
      <input
        ref={backgroundImgRef}
        multiple={false}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) =>
          handleUpload(
            "subBackgroundImage",
            e.target.files![0] as unknown as File
          )
        }
      />
      <button
        type="button"
        className="relative w-full border border-dashed h-60 border-border"
        onClick={() => {
          backgroundImgRef.current?.click();
        }}
        disabled={isPending}
      >
        {image ? (
          <Image
            src={image.url}
            alt="background image"
            fill
            className="object-contain"
          />
        ) : (
          "Nothing here lol!"
        )}
        {isPending ? (
          <Loader2 className="w-10 h-10 mx-auto" />
        ) : (
          <Plus className="w-10 h-10 mx-auto" />
        )}
        <span className="mx-auto text-sm text-muted-foreground">
          background image (yet to be supported)
        </span>
      </button>
    </>
  ) : (
    <PlainSubBannerImg image={image} name={name} />
  );
};

const PlainSubBannerImg = ({
  image,
  name,
}: Pick<SubBannerImgProps, "image" | "name">) => {
  return (
    <div className="relative w-full border border-dashed h-60 border-border">
      {image && (
        <Image
          src={image.url}
          alt={`background image of ${name}`}
          fill
          className="object-contain"
        />
      )}
    </div>
  );
};
