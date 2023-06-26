import { Button } from "../ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export const RSidebar = () => {
  return (
    <nav className="fixed top-0 bottom-0 right-0 z-30 border-l w-sidebar border-border">
      <div className="flex flex-col items-center gap-2 mt-10">
        <SignUpButton mode="modal">
          <Button className="w-24">Sign up</Button>
        </SignUpButton>
        <SignInButton mode="modal">
          <Button className="w-24" variant="secondary">
            Sign in
          </Button>
        </SignInButton>
      </div>
    </nav>
  );
};
