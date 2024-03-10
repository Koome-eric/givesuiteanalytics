// validations/donation.ts
import * as z from "zod";

export const DonationValidation = z.object({
  Name: z.string().min(1, "Name is required"),
  Date: z.string().min(1, "Date is required"),
  Amount: z.string().min(1, "Amount is required"),
  Type: z.string().optional(),
  Fund: z.string().optional(),
  img: z.string().optional(),
  account: z.string().optional(),
  Campaign: z.string().optional(),
  author: z.string(),
});
