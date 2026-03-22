import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addContact } from "@/api/selection.api";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

const contactSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Enter a valid email"),
  phoneNumber: z.string().min(1, "Required"),
  companyName: z.string().min(1, "Required"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactFormProps {
  listingId: number;
}

export default function ContactForm({ listingId }: ContactFormProps) {
  const { isAdmin } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: ContactFormValues) => addContact(listingId, data),
    onSuccess: () => {
      toast.success("Contact added");
      reset();
      queryClient.invalidateQueries({ queryKey: ["contacts", listingId] });
    },
    onError: () => toast.error("Failed to add contact"),
  });

  if (isAdmin) return null;

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="border rounded-lg p-4 space-y-4"
    >
      <h3 className="text-sm font-medium">Add Contact</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" {...register("firstName")} />
          {errors.firstName && (
            <p className="text-sm text-destructive">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" {...register("lastName")} />
          {errors.lastName && (
            <p className="text-sm text-destructive">
              {errors.lastName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input id="phoneNumber" {...register("phoneNumber")} />
          {errors.phoneNumber && (
            <p className="text-sm text-destructive">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input id="companyName" {...register("companyName")} />
          {errors.companyName && (
            <p className="text-sm text-destructive">
              {errors.companyName.message}
            </p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting || mutation.isPending}>
        {(isSubmitting || mutation.isPending) && (
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
        )}
        Add Contact
      </Button>
    </form>
  );
}
