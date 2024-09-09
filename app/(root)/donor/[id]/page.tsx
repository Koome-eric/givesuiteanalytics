import { fetchDonor } from "@/lib/actions/donor.actions";
import { fetchDonationsByDonorName, getTotalDonationsAmountByDonorName } from "@/lib/actions/donor.actions";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  // Fetch donations and total donated amount for this donor
  const donations = await fetchDonationsByDonorName(donor.name);
  const totalDonatedAmount = await getTotalDonationsAmountByDonorName(donor.name);

  return (
    <div className="bg-light-1 rounded-md p-7">
      <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#000' }}>{donor.name}</h1>
      <h2 style={{ fontSize: '16px', color: '#666' }}>Total  Amount Donated: ${totalDonatedAmount.toFixed(2)}</h2>
      <Table>
        <TableCaption>Donations</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Fund</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Campaign</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donations.map((donation) => (
            <TableRow key={donation._id}>
              <TableCell>{donation.Fund}</TableCell>
              <TableCell>${donation.Amount}</TableCell>
              <TableCell>{donation.Campaign}</TableCell>
              <TableCell>{donation.Date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DonorPage;
