import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { getListing, updateListing } from "@/api/listing.api";
import ListingForm from "@/features/listings/components/ListingForm";
import { queryClient } from "@/lib/queryClient";
import type { ListingFormValues } from "@/features/listings/schemas/listingSchema";
import type { PropertyType, SaleCategory } from "@/types/enums";

export default function EditListingPage() {
  const { id } = useParams();
  const listingId = Number(id);
  const navigate = useNavigate();

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", listingId],
    queryFn: () => getListing(listingId),
  });

  const mutation = useMutation({
    mutationFn: (data: ListingFormValues) =>
      updateListing(listingId, {
        ...data,
        propertyType: data.propertyType as PropertyType,
        saleCategory: data.saleCategory as SaleCategory,
      }),
    onSuccess: () => {
      toast.success("Listing updated");
      queryClient.invalidateQueries({ queryKey: ["listing", listingId] });
      navigate("/listings/" + listingId);
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Something went wrong";
      toast.error(message);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Edit Listing</h1>
      <ListingForm
        defaultValues={listing}
        submitLabel="Save Changes"
        isSubmitting={mutation.isPending}
        onSubmit={mutation.mutate}
      />
    </div>
  );
}
