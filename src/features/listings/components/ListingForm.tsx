import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  listingSchema,
  type ListingFormValues,
} from "../schemas/listingSchema";
import { propertyTypeLabel, saleCategoryLabel } from "@/utils/enumMaps";

interface ListingFormProps {
  defaultValues?: Partial<ListingFormValues>;
  onSubmit: (values: ListingFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const propertyTypeOptions = Object.entries(propertyTypeLabel).map(
  ([value, label]) => ({ value: Number(value), label }),
);

const saleCategoryOptions = Object.entries(saleCategoryLabel).map(
  ([value, label]) => ({ value: Number(value), label }),
);

const resolver = zodResolver(
  listingSchema,
) as unknown as Resolver<ListingFormValues>;

export default function ListingForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Save",
}: ListingFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ListingFormValues>({
    resolver,
    defaultValues,
  });
  const handleFormSubmit: SubmitHandler<ListingFormValues> = (values) => {
    onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-8 max-w-2xl"
    >
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Modern Family Home"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Address */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="street">Street</Label>
            <Input
              id="street"
              placeholder="123 Main St"
              {...register("street")}
            />
            {errors.street && (
              <p className="text-sm text-destructive">
                {errors.street.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="Melbourne" {...register("city")} />
            {errors.city && (
              <p className="text-sm text-destructive">{errors.city.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" placeholder="VIC" {...register("state")} />
            {errors.state && (
              <p className="text-sm text-destructive">{errors.state.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="postcode">Postcode</Label>
            <Input
              id="postcode"
              type="number"
              placeholder="3000"
              {...register("postcode")}
            />
            {errors.postcode && (
              <p className="text-sm text-destructive">
                {errors.postcode.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Property details */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Property Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price (AUD)</Label>
            <Input
              id="price"
              type="number"
              placeholder="850000"
              {...register("price")}
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="floorArea">Floor Area (m²)</Label>
            <Input
              id="floorArea"
              type="number"
              placeholder="320"
              {...register("floorArea")}
            />
            {errors.floorArea && (
              <p className="text-sm text-destructive">
                {errors.floorArea.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              type="number"
              min={0}
              placeholder="4"
              {...register("bedrooms")}
            />
            {errors.bedrooms && (
              <p className="text-sm text-destructive">
                {errors.bedrooms.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              id="bathrooms"
              type="number"
              min={0}
              placeholder="2"
              {...register("bathrooms")}
            />
            {errors.bathrooms && (
              <p className="text-sm text-destructive">
                {errors.bathrooms.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="garages">Garages</Label>
            <Input
              id="garages"
              type="number"
              min={0}
              placeholder="2"
              {...register("garages")}
            />
            {errors.garages && (
              <p className="text-sm text-destructive">
                {errors.garages.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Type & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Property Type</Label>
          <Select
            value={watch("propertyType")?.toString()}
            onValueChange={(v) =>
              setValue("propertyType", Number(v), { shouldValidate: true })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value.toString()}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.propertyType && (
            <p className="text-sm text-destructive">
              {errors.propertyType.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Sale Category</Label>
          <Select
            value={watch("saleCategory")?.toString()}
            onValueChange={(v) =>
              setValue("saleCategory", Number(v), { shouldValidate: true })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {saleCategoryOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value.toString()}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.saleCategory && (
            <p className="text-sm text-destructive">
              {errors.saleCategory.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
        {submitLabel}
      </Button>
    </form>
  );
}
