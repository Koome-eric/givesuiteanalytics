import { FaUsers, FaHandHoldingHeart, FaDollarSign } from 'react-icons/fa';
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import AnalyticsCard from "@/components/cards/AnalyticsCard";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchTotalMembers } from "@/lib/actions/member.actions";
import { fetchTotalDonors } from "@/lib/actions/donor.actions";
import { fetchTotalDonationsAmount } from "@/lib/actions/donation.actions";
import DonationsChart from '@/components/charts/DonationsChart';
import { fetchLatestDonations } from "@/lib/actions/donation.actions";
import LatestDonations from '@/components/latest/LatestDonations';

async function Home() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const totalMembers = await fetchTotalMembers(user.id);
  const totalDonors = await fetchTotalDonors(user.id);
  const totalAmount = await fetchTotalDonationsAmount(user.id);
  const latestDonations = await fetchLatestDonations(user.id);

  return (
    <>
      <section className='mt-3 grid grid-cols-3 gap-10'>
        <AnalyticsCard title="Total Members" count={totalMembers.toString()} icon={<FaUsers />} />
        <AnalyticsCard title="Total Donors" count={totalDonors.toString()} icon={<FaHandHoldingHeart />} />
        <AnalyticsCard title="Total Donations" count={`$${totalAmount.toFixed(2)}`} icon={<FaDollarSign />} />
      </section>
      <section className='mt-9 grid grid-cols-6 gap-10'>
        <div className="col-span-2">
          <LatestDonations donations={latestDonations} />
        </div>
        <div className="col-span-4">
          <DonationsChart donationData={latestDonations} />
        </div>
      </section>
    </>
  );
}

export default Home;



