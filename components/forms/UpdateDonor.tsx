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

import { DonorValidation } from "@/lib/validations/donor";
import { updateDonor } from "@/lib/actions/donor.actions";

interface Props {
  donorId: string;
  initialData: z.infer<typeof DonorValidation>;
}

function UpdateDonor({ donorId, initialData }: Props) {
  const router = useRouter();

  const form = useForm<z.infer<typeof DonorValidation>>({
    resolver: zodResolver(DonorValidation),
    defaultValues: initialData,
  });

  const onSubmit = async (values: z.infer<typeof DonorValidation>) => {
    await updateDonor(donorId, values);
    router.push("/donor");
  };

  return (
    <Form {...form}>
      <form
        className='mt-10 flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {["name", "primaryemailaddress", "primarystreet", "primarycity", "primarystate", "accountnumber"].map((fieldName) => (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName as keyof z.infer<typeof DonorValidation>} // Cast fieldName to the correct type
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-3'>
                <FormLabel className='text-base-semibold text-dark-2'>
                  {fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                </FormLabel>
                <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button type='submit' className='bg-primary-500'>
          Update Donor
        </Button>
      </form>
    </Form>
  );
}

export default UpdateDonor;
