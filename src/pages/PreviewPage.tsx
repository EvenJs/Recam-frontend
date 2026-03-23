import { useState, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  X,
  Globe,
  Copy,
  Menu,
  Pencil,
  Bed,
  Bath,
  Car,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getPreview, publishListing } from "@/api/publish.api";
import { propertyTypeLabel, saleCategoryLabel } from "@/utils/enumMaps";

const CoverImageSelector = lazy(
  () => import("@/features/publish/components/CoverImageSelector"),
);
const PhotoSelector = lazy(
  () => import("@/features/publish/components/PhotoSelector"),
);

const sections = [
  { id: "cover", label: "Cover" },
  { id: "description", label: "Description" },
  { id: "photography", label: "Photography" },
  { id: "floorplan", label: "Floor Plan" },
  { id: "videography", label: "Videography" },
  { id: "location", label: "Location" },
  { id: "contacts", label: "Agent Contacts" },
];

export default function PreviewPage() {
  const { id } = useParams();
  const listingId = Number(id);
  const navigate = useNavigate();

  const [shareableUrl, setShareableUrl] = useState<string | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [editingCover, setEditingCover] = useState(false);
  const [editingPhotos, setEditingPhotos] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["preview", listingId],
    queryFn: () => getPreview(listingId),
  });

  const publishMutation = useMutation({
    mutationFn: () => publishListing(listingId),
    onSuccess: (url) => {
      setShareableUrl(url);
      toast.success("Published!");
    },
    onError: () => toast.error("Failed to publish"),
  });

  if (isLoading) return <PreviewSkeleton />;

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Failed to load preview.</p>
      </div>
    );
  }

  const { listing, media, contacts } = data;
  const heroImage = media.find((m) => m.isHero);
  const photos = media.filter((m) => m.mediaType === 1 && m.isSelect);
  const floorPlans = media.filter((m) => m.mediaType === 3);
  const videos = media.filter((m) => m.mediaType === 2);

  const scrollTo = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky topbar */}
      <div className="sticky top-0 z-20 bg-white border-b px-4 md:px-8 h-14 flex items-center justify-between gap-4">
        {/* Mobile nav toggle */}
        <button
          className="md:hidden text-muted-foreground"
          onClick={() => setNavOpen(!navOpen)}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop section nav */}
        <nav className="hidden md:flex items-center gap-4 flex-1 overflow-x-auto">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="text-xs text-muted-foreground hover:text-foreground whitespace-nowrap transition-colors"
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs"
            onClick={() => navigate(`/listings/${listingId}`)}
          >
            <X className="w-3 h-3 mr-1" />
            Exit
          </Button>
          <Button
            size="sm"
            className="rounded-full text-xs bg-[#1DA1F2] hover:bg-[#1a91da]"
            onClick={() => publishMutation.mutate()}
            disabled={publishMutation.isPending}
          >
            <Globe className="w-3 h-3 mr-1" />
            {publishMutation.isPending ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      {/* Mobile slide-out nav */}
      {navOpen && (
        <div className="md:hidden fixed inset-0 z-30 flex">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setNavOpen(false)}
          />
          <div className="w-56 bg-white h-full shadow-xl p-6 space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-slate-100 transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Shareable URL banner */}
      {shareableUrl && (
        <div className="bg-green-50 border-b border-green-200 px-4 md:px-8 py-3 flex items-center gap-3">
          <p className="text-xs text-green-700 font-medium shrink-0">
            Published:
          </p>
          <Input value={shareableUrl} readOnly className="h-7 text-xs flex-1" />
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 h-7 text-xs"
            onClick={() => {
              navigator.clipboard.writeText(shareableUrl);
              toast.success("Link copied to clipboard");
            }}
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy
          </Button>
        </div>
      )}

      {/* Hero section */}
      <div
        id="cover"
        className="relative grid grid-cols-1 md:grid-cols-2 h-64 md:h-96"
      >
        {/* Edit cover button */}
        <button
          onClick={() => setEditingCover(true)}
          className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-white/90 text-xs px-3 py-1.5 rounded-full shadow hover:bg-white transition-colors"
        >
          <Pencil className="w-3 h-3" />
          Edit
        </button>

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
              <p className="text-sm text-muted-foreground">
                No cover image set
              </p>
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
          <div className="w-8 h-px bg-slate-500" />
          <div className="flex items-center gap-6">
            {[
              { icon: Bed, value: listing.bedrooms, label: "Beds" },
              { icon: Bath, value: listing.bathrooms, label: "Baths" },
              { icon: Car, value: listing.garages, label: "Garages" },
              { icon: Maximize2, value: listing.floorArea, label: "m²" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon className="w-5 h-5 text-slate-300" />
                <span className="text-xs text-slate-400">
                  {value} {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content sections */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-16">
        {/* Description */}
        <section id="description" className="text-center space-y-3">
          <h2 className="text-xl font-semibold">Property Description</h2>
          <p className="text-sm text-muted-foreground">
            {propertyTypeLabel[listing.propertyType]} ·{" "}
            {saleCategoryLabel[listing.saleCategory]}
          </p>
          <p className="text-sm text-muted-foreground">
            {listing.street}, {listing.city}, {listing.state} {listing.postcode}
          </p>
        </section>

        {/* Photography */}
        {photos.length > 0 && (
          <section id="photography" className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <h2 className="text-xl font-semibold">Photography</h2>
              <button
                onClick={() => setEditingPhotos(true)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border rounded-full px-3 py-1"
              >
                <Pencil className="w-3 h-3" />
                Edit
              </button>
            </div>
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
          <section id="floorplan" className="space-y-4">
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
          <section id="videography" className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Videography</h2>
            {videos.map((video) => (
              <div
                key={video.id}
                className="w-full aspect-video rounded-md overflow-hidden bg-slate-100"
              >
                <img
                  src={video.mediaUrl}
                  alt="Video"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </section>
        )}

        {/* Location */}
        <section id="location" className="space-y-4">
          <h2 className="text-xl font-semibold text-center">Location</h2>
          <div className="w-full h-48 rounded-md border bg-slate-50 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              {listing.street}, {listing.city} {listing.state}{" "}
              {listing.postcode}
            </p>
          </div>
        </section>

        {/* Contacts */}
        {contacts.length > 0 && (
          <section id="contacts" className="space-y-6">
            <h2 className="text-xl font-semibold text-center">
              Agent Contacts
            </h2>
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

      <footer className="border-t py-6 text-center">
        <p className="text-xs text-muted-foreground">Powered by recam</p>
      </footer>

      {/* Cover image selector modal */}
      {editingCover && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Select Cover Image</h3>
              <button
                onClick={() => setEditingCover(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <Suspense fallback={<Skeleton className="h-48 w-full" />}>
              <CoverImageSelector
                listingId={listingId}
                onClose={() => setEditingCover(false)}
              />
            </Suspense>
          </div>
        </div>
      )}

      {/* Photo selector modal */}
      {editingPhotos && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Select Display Photos</h3>
              <button
                onClick={() => setEditingPhotos(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <Suspense fallback={<Skeleton className="h-48 w-full" />}>
              <PhotoSelector
                listingId={listingId}
                onClose={() => setEditingPhotos(false)}
              />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}

function PreviewSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-14 border-b" />
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
