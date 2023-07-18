import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export const Container = ({
  children,
  className,
}: PropsWithChildren & { className?: string }) => {
  return (
    <main className={cn("container flex flex-col gap-4 mt-10", className)}>
      {children}
    </main>
  );
};
