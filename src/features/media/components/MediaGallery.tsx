import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MediaCard from "./MediaCard";
import MediaUploader from "./MediaUploader";
import { useMedia } from "../hooks/useMedia";
import { mediaTypeLabel } from "@/utils/enumMaps";
import { downloadZip } from "@/api/media.api";

interface MediaGalleryProps {
  listingId: number;
}

async function triggerZipDownload(listingId: number) {
  const blob = await downloadZip(listingId);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `listing-${listingId}-media.zip`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function MediaGallery({ listingId }: MediaGalleryProps) {
  const { pictures, videos, floorPlans, vrTours, isLoading, isError } =
    useMedia(listingId);

  const sections = [
    { label: mediaTypeLabel[1], items: pictures },
    { label: mediaTypeLabel[2], items: videos },
    { label: mediaTypeLabel[3], items: floorPlans },
    { label: mediaTypeLabel[4], items: vrTours },
  ].filter((s) => s.items.length > 0);

  if (isError) {
    return <p className="text-sm text-destructive">Failed to load media.</p>;
  }

  return (
    <div className="space-y-8">
      {/* Upload + Download ZIP */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <MediaUploader listingId={listingId} />
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            triggerZipDownload(listingId).catch(() =>
              toast.error("Failed to download ZIP"),
            )
          }
        >
          <Download className="w-4 h-4 mr-2" />
          Download All (ZIP)
        </Button>
      </div>

      {/* Media sections */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-md" />
          ))}
        </div>
      ) : sections.length === 0 ? (
        <p className="text-sm text-muted-foreground">No media uploaded yet.</p>
      ) : (
        sections.map(({ label, items }) => (
          <div key={label} className="space-y-3">
            <h3 className="text-sm font-medium">{label}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {items.map((asset) => (
                <MediaCard key={asset.id} asset={asset} listingId={listingId} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
