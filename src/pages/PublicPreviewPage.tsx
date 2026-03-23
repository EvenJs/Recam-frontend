import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Download, Bed, Bath, Car, Maximize2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPreview } from "@/api/publish.api";
import { propertyTypeLabel, saleCategoryLabel } from "@/utils/enumMaps";

export default function PublicPreviewPage() {
  const { token } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["preview", token],
    queryFn: () => getPreview(Number(token)),
    enabled: !!token,
  });

  if (isLoading) return <PublicPreviewSkeleton />;

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">
          This listing is not available.
        </p>
      </div>
    );
  }

  const { listing, media, contacts } = data;

  const heroImage = media.find((m) => m.isHero);
  const photos = media.filter((m) => m.mediaType === 1 && m.isSelect);
  const floorPlans = media.filter((m) => m.mediaType === 3);
  const videos = media.filter((m) => m.mediaType === 2);

  const address = `${listing.street}, ${listing.city} ${listing.state} ${listing.postcode}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 md:px-8 h-12 flex items-center justify-between">
        <span className="text-sm font-semibold text-[#1DA1F2]">recam</span>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full text-xs"
          onClick={() => window.print()}
        >
          <Download className="w-3 h-3 mr-2" />
          Download files
        </Button>
      </div>

      {/* Hero — split layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 h-64 md:h-96">
        {/* Left — hero image */}
        <div className="relative overflow-hidden">
          {heroImage ? (
            <img
              src={heroImage.mediaUrl}
              alt="Property"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-200 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">No cover image</p>
            </div>
          )}
        </div>

        {/* Right — dark overlay with details */}
        <div className="bg-slate-900 flex flex-col items-center justify-center px-8 text-white space-y-4">
          <p className="text-xs uppercase tracking-widest text-slate-400">
            {saleCategoryLabel[listing.saleCategory]}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-center">
            {listing.street}
          </h1>
          <p className="text-sm text-slate-300 text-center">
            {listing.city}, {listing.state} {listing.postcode}
          </p>

          {/* Divider */}
          <div className="w-8 h-px bg-slate-500" />

          {/* Property icons */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <Bed className="w-5 h-5 text-slate-300" />
              <span className="text-xs text-slate-400">
                {listing.bedrooms} Beds
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Bath className="w-5 h-5 text-slate-300" />
              <span className="text-xs text-slate-400">
                {listing.bathrooms} Baths
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Car className="w-5 h-5 text-slate-300" />
              <span className="text-xs text-slate-400">
                {listing.garages} Garages
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Maximize2 className="w-5 h-5 text-slate-300" />
              <span className="text-xs text-slate-400">
                {listing.floorArea} m²
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-16">
        {/* Property Description */}
        <section className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Property Description</h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            {propertyTypeLabel[listing.propertyType]} ·{" "}
            {saleCategoryLabel[listing.saleCategory]}
          </p>
          <p className="text-sm text-muted-foreground">
            {listing.street}, {listing.city}, {listing.state} {listing.postcode}
          </p>
        </section>

        {/* Photography */}
        {photos.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Photography</h2>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((photo, i) => (
                <div
                  key={photo.id}
                  className={`overflow-hidden rounded-md ${
                    i === 0 ? "col-span-2 row-span-2" : ""
                  }`}
                >
                  <img
                    src={photo.mediaUrl}
                    alt={`Photo ${i + 1}`}
                    className="w-full h-full object-cover aspect-square"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Floor Plan */}
        {floorPlans.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Floor Plan</h2>
            {floorPlans.map((fp) => (
              <img
                key={fp.id}
                src={fp.mediaUrl}
                alt="Floor Plan"
                className="w-full rounded-md border"
              />
            ))}
          </section>
        )}

        {/* Videography */}
        {videos.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Videography</h2>
            {videos.map((video) => (
              <div
                key={video.id}
                className="w-full aspect-video rounded-md overflow-hidden bg-slate-100"
              >
                <img
                  src={video.mediaUrl}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </section>
        )}

        {/* Location */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-center">Location</h2>
          <div className="w-full h-48 rounded-md overflow-hidden border bg-slate-100 flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapPin className="w-6 h-6 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{address}</p>
            </div>
          </div>
        </section>

        {/* Contact */}
        {contacts.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-center">Contact</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {contacts.map((contact) => (
                <div
                  key={contact.contactId}
                  className="border rounded-xl p-6 text-center space-y-2 min-w-48"
                >
                  <p className="font-semibold text-sm">
                    {contact.firstName} {contact.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {contact.companyName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {contact.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {contact.phoneNumber}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t py-6 text-center">
        <p className="text-xs text-muted-foreground">Powered by recam</p>
      </footer>
    </div>
  );
}

function PublicPreviewSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-12 border-b" />
      <div className="grid grid-cols-2 h-96">
        <Skeleton className="h-full rounded-none" />
        <Skeleton className="h-full rounded-none" />
      </div>
      <div className="max-w-4xl mx-auto px-8 py-12 space-y-8">
        <Skeleton className="h-6 w-48 mx-auto" />
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}
