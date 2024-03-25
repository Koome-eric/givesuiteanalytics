// AddMember.tsx
"use client";

import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
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
import { addMember } from "@/lib/actions/member.actions";

interface Props {
  userId: string;
}


function AddMember({ userId }: Props) {
  const router = useRouter();

  const form = useForm<z.infer<typeof MemberValidation>>({
    resolver: zodResolver(MemberValidation),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      role: '',
      author: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof MemberValidation>) => {
    await addMember(values);

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
            name={fieldName as keyof z.infer<typeof MemberValidation>}
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-3'>
                <FormLabel className='text-base-semibold text-dark-2'>
                  {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
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
          Add Member
        </Button>
      </form>
    </Form>
  );
}

export default AddMember;
