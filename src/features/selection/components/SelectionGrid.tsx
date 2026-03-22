import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useMedia } from "@/features/media/hooks/useMedia";
import { selectMedia } from "@/api/selection.api";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

interface SelectionGridProps {
  listingId: number;
}

export default function SelectionGrid({ listingId }: SelectionGridProps) {
  const { isAdmin } = useAuth();
  const { pictures, isLoading } = useMedia(listingId);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Sync initial selection from API data
  useState(() => {
    const preSelected = pictures.filter((p) => p.isSelect).map((p) => p.id);
    setSelectedIds(preSelected);
  });

  const mutation = useMutation({
    mutationFn: () => selectMedia(listingId, selectedIds),
    onSuccess: () => {
      toast.success("Selection saved");
      queryClient.invalidateQueries({ queryKey: ["media", listingId] });
    },
    onError: () => toast.error("Failed to save selection"),
  });

  if (isAdmin) return null;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-md" />
        ))}
      </div>
    );
  }

  if (pictures.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No photos available. Ask your photography company to upload media first.
      </p>
    );
  }

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

  return (
    <div className="space-y-4">
      {/* Counter */}
      <div className="flex items-center justify-between">
        <p
          className={`text-sm font-medium ${atLimit ? "text-destructive" : "text-muted-foreground"}`}
        >
          {selectedIds.length} / 10 selected
        </p>
        <Button
          size="sm"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Save Selection"}
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {pictures.map((asset) => {
          const isSelected = selectedIds.includes(asset.id);
          const isDisabled = !isSelected && atLimit;

          return (
            <div
              key={asset.id}
              className={`relative rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                isSelected
                  ? "border-primary"
                  : isDisabled
                    ? "border-transparent opacity-40 cursor-not-allowed"
                    : "border-transparent hover:border-muted-foreground"
              }`}
              onClick={() => !isDisabled && toggle(asset.id)}
            >
              <img
                src={asset.mediaUrl}
                alt="media"
                className="w-full aspect-square object-cover"
              />

              {/* Selected overlay */}
              {isSelected && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Hero badge */}
              {asset.isHero && (
                <span className="absolute top-2 left-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-medium">
                  Hero
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile sticky save bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex items-center justify-between">
        <p
          className={`text-sm font-medium ${atLimit ? "text-destructive" : "text-muted-foreground"}`}
        >
          {selectedIds.length} / 10 selected
        </p>
        <Button
          size="sm"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Save Selection"}
        </Button>
      </div>
    </div>
  );
}
