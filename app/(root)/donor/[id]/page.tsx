import { updateDonor } from "@/lib/actions/donor.actions";
import { fetchDonor } from "@/lib/actions/donor.actions";
import UpdateDonor from "@/components/forms/UpdateDonor";

interface DonorPageParams {
    params: {
      id: string;
    };
  }
  
  const DonorPage = async ({ params }: DonorPageParams) => {
    const { id } = params;
    const donor = await fetchDonor(id);

  if (!donor) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 className="head-text">Update Donor</h1>
      <UpdateDonor donorId={donor._id} initialData={donor} />
    </>
  );
};

export default DonorPage;
