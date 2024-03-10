import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser } from "@/lib/actions/user.actions";
import AddDonor from "@/components/forms/AddDonor";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text">Add Donor</h1>
      <AddDonor userId={userInfo._id.toString()} />
    </>
  );
}

export default Page;
