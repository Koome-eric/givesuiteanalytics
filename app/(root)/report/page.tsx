import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <div className="bg-light-1 rounded-md p-7">
      <h1 className="text-xl font-bold mb-4">Reports</h1>
      <Table>
        <TableCaption>Available Reports</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Report Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Donations</TableCell>
            <TableCell>
              <Link href="/api/reports/donations?format=xlsx">
                <button className="mr-2">Download XLSX</button>
              </Link>
              <Link href="/api/reports/donations?format=csv">
                <button>Download CSV</button>
              </Link>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Donors</TableCell>
            <TableCell>
              <Link href="/api/reports/donors?format=xlsx">
                <button className="mr-2">Download XLSX</button>
              </Link>
              <Link href="/api/reports/donors?format=csv">
                <button>Download CSV</button>
              </Link>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default Page;
