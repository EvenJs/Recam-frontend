import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { setCoverImage } from "@/api/media.api";
import { useMedia } from "@/features/media/hooks/useMedia";
import { queryClient } from "@/lib/queryClient";

interface CoverImageSelectorProps {
  listingId: number;
  onClose: () => void;
}

export default function CoverImageSelector({
  listingId,
  onClose,
}: CoverImageSelectorProps) {
  const { pictures, isLoading } = useMedia(listingId);

  const mutation = useMutation({
    mutationFn: (mediaId: number) => setCoverImage(listingId, mediaId),
    onSuccess: () => {
      toast.success("Cover image set");
      queryClient.invalidateQueries({ queryKey: ["media", listingId] });
      queryClient.invalidateQueries({ queryKey: ["preview", listingId] });
      onClose();
    },
    onError: () => toast.error("Failed to set cover image"),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-md" />
        ))}
      </div>
    );
  }

  if (pictures.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No photos uploaded yet. Upload media first.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Select a cover photo to display on the first page
      </p>
      <div className="grid grid-cols-3 gap-2">
        {pictures.map((photo) => (
          <div
            key={photo.id}
            className={`relative rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
              photo.isHero
                ? "border-primary"
                : "border-transparent hover:border-muted-foreground"
            }`}
            onClick={() => !mutation.isPending && mutation.mutate(photo.id)}
          >
            <img
              src={photo.mediaUrl}
              alt="cover option"
              className="w-full aspect-square object-cover"
            />
            {photo.isHero && (
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
