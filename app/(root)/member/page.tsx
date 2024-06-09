import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";

import Pagination from "@/components/shared/Pagination";
import Search from "@/components/shared/Searchbar";

import { fetchUser } from "@/lib/actions/user.actions";
import { deleteMember } from "@/lib/actions/member.actions";
import { fetchMembers } from "@/lib/actions/member.actions";

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

  const result = await fetchMembers({
    userId: user.id,
    searchString: searchParams.q,
    pageNumber: Number(searchParams?.page) || 1,
    limit: 5,
  });

  return (
    <>
    <div className="bg-light-1 rounded-md p-7">
      <div className="flex justify-between items-center">
        
        <Search placeholder="Search for a member..." />
        <Link href="/member/add">
          <button className="add-button">Add New</button>
        </Link>
      </div>

      <Table>
        <TableCaption>List of Members</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Phone</TableHead>
            
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className='text-center'>No Members Found</TableCell>
            </TableRow>
          ) : (
            result.members.map((member) => (
              <TableRow key={member._id}>
                <TableCell className="py-2">{member.username}</TableCell>
                <TableCell className="py-2">{member.email}</TableCell>
                <TableCell className="py-2">{member.role}</TableCell>
                <TableCell className="py-2">{member.phone}</TableCell>
                
                <TableCell className="py-2">
                  <div className="flex gap-2">
                    <Link href={`/member/${member._id}`}>
                      <button className="button-edit">
                        <img src='/assets/edit.svg' alt='Edit' className="w-5 h-5" />
                      </button>
                    </Link>
                    <form action={deleteMember}>
                      <input type="hidden" name="id" value={member._id} />
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
        path="member"
        pageNumber={result.pageNumber}
        isNext={result.isNext}
      />
      </div>
    </>
  );
}

export default Page;
