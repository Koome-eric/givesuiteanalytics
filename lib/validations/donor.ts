// validations/donor.ts
import * as z from "zod";

export const DonorValidation = z.object({
  name: z.string().min(1, "Name is required"),
  primaryemailaddress: z.string().email("Invalid email address"),
  primarystreet: z.string().optional(),
  primarycity: z.string().optional(),
  primarystate: z.string().optional(),
  phonenumber: z.string().optional(),
  donationnumber: z.number().min(0, "Donation number must be a positive number").optional(),
  donationamount: z.string().optional(),
  lastdate: z.string().optional(),
  img: z.string().optional(),
  accountnumber: z.string().min(0, "Account number must be a positive number").optional(),
  author: z.string(),
  primaryzipcode: z.number().min(0, "Primary zip code must be a positive number").optional(),
  firstdonationdate: z.string().optional(),
  largestdonationdate: z.string().optional(),
  firstdonation: z.string().optional(),
  largestdonation: z.string().optional(),
  latestdonation: z.string().optional(),
  
});
