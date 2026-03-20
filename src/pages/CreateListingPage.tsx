import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createListing } from "@/api/listing.api";
import ListingForm from "@/features/listings/components/ListingForm";
import type { ListingFormValues } from "@/features/listings/schemas/listingSchema";
import type { PropertyType, SaleCategory } from "@/types/enums";

export default function CreateListingPage() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: ListingFormValues) =>
      createListing({
        ...data,
        propertyType: data.propertyType as PropertyType,
        saleCategory: data.saleCategory as SaleCategory,
      }),
    onSuccess: (data) => {
      toast.success("Listing created");
      navigate("/listings/" + data.id);
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Something went wrong";
      toast.error(message);
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">New Listing</h1>
      <ListingForm
        submitLabel="Create Listing"
        isSubmitting={mutation.isPending}
        onSubmit={mutation.mutate}
      />
    </div>
  );
}
