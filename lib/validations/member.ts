// validations/member.ts
import * as z from "zod";

export const MemberValidation = z.object({
  username: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
  email: z.string().email(),
  password: z.string().min(6, { message: "Minimum 6 characters." }),
  phone: z.string().optional(),
  address: z.string().optional(),
  role: z.string().optional(),
  author: z.string(),
});