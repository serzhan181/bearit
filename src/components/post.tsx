import { ArrowBigDown, ArrowBigUp, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";

interface PostProps {
  subName: string;
  author: string;
  votes: number;
  title: string;
  content: string;
}

export const Post = ({ author, content, subName, title, votes }: PostProps) => {
  return (
    <div className="flex gap-4 min-h-[128px] px-6 py-4 border rounded border-border bg-secondary">
      <div className="flex flex-col items-center text-secondary-foreground">
        <button>
          <ArrowBigUp className="w-8 h-8" />
        </button>
        <span className="text-sm">{votes}</span>
        <button>
          <ArrowBigDown className="w-8 h-8" />
        </button>
      </div>

      <div className="flex flex-col w-full gap-4">
        <div className="flex gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src="/images/bear.png" alt={subName} />
            <AvatarFallback>{subName[0]}</AvatarFallback>
          </Avatar>

          <div className="flex items-center gap-2 text-sm">
            <p>r/{subName}</p>
            <span className="text-muted-foreground">&#8226;</span>
            <p className="text-muted-foreground">u/{author}</p>
            <span className="text-muted-foreground">&#8226;</span>
            <p className="text-muted-foreground">3 hours ago</p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold">{title}</h4>
          <p className="text-sm text-muted-foreground">{content}</p>
        </div>

        <div className="flex flex-col">
          <Separator className="bg-muted-foreground" />
          <div className="flex items-center self-end gap-4 mt-2">
            <button className="flex items-center gap-1 text-sm">
              <span className="tracking-tighter text-muted-foreground">
                share
              </span>
            </button>
            <Separator
              orientation="vertical"
              className="h-5 bg-muted-foreground"
            />
            <button className="flex items-center gap-1 text-sm">
              <span className="tracking-tighter text-muted-foreground">
                1.2k comments
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
