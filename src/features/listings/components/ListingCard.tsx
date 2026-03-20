import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import StatusBadge from "./StatusBadge";
import { propertyTypeLabel, saleCategoryLabel } from "@/utils/enumMaps";
import type { ListingCase } from "@/types/models";

interface ListingCardProps {
  listing: ListingCase;
}

const formatPrice = (price: number) =>
  Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(
    price,
  );

const formatDate = (date: string) => new Date(date).toLocaleDateString("en-AU");

export default function ListingCard({ listing }: ListingCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/listings/${listing.id}`)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-sm leading-tight">{listing.title}</h3>
          <StatusBadge status={listing.listcaseStatus} />
        </div>
        <p className="text-xs text-muted-foreground">
          {listing.street}, {listing.city} {listing.state}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{propertyTypeLabel[listing.propertyType]}</span>
          <span>·</span>
          <span>{saleCategoryLabel[listing.saleCategory]}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">
            {formatPrice(listing.price)}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDate(listing.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
