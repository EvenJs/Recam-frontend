import { useState, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  X,
  Globe,
  Copy,
  ChevronLeft,
  Download,
  Pencil,
  Bed,
  Bath,
  Car,
  Maximize2,
  Play,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getPreview, publishListing } from "@/api/publish.api";
import { downloadFile, downloadZip } from "@/api/media.api";
import { updateListing } from "@/api/listing.api";
import { useMedia } from "@/features/media/hooks/useMedia";
import { saleCategoryLabel } from "@/utils/enumMaps";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import AgentContactsSection from "@/features/publish/components/AgentContactsSection";
import type { ListingCase } from "@/types/models";
import type { PropertyType, SaleCategory } from "@/types/enums";

const CoverImageSelector = lazy(
  () => import("@/features/publish/components/CoverImageSelector"),
);
const PhotoSelector = lazy(
  () => import("@/features/publish/components/PhotoSelector"),
);
const PropertyDetailsModal = lazy(
  () => import("@/features/publish/components/PropertyDetailsModal"),
);
const PropertyDescription = lazy(
  () => import("@/features/publish/components/PropertyDescription"),
);

async function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function PreviewPage() {
  const { id } = useParams();
  const listingId = Number(id);
  const navigate = useNavigate();
  const { isAgent, isAdmin } = useAuth();

  const [shareableUrl, setShareableUrl] = useState<string | null>(null);
  const [editingCover, setEditingCover] = useState(false);
  const [editingPhotos, setEditingPhotos] = useState(false);
  const [editingDetails, setEditingDetails] = useState(false);
  const [activeImageTab, setActiveImageTab] = useState("photos");

  // Navigation helpers
  const goBack = () =>
    isAgent ? navigate("/dashboard") : navigate(`/listings/${listingId}`);

  // Queries
  const { data, isLoading, isError } = useQuery({
    queryKey: ["preview", listingId],
    queryFn: () => getPreview(listingId),
  });

  const { pictures, videos, floorPlans, vrTours } = useMedia(listingId);

  // Mutations
  const publishMutation = useMutation({
    mutationFn: () => publishListing(listingId),
    onSuccess: (url) => {
      setShareableUrl(url);
      toast.success("Published!");
    },
    onError: () => toast.error("Failed to publish"),
  });

  // Loading / error states
  if (isLoading) return <PreviewSkeleton />;

  if (isError || !data?.listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Failed to load preview.</p>
      </div>
    );
  }

  const { listing } = data;

  // Update mutation — defined after listing is available
  const handleUpdate = (updates: Partial<ListingCase>) =>
    updateListing(listingId, {
      ...updates,
      propertyType: (updates.propertyType ??
        listing.propertyType) as PropertyType,
      saleCategory: (updates.saleCategory ??
        listing.saleCategory) as SaleCategory,
    });

  const updateMutation = {
    mutate: (updates: Partial<ListingCase>) => {
      handleUpdate(updates)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["preview", listingId] });
          queryClient.invalidateQueries({ queryKey: ["listing", listingId] });
          toast.success("Changes saved");
          setEditingDetails(false);
        })
        .catch(() => toast.error("Failed to save changes"));
    },
  };

  const heroImage =
    pictures.find((m) => m.isHero) ??
    floorPlans.find((m) => m.isHero) ??
    videos.find((m) => m.isHero);

  const imageTabs = [
    { id: "photos", label: "Images", count: pictures.length },
    { id: "floorplan", label: "Floor Plan", count: floorPlans.length },
    { id: "vr", label: "VR Tour", count: vrTours.length },
  ].filter((t) => t.count > 0);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-white border-b px-4 md:px-8 h-12 flex items-center justify-between gap-4">
        {/* Left: Back + Download */}
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden md:inline">Back</span>
          </button>
          <Button
            size="sm"
            className="bg-[#1DA1F2] hover:bg-[#1a91da] rounded-full text-xs h-7 px-3"
            onClick={() =>
              downloadZip(listingId).then((blob) =>
                triggerDownload(blob, `listing-${listingId}-media.zip`),
              )
            }
          >
            <Download className="w-3 h-3 mr-1" />
            Download Files
          </Button>
        </div>

        {/* Right: Copy Link + Exit + Publish */}
        <div className="flex items-center gap-2">
          {shareableUrl && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-xs h-7 px-3"
              onClick={() => {
                navigator.clipboard.writeText(shareableUrl);
                toast.success("Link copied");
              }}
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy Website Link
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs h-7 px-3"
            onClick={goBack}
          >
            <X className="w-3 h-3 mr-1" />
            Exit
          </Button>
          <Button
            size="sm"
            className="rounded-full text-xs h-7 px-3 bg-[#1DA1F2] hover:bg-[#1a91da]"
            onClick={() => publishMutation.mutate()}
            disabled={publishMutation.isPending}
          >
            <Globe className="w-3 h-3 mr-1" />
            {publishMutation.isPending ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      {/* ── Published URL banner ─────────────────────────────────── */}
      {shareableUrl && (
        <div className="bg-green-50 border-b border-green-200 px-4 md:px-8 py-2 flex items-center gap-3">
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

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 h-56 md:h-80">
        {/* Edit cover — Admin only */}
        {isAdmin && (
          <button
            onClick={() => setEditingCover(true)}
            className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-white/90 text-xs px-3 py-1.5 rounded-full shadow hover:bg-white transition-colors"
          >
            <Pencil className="w-3 h-3" />
            Edit
          </button>
        )}

        {/* Left — hero image */}
        <div className="relative overflow-hidden">
          {heroImage ? (
            <img
              src={heroImage.mediaUrl}
              alt="Property"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full bg-slate-200 flex flex-col items-center justify-center gap-2 transition-colors ${
                isAdmin ? "cursor-pointer hover:bg-slate-300" : ""
              }`}
              onClick={() => isAdmin && setEditingCover(true)}
            >
              <Pencil className="w-5 h-5 text-slate-400" />
              <p className="text-sm text-slate-500">
                {isAdmin ? "Select a cover image" : "No cover image set"}
              </p>
            </div>
          )}
        </div>

        {/* Right — dark overlay */}
        <div className="bg-[#1a1a1a] flex flex-col items-center justify-center px-8 text-white space-y-3">
          {/* Edit property details — Admin only */}
          {isAdmin && (
            <button
              onClick={() => setEditingDetails(true)}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-xs px-3 py-1 rounded-full transition-colors"
            >
              <Pencil className="w-3 h-3" />
              Edit
            </button>
          )}
          <p className="text-xs uppercase tracking-widest text-slate-400">
            {saleCategoryLabel[listing.saleCategory]}
          </p>
          <h1 className="text-xl md:text-2xl font-bold text-center leading-tight">
            {listing.street}
          </h1>
          <p className="text-sm text-slate-300 text-center">
            {listing.city}, {listing.state} {listing.postcode}
          </p>
          <div className="w-8 h-px bg-slate-500" />
          <div className="flex items-center gap-5">
            {[
              { icon: Bed, value: listing.bedrooms, label: "Beds" },
              { icon: Bath, value: listing.bathrooms, label: "Baths" },
              { icon: Car, value: listing.garages, label: "Garages" },
              { icon: Maximize2, value: `${listing.floorArea}`, label: "m²" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon className="w-4 h-4 text-slate-300" />
                <span className="text-xs text-slate-400">
                  {value} {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 space-y-14">
        {/* Property Description */}
        <section className="text-center space-y-3">
          <h2 className="text-xl font-semibold">Property Description</h2>
          <Suspense fallback={<Skeleton className="h-16 w-full" />}>
            <PropertyDescription
              description={listing.description ?? ""}
              onSave={(desc) =>
                updateMutation.mutate({
                  description: desc,
                } as Partial<ListingCase>)
              }
              readOnly={isAgent}
            />
          </Suspense>
        </section>

        {/* Image section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Image</h2>
            {/* Select Photos — Admin only */}
            {isAdmin && (
              <button
                onClick={() => setEditingPhotos(true)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border rounded-full px-3 py-1"
              >
                <Pencil className="w-3 h-3" />
                Select Photos
              </button>
            )}
          </div>

          {/* Image tabs */}
          {imageTabs.length > 1 && (
            <div className="flex gap-2 border-b overflow-x-auto">
              {imageTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveImageTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeImageTab === tab.id
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          )}

          {/* Photos grid */}
          {activeImageTab === "photos" && pictures.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {pictures.map((photo) => (
                <div key={photo.id} className="space-y-1">
                  <div className="relative rounded-md overflow-hidden aspect-square">
                    <img
                      src={photo.mediaUrl}
                      alt="photo"
                      className="w-full h-full object-cover"
                    />
                    {photo.isSelect && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between px-0.5">
                    <p className="text-xs text-muted-foreground truncate">
                      {photo.id}.jpg
                    </p>
                    <button
                      onClick={() =>
                        downloadFile(photo.id).then((blob) =>
                          triggerDownload(blob, `photo-${photo.id}.jpg`),
                        )
                      }
                      className="text-xs text-blue-500 hover:underline shrink-0 ml-1"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Floor plan tab */}
          {activeImageTab === "floorplan" && floorPlans.length > 0 && (
            <div className="space-y-4">
              {floorPlans.map((fp, i) => (
                <div key={fp.id} className="space-y-2">
                  {floorPlans.length > 1 && (
                    <p className="text-xs text-muted-foreground font-medium">
                      Floor Plan {i + 1}
                    </p>
                  )}
                  <img
                    src={fp.mediaUrl}
                    alt="Floor Plan"
                    className="w-full rounded-md border"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        downloadFile(fp.id).then((blob) =>
                          triggerDownload(blob, `floorplan-${fp.id}.pdf`),
                        )
                      }
                      className="text-xs text-blue-500 hover:underline"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VR tab */}
          {activeImageTab === "vr" && vrTours.length > 0 && (
            <div className="space-y-3">
              {vrTours.map((vr) => (
                <div
                  key={vr.id}
                  className="border rounded-md p-4 flex items-center justify-between"
                >
                  <p className="text-sm text-muted-foreground">
                    VR Tour {vr.id}
                  </p>
                  <button
                    onClick={() =>
                      downloadFile(vr.id).then((blob) =>
                        triggerDownload(blob, `vrtour-${vr.id}.gltf`),
                      )
                    }
                    className="text-xs text-blue-500 hover:underline"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}

          {pictures.length === 0 &&
            floorPlans.length === 0 &&
            vrTours.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No media uploaded yet.
              </p>
            )}
        </section>

        {/* Floor Plan section */}
        {floorPlans.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Floor Plan</h2>
            {floorPlans.map((fp, i) => (
              <div key={fp.id} className="space-y-2">
                {floorPlans.length > 1 && (
                  <p className="text-xs text-muted-foreground">
                    Floor Plan {i + 1}
                  </p>
                )}
                <img
                  src={fp.mediaUrl}
                  alt="Floor Plan"
                  className="w-full rounded-md border"
                />
              </div>
            ))}
          </section>
        )}

        {/* Videography */}
        {videos.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Videography</h2>
            {videos.map((video) => (
              <div key={video.id} className="space-y-2">
                <div className="relative w-full aspect-video rounded-md overflow-hidden bg-slate-100">
                  <img
                    src={video.mediaUrl}
                    alt="Video"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center shadow-lg">
                      <Play className="w-6 h-6 text-slate-700 ml-1" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() =>
                      downloadFile(video.id).then((blob) =>
                        triggerDownload(blob, `video-${video.id}.mp4`),
                      )
                    }
                    className="text-xs text-blue-500 hover:underline"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Location */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-center">Location</h2>
          <div className="w-full h-56 rounded-md border bg-slate-100 flex flex-col items-center justify-center gap-2">
            <MapPin className="w-6 h-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center">
              {listing.street}, {listing.city} {listing.state}{" "}
              {listing.postcode}
            </p>
          </div>
        </section>

        {/* Contacts */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-center">Contact</h2>
          <AgentContactsSection listingId={listingId} readOnly={isAgent} />
        </section>
      </div>

      <footer className="border-t py-6 text-center">
        <p className="text-xs text-muted-foreground">Powered by recam</p>
      </footer>

      {/* ── Modals (Admin only) ───────────────────────────────────── */}
      {isAdmin && editingCover && (
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

      {isAdmin && editingPhotos && (
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

      {isAdmin && editingDetails && (
        <Suspense fallback={null}>
          <PropertyDetailsModal
            listing={listing}
            onSave={(data) => updateMutation.mutate(data)}
            onClose={() => setEditingDetails(false)}
          />
        </Suspense>
      )}
    </div>
  );
}

function PreviewSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-12 border-b" />
      <div className="grid grid-cols-2 h-80">
        <Skeleton className="h-full rounded-none" />
        <Skeleton className="h-full rounded-none" />
      </div>
      <div className="max-w-4xl mx-auto px-8 py-12 space-y-8">
        <Skeleton className="h-6 w-48 mx-auto" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}
