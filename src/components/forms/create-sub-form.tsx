"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Label } from "../ui/label";

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
        // Has whitespace
        if (/\s/g.test(data.name)) {
          form.setError("name", { message: "No whitespaces!" });
          return;
        }

        await addSub({ name: data.name, creatorId: user.id });
        toast.success("Sub created successfully.");

        form.reset();

        router.push(`/r/${data.name}`);
        router.refresh();
      } catch (err) {
        toast.error("Something went wrong!");
      }
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* <button
          type="button"
          className="w-full border border-dashed h-60 border-border"
        >
          <Plus className="w-10 h-10 mx-auto" />
          <span className="mx-auto text-sm text-muted-foreground">
            background image (yet to be supported)
          </span>
        </button> */}
        {/* <button
            type="button"
            className="border border-dashed rounded-full w-28 h-28 border-border"
          >
            <Plus className="w-6 h-6 mx-auto" />
            <span className="mx-auto text-xs text-muted-foreground">
              cover image (yet to be supported)
            </span>
          </button> */}

        <Card className="mx-auto w-fit">
          <CardHeader>Create a community! 🎉</CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of the sub</FormLabel>
                  <FormDescription>
                    At least 2 characters and no whitespaces.
                  </FormDescription>
                  <FormControl>
                    <div className="flex items-center w-full max-w-sm">
                      <Label
                        htmlFor="name"
                        className="flex items-center justify-center w-10 h-10 rounded-l-md text-primary-foreground bg-primary"
                      >
                        r/
                      </Label>
                      <Input
                        id="name"
                        placeholder="Name"
                        className="rounded-l-none w-96"
                        autoComplete="off"
                        disabled={isPending}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isPending ? "Please wait..." : "Create"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
