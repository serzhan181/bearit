import { Button } from "@/components/ui/button";

interface SubscribeLeaveToggleProps {
  isOwner: boolean;
  isSubscribed: boolean;
  subId: number;
}

export const SubscribeLeaveToggle = ({
  isOwner,
  isSubscribed,
}: SubscribeLeaveToggleProps) => {
  return (
    <div>
      {isOwner ? (
        <Button disabled variant="outline">
          You are the owner
        </Button>
      ) : (
        <>
          {isSubscribed ? (
            <Button variant="outline">Leave</Button>
          ) : (
            <Button variant="secondary">Join</Button>
          )}
        </>
      )}
    </div>
  );
};
