import { PropsWithChildren } from "react";

export const Container = ({ children }: PropsWithChildren) => {
  return (
    <main className="container flex flex-col gap-4 mt-10">{children}</main>
  );
};
