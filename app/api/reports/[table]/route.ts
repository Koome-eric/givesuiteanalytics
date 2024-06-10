import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/mongoose";
import Donation from "../../../../lib/models/donation.model";
import Donor from "../../../../lib/models/donor.model";
import * as XLSX from "xlsx";

const collectionMap = {
  donations: Donation,
  donors: Donor,
} as const;

type CollectionName = keyof typeof collectionMap;

export async function GET(request: NextRequest, context: { params: { table: CollectionName } }) {
  await connectToDB();

  const { table } = context.params;
  const format = request.nextUrl.searchParams.get("format");

  const Model = collectionMap[table];
  if (!Model) {
    return new NextResponse("Collection not found", { status: 404 });
  }

  const data = await Model.find().lean();
  const worksheet = XLSX.utils.json_to_sheet(data);

  let response;
  if (format === "csv") {
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    response = new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${table}.csv"`,
      },
    });
  } else if (format === "xlsx") {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, table);
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    response = new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${table}.xlsx"`,
      },
    });
  } else {
    return new NextResponse("Invalid format", { status: 400 });
  }

  return response;
}
