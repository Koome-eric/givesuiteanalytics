import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";

import Pagination from "@/components/shared/Pagination";
import Search from "@/components/shared/Searchbar";

import { fetchUser } from "@/lib/actions/user.actions";
import { deleteDonor } from "@/lib/actions/donor.actions";
import { fetchDonors } from "@/lib/actions/donor.actions"; // Assuming you have a similar action for fetching donors

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

  const result = await fetchDonors(user.id, searchParams?.page ? +searchParams.page : 1); 
  
  console.log(result.donors);

  return (
    <>
      <div className="flex justify-between items-center">
        
        <Search placeholder="Search for a donor..." />
        <Link href="/donor/add">
          <button className="add-button">Add New</button>
        </Link>
      </div>

      <Table>
        <TableCaption>List of Donors</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Primary Email</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Street</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.donors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className='text-center'>No Donors Found</TableCell>
            </TableRow>
          ) : (
            result.donors.map((donor) => (
              <TableRow key={donor._id}>
                <TableCell>{donor.name}</TableCell>
                <TableCell>{donor.primaryemailaddress}</TableCell>
                <TableCell>{donor.primarycity}</TableCell>
                <TableCell>{donor.primarystreet}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link href={`/donor/${donor._id}`}>
                      <button className="button-edit">
                        <img src='/assets/edit.svg' alt='Edit' className="w-5 h-5" />
                      </button>
                    </Link>
                    <form action={deleteDonor}>
                      <input type="hidden" name="id" value={donor._id} />
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
        path='donors'
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  );
}

export default Page;
