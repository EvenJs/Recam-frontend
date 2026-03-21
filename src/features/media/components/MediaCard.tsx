import { useState } from "react";
import { Download, Star, Trash2, Video, FileText, Globe } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteMedia, setCoverImage, downloadFile } from "@/api/media.api";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import type { MediaAsset } from "@/types/models";

interface MediaCardProps {
  asset: MediaAsset;
  listingId: number;
}

const typeIcons = {
  2: Video,
  3: FileText,
  4: Globe,
} as const;

async function triggerDownload(mediaId: number) {
  const blob = await downloadFile(mediaId);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `media-${mediaId}`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function MediaCard({ asset, listingId }: MediaCardProps) {
  const { isAdmin } = useAuth();
  const [downloading, setDownloading] = useState(false);

  const coverMutation = useMutation({
    mutationFn: () => setCoverImage(listingId, asset.id),
    onSuccess: () => {
      toast.success("Cover image set");
      queryClient.invalidateQueries({ queryKey: ["media", listingId] });
      queryClient.invalidateQueries({ queryKey: ["listing", listingId] });
    },
    onError: () => toast.error("Failed to set cover image"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteMedia(asset.id),
    onSuccess: () => {
      toast.success("Media deleted");
      queryClient.invalidateQueries({ queryKey: ["media", listingId] });
    },
    onError: () => toast.error("Failed to delete media"),
  });

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await triggerDownload(asset.id);
    } catch {
      toast.error("Failed to download file");
    } finally {
      setDownloading(false);
    }
  };

  const TypeIcon =
    asset.mediaType !== 1
      ? typeIcons[asset.mediaType as keyof typeof typeIcons]
      : null;

  return (
    <div className="relative group rounded-md overflow-hidden border bg-card">
      {/* Media preview */}
      {asset.mediaType === 1 ? (
        <img
          src={asset.mediaUrl}
          alt="media"
          className="w-full aspect-square object-cover"
        />
      ) : (
        <div className="w-full aspect-square flex items-center justify-center bg-muted">
          {TypeIcon && <TypeIcon className="w-10 h-10 text-muted-foreground" />}
        </div>
      )}

      {/* Hero badge */}
      {asset.isHero && (
        <Badge className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 hover:bg-yellow-400">
          Hero
        </Badge>
      )}

      {/* Action overlay — visible on hover */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end gap-1 p-2">
        {/* Download */}
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8"
          onClick={handleDownload}
          disabled={downloading}
        >
          <Download className="w-4 h-4" />
        </Button>

        {/* Admin only */}
        {isAdmin && (
          <>
            {/* Set cover */}
            <Button
              size="icon"
              variant={asset.isHero ? "default" : "secondary"}
              className="h-8 w-8"
              onClick={() => coverMutation.mutate()}
              disabled={coverMutation.isPending || asset.isHero}
            >
              <Star className="w-4 h-4" />
            </Button>

            {/* Delete */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="icon" variant="destructive" className="h-8 w-8">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete media?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteMutation.mutate()}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </div>
  );
}
