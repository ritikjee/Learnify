import { GlassModal } from "@/components/global/glass-modal";
import { JoinGroupPaymentForm } from "@/components/global/join-group";
import { StripeElements } from "@/components/global/stripe/element";
import { Button } from "@/components/ui/button";
import {
  useActiveGroupSubscription,
  useJoinFree,
  useVisitGroup,
} from "@/hooks/payment";
import { useRouter } from "next/navigation";

type JoinButtonProps = {
  owner: boolean;
  groupid: string;
  isSubscribed: boolean;
  user: boolean;
};

export const JoinButton = ({
  owner,
  groupid,
  isSubscribed,
  user,
}: JoinButtonProps) => {
  const { data } = useActiveGroupSubscription(groupid);
  const { onJoinFreeGroup } = useJoinFree(groupid);
  const { onVisitGroup } = useVisitGroup(groupid);

  const router = useRouter();
  if (!user)
    return (
      <Button
        onClick={() => router.push("/sign-in")}
        className="w-full p-10"
        variant="ghost"
      >
        Login in to join group
      </Button>
    );

  if (isSubscribed && !owner)
    return (
      <Button onClick={onVisitGroup} className="w-full p-10" variant="ghost">
        Go to Group
      </Button>
    );

  if (!owner) {
    if (data?.data) {
      return (
        <GlassModal
          trigger={
            <Button className="w-full p-10" variant="ghost">
              <p>Join ${data?.data.subscription?.price}/Month</p>
            </Button>
          }
          title="Join this group"
          description="Pay now to join this community"
        >
          <StripeElements>
            <JoinGroupPaymentForm groupid={groupid} />
          </StripeElements>
        </GlassModal>
      );
    }
    return (
      <Button onClick={onJoinFreeGroup} className="w-full p-10" variant="ghost">
        Join now
      </Button>
    );
  }

  return (
    <Button disabled={owner} className="w-full p-10" variant="ghost">
      Owner
    </Button>
  );
};
