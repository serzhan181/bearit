import { Button } from "../ui/button";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { UserNav } from "../user-nav";
import { Heart, Plus, Search } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { PropsWithChildren } from "react";

const actions = [
  {
    icon: <Search />,
    title: "Search",
    disabled: true,
  },
  {
    icon: <Plus />,
    title: "Create post",
  },
  {
    icon: <Heart />,
    title: "Upvoted posts",
    disabled: true,
  },
];

export const RSidebar = () => {
  return (
    <nav className="fixed top-0 bottom-0 right-0 z-30 border-l w-sidebar border-border">
      <div className="flex flex-col items-center gap-2 mt-10 text-center">
        <SignedOut>
          <SignUpButton mode="modal">
            <Button className="w-24">Sign up</Button>
          </SignUpButton>
          <SignInButton mode="modal">
            <Button className="w-24" variant="secondary">
              Sign in
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserNav />
          <ul className="flex flex-col gap-4 mt-10">
            {actions.map((a) => (
              <li key={a.title}>
                <TextTooltip text={a.title}>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full"
                    disabled={a.disabled}
                  >
                    {a.icon}
                  </Button>
                </TextTooltip>
              </li>
            ))}
          </ul>
        </SignedIn>
      </div>
    </nav>
  );
};

const TextTooltip = ({
  children,
  text,
}: PropsWithChildren<{ text: string }>) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="left">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
