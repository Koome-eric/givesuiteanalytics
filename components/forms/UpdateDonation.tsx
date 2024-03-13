// UpdateDonor.tsx
"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DonationValidation } from "@/lib/validations/donation";
import { updateDonation } from "@/lib/actions/donation.actions";

interface Props {
  donationId: string;
  initialData: z.infer<typeof DonationValidation>;
}

function UpdateDonation({ donationId, initialData }: Props) {
  const router = useRouter();

  const form = useForm<z.infer<typeof DonationValidation>>({
    resolver: zodResolver(DonationValidation),
    defaultValues: initialData,
  });

  const onSubmit = async (values: z.infer<typeof DonationValidation>) => {
    await updateDonation(donationId, values);
    router.push("/donation");
  };

  return (
    <Form {...form}>
      <form
        className='mt-10 flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {["Name", "Date", "Amount", "Type", "Fund", "account", "Campaign"].map((fieldName) => (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName as keyof z.infer<typeof DonationValidation>} // Cast fieldName to the correct type
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-3'>
                <FormLabel className='text-base-semibold text-light-2'>
                  {fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                </FormLabel>
                <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <Input {...field} type={fieldName === "account" ? "number" : "text"} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button type='submit' className='bg-primary-500'>
          Update Donation
        </Button>
      </form>
    </Form>
  );
}

export default UpdateDonation;
