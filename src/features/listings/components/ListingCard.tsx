import { useNavigate } from "react-router-dom";
import { Camera, FileText, Video, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { listcaseStatusLabel } from "@/utils/enumMaps";
import type { ListingCase } from "@/types/models";

interface ListingCardProps {
  listing: ListingCase;
  index?: number;
}

const mediaTagConfig = [
  { type: 1, label: "Photography", icon: Camera },
  { type: 2, label: "Videography", icon: Video },
  { type: 3, label: "Floor Plan", icon: FileText },
  { type: 4, label: "VR Tour", icon: Globe },
];

const formatPrice = (price: number) =>
  Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(price);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const isDelivered = (status: number) => status === 4;

export default function ListingCard({ listing, index }: ListingCardProps) {
  const navigate = useNavigate();
  const orderNumber = index
    ? `Order # ${String(index).padStart(3, "0")}-${String(index).padStart(3, "0")}-${String(index).padStart(3, "0")}`
    : `Order # ${listing.id}`;

  // Use mediaTypes from API if available, otherwise show all tags as fallback
  const availableTypes =
    listing.mediaTypes?.length > 0 ? listing.mediaTypes : [1, 2, 3, 4];

  const mediaTags = mediaTagConfig.filter((tag) =>
    availableTypes.includes(tag.type),
  );

  return (
    <div className="bg-white rounded-lg border p-4 space-y-3">
      {/* Order number + status badge */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-muted-foreground font-medium">
            {orderNumber}
          </p>
          <p className="text-xs text-muted-foreground">
            Ordered on {formatDate(listing.createdAt)}
          </p>
        </div>
        <Badge
          className={
            isDelivered(listing.listcaseStatus)
              ? "bg-green-100 text-green-700 hover:bg-green-100 shrink-0"
              : "bg-blue-100 text-blue-700 hover:bg-blue-100 shrink-0"
          }
        >
          {listcaseStatusLabel[listing.listcaseStatus]}
        </Badge>
      </div>

      {/* Address */}
      <h3 className="font-semibold text-sm">
        {listing.street}, {listing.city}, {listing.state}, {listing.postcode}
      </h3>

      {/* Media type tags */}
      <div className="flex flex-wrap gap-2">
        {mediaTags.map(({ type, label, icon: Icon }) => (
          <span
            key={type}
            className="flex items-center gap-1 text-xs text-muted-foreground border rounded-md px-2 py-1"
          >
            <Icon className="w-3 h-3" />
            {label}
          </span>
        ))}
      </div>

      {/* Price + View details */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => navigate(`/listings/${listing.id}`)}
          className="text-xs text-blue-500 hover:underline"
        >
          View order details &raquo;
        </button>
        <span className="font-semibold text-blue-500">
          {formatPrice(listing.price)}
        </span>
      </div>

      {/* Website button — Delivered only */}
      {isDelivered(listing.listcaseStatus) && (
        <div className="flex justify-end pt-1">
          <button
            onClick={() => navigate(`/listings/${listing.id}/preview`)}
            className="flex items-center gap-2 bg-slate-800 text-white text-xs px-4 py-2 rounded-full hover:bg-slate-700 transition-colors"
          >
            <Globe className="w-3 h-3" />
            Website
          </button>
        </div>
      )}
    </div>
  );
}
