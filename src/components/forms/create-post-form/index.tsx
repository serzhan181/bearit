"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MarkdownEditor } from "@/components/md-editor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { addPostToSub } from "@/app/_actions/post";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import {
  ComboboxWithImage,
  ComboboxWithImageOption,
} from "./combobox-with-image";
import { FileWithPreview } from "@/types";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { FileDialog } from "@/components/file-dialog";
import { isArrayOfFile } from "@/lib/utils";
import { toast } from "sonner";

const schema = z.object({
  subId: z
    .string()
    .min(1, { message: "You have to select a community to post to." }),
  content: z.string().min(5),
  title: z.string().min(3),
  images: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false;
      if (val.some((file) => !(file instanceof File))) return false;
      return true;
    }, "Must be an array of File")
    .optional()
    .nullable()
    .default(null),
});

export type InputsCreatePost = z.infer<typeof schema>;

interface CreatePostFormProps {
  subsOptions?: ComboboxWithImageOption[];
}

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

export const CreatePostForm = ({ subsOptions = [] }: CreatePostFormProps) => {
  const router = useRouter();
  const form = useForm<InputsCreatePost>({
    resolver: zodResolver(schema),
    defaultValues: {
      content: "",
      subId: "",
      title: "",
    },
  });
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();

  // uploadthing
  const [files, setFiles] = useState<FileWithPreview[] | null>(null);
  const { isUploading, startUpload } = useUploadThing("postImage");

  const onSubmit = (data: InputsCreatePost) => {
    startTransition(async () => {
      try {
        if (!user) throw new Error("Not authorized");

        const images = isArrayOfFile(data.images)
          ? await startUpload(data.images).then((res) => {
              const formattedImages = res?.map((image) => ({
                id: image.fileKey,
                name: image.fileKey.split("_")[1] ?? image.fileKey,
                url: image.fileUrl,
              }));
              return formattedImages ?? null;
            })
          : null;

        await addPostToSub({
          content: data.content,
          subId: data.subId,
          userId: user.id,
          title: data.title,
          authorName: user.username || "unknown",
          images,
        });

        toast.success("Post added successfully.");

        form.reset();
        setFiles(null);

        router.push("/");
        router.refresh();
      } catch (err) {}
    });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="subId"
          render={({ field }) => (
            <FormItem>
              <ComboboxWithImage
                options={subsOptions}
                placeholder="Select community..."
                value={field.value}
                onChange={(val) => {
                  console.log(val);
                  field.onChange(val);
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <MarkdownEditor placeholder="Incredible" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image */}
        <FormItem className="flex w-full flex-col gap-1.5">
          <FormLabel>Add Images (optional)</FormLabel>
          <FormControl>
            <FileDialog
              setValue={form.setValue}
              name="images"
              maxFiles={3}
              maxSize={1024 * 1024 * 4}
              files={files}
              setFiles={setFiles}
              isUploading={isUploading}
              disabled={isPending}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <Button className="self-end" type="submit" disabled={isPending}>
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isPending ? "Please wait..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
