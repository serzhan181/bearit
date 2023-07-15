"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { addSub } from "@/app/_actions/sub";

const schema = z.object({
  backgroundImage: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false;
      if (val.some((file) => !(file instanceof File))) return false;
      return true;
    }, "Must be an array of File")
    .optional()
    .nullable()
    .default(null),
  coverImage: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false;
      if (val.some((file) => !(file instanceof File))) return false;
      return true;
    }, "Must be an array of File")
    .optional()
    .nullable()
    .default(null),

  name: z
    .string({ required_error: "Name of the sub is required!" })
    .min(2, "At least 2 characters."),
});

export type InputsCreateSub = z.infer<typeof schema>;

export const CreateSubForm = () => {
  const router = useRouter();
  const form = useForm<InputsCreateSub>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const { user } = useUser();

  const onSubmit = (data: InputsCreateSub) => {
    startTransition(async () => {
      try {
        if (!user) throw new Error("Not authorized");

        await addSub({ name: data.name, creatorId: user.id });
        toast.success("Sub created successfully.");

        form.reset();

        router.push("/");
        router.refresh();
      } catch (err) {
        toast.error("Something went wrong!");
      }
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <button className="w-full border border-dashed h-60 border-border">
          <Plus className="w-10 h-10 mx-auto" />
          <span className="mx-auto text-sm text-muted-foreground">
            background image (yet to be supported)
          </span>
        </button>
        <div className="flex items-center gap-4 mt-4">
          <button className="border border-dashed rounded-full w-28 h-28 border-border">
            <Plus className="w-6 h-6 mx-auto" />
            <span className="mx-auto text-xs text-muted-foreground">
              cover image (yet to be supported)
            </span>
          </button>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name of the sub</FormLabel>
                <FormControl>
                  <Input placeholder="Name" className="w-96" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button className="self-end" type="submit" disabled={isPending}>
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isPending ? "Please wait..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
