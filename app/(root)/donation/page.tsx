import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";

import Pagination from "@/components/shared/Pagination";
import Search from "@/components/shared/Searchbar";

import { fetchUser } from "@/lib/actions/user.actions";
import { deleteDonation } from "@/lib/actions/donation.actions";
import { fetchDonations } from "@/lib/actions/donation.actions";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;

  const result = await fetchDonations({
    userId: user.id,
    searchString: searchParams.q,
    pageNumber: Number(searchParams?.page) || 1,
    limit: 5,
  });

  return (
    <>
    <div className="bg-light-1 rounded-md p-7">
      <div className="flex justify-between items-center">
        
        <Search placeholder="Search for a donation..." />
        <Link href="/donation/add">
          <button className="add-button">Add New</button>
        </Link>
      </div>

      <Table>
        <TableCaption>List of Donations</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Fund</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.donations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className='text-center'>No Donations Found</TableCell>
            </TableRow>
          ) : (
            result.donations.map((donation) => (
              <TableRow key={donation._id}>
                <TableCell className="py-2">{donation.Name}</TableCell>
                <TableCell className="py-2">{donation.Date}</TableCell>
                <TableCell className="py-2">{donation.Amount}</TableCell>
                <TableCell className="py-2">{donation.Type}</TableCell>
                <TableCell className="py-2">{donation.Fund}</TableCell>
                <TableCell className="py-2">
                  <div className="flex gap-2">
                    <Link href={`/donation/${donation._id}`}>
                      <button className="button-edit">
                        <img src='/assets/edit.svg' alt='Edit' className="w-5 h-5" />
                      </button>
                    </Link>
                    <form action={deleteDonation}>
                      <input type="hidden" name="id" value={donation._id} />
                      <button className="button-delete">
                        <img src='/assets/delete.svg' alt='Delete' className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Pagination
        path="donation"
        pageNumber={result.pageNumber}
        isNext={result.isNext}
      />
      </div>
    </>
  );
}

export default Page;
