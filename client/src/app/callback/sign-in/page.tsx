import { onAuthenticatedUser, onSignInUser } from "@/actions/auth";
import { redirect } from "next/navigation";

const CompleteSigIn = async () => {
  const { data: user } = await onAuthenticatedUser();

  if (!user) return redirect("/sign-in");

  const { data: authenticated, error } = await onSignInUser();

  if (error) {
    redirect("/sign-in");
  }

  if (!authenticated?.groupId) return redirect(`/group/create`);
  else if (authenticated?.groupId)
    return redirect(
      `/group/${authenticated.groupId}/channel/${authenticated.channelId}`
    );
};

export default CompleteSigIn;
