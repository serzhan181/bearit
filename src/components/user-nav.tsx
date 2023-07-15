"use client";

import { Loader, LogOut, PlusCircle, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export function UserNav() {
  const { user, isLoaded, isSignedIn } = useUser();
  if (!isLoaded && !isSignedIn) {
    return null;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative w-8 h-8 rounded-full">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={user?.profileImageUrl}
              alt={user?.username || ""}
            />
            <AvatarFallback>{user?.username![0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.emailAddresses[0].emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="w-4 h-4 mr-2" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/create/sub">
              <PlusCircle className="w-4 h-4 mr-2" />
              <span>Create sub</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SignOutButton>
            <div>
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </div>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
