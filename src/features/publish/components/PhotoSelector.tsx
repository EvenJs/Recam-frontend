import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMedia } from "@/features/media/hooks/useMedia";
import { selectMedia } from "@/api/selection.api";
import { queryClient } from "@/lib/queryClient";

interface PhotoSelectorProps {
  listingId: number;
  onClose: () => void;
}

export default function PhotoSelector({
  listingId,
  onClose,
}: PhotoSelectorProps) {
  const { pictures, isLoading } = useMedia(listingId);

  const [selectedIds, setSelectedIds] = useState<number[]>(
    pictures.filter((p) => p.isSelect).map((p) => p.id),
  );

  const mutation = useMutation({
    mutationFn: () => selectMedia(listingId, selectedIds),
    onSuccess: () => {
      toast.success("Photos saved");
      queryClient.invalidateQueries({ queryKey: ["media", listingId] });
      queryClient.invalidateQueries({ queryKey: ["preview", listingId] });
      onClose();
    },
    onError: () => toast.error("Failed to save photos"),
  });

  const toggle = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : prev.length < 10
          ? [...prev, id]
          : prev,
    );
  };

  const atLimit = selectedIds.length >= 10;

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
        No photos uploaded yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p
          className={`text-xs font-medium ${atLimit ? "text-destructive" : "text-muted-foreground"}`}
        >
          {selectedIds.length} / 10 selected
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {pictures.map((photo) => {
          const isSelected = selectedIds.includes(photo.id);
          const isDisabled = !isSelected && atLimit;

          return (
            <div
              key={photo.id}
              className={`relative rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                isSelected
                  ? "border-primary"
                  : isDisabled
                    ? "border-transparent opacity-40 cursor-not-allowed"
                    : "border-transparent hover:border-muted-foreground"
              }`}
              onClick={() => !isDisabled && toggle(photo.id)}
            >
              <img
                src={photo.mediaUrl}
                alt="photo"
                className="w-full aspect-square object-cover"
              />
              {isSelected && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
