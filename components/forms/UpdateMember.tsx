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

import { MemberValidation } from "@/lib/validations/member";
import { updateMember } from "@/lib/actions/member.actions";

interface Props {
  memberId: string;
  initialData: z.infer<typeof MemberValidation>;
}

function UpdateMember({ memberId, initialData }: Props) {
  const router = useRouter();

  const form = useForm<z.infer<typeof MemberValidation>>({
    resolver: zodResolver(MemberValidation),
    defaultValues: initialData,
  });

  const onSubmit = async (values: z.infer<typeof MemberValidation>) => {
    await updateMember(memberId, values);
    router.push("/member");
  };

  return (
    <Form {...form}>
      <form
        className='mt-10 flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {["username", "email", "password", "phone", "role", "address"].map((fieldName) => (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName as keyof z.infer<typeof MemberValidation>} // Cast fieldName to the correct type
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-3'>
                <FormLabel className='text-base-semibold text-light-2'>
                  {fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                </FormLabel>
                <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <Input {...field} type={fieldName === "password" ? "password" : "text"} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button type='submit' className='bg-primary-500'>
          Update Member
        </Button>
      </form>
    </Form>
  );
}

export default UpdateMember;
