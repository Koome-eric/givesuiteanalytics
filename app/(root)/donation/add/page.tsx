import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser } from "@/lib/actions/user.actions";
import AddDonation from "@/components/forms/AddDonation";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text">Add Donation</h1>
      <AddDonation userId={userInfo._id.toString()} />
    </>
  );
}

export default Page;
