import { updateDonation } from "@/lib/actions/donation.actions";
import { fetchDonation } from "@/lib/actions/donation.actions";
import UpdateDonation from "@/components/forms/UpdateDonation";

interface DonationPageParams {
    params: {
      id: string;
    };
  }
  
  const DonationPage = async ({ params }: DonationPageParams) => {
    const { id } = params;
    const donation = await fetchDonation(id);

  if (!donation) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 className="head-text">Update Donation</h1>
      <UpdateDonation donationId={donation._id} initialData={donation} />
    </>
  );
};

export default DonationPage;
