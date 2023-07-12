"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { MarkdownEditor } from "@/components/md-editor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { addPostToSub } from "@/app/_actions/post";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  ComboboxWithImage,
  ComboboxWithImageOption,
} from "./combobox-with-image";

const schema = z.object({
  subId: z
    .string()
    .min(1, { message: "You have to select a community to post to." }),
  content: z.string().min(5),
  title: z.string().min(3),
});

type Inputs = z.infer<typeof schema>;

interface CreatePostFormProps {
  subsOptions?: ComboboxWithImageOption[];
}

export const CreatePostForm = ({ subsOptions = [] }: CreatePostFormProps) => {
  const router = useRouter();
  const form = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      content: "",
      subId: "",
      title: "",
    },
  });
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: Inputs) => {
    startTransition(async () => {
      try {
        if (!user) throw new Error("Not authorized");
        console.log(data);
        await addPostToSub({
          content: data.content,
          subId: data.subId,
          userId: user.id,
          title: data.title,
          authorName: user.username || "unknown",
        });

        form.reset();
        router.push("/");
        router.refresh(); // Workaround for the inconsistency of cache revalidation
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

        <Button className="self-end" type="submit" disabled={isPending}>
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isPending ? "Please wait..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
