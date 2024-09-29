import { onVerifyAffilateLink } from "@/actions/groups";
import { redirect } from "next/navigation";

const AffiliatesPage = async ({ params }: { params: { id: string } }) => {
  const { data: status } = await onVerifyAffilateLink(params.id);

  if (status) {
    return redirect(`/group/create?affiliate=${params.id}`);
  }

  if (!status) {
    return redirect("/");
  }
};

export default AffiliatesPage;
