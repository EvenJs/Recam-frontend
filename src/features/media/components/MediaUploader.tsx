import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadMedia } from "@/api/media.api";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

interface MediaUploaderProps {
  listingId: number;
}

const mediaTypeOptions = [
  { value: "1", label: "Photography" },
  { value: "2", label: "Videography" },
  { value: "3", label: "Floor Plan" },
  { value: "4", label: "VR Tour" },
];

const acceptByType: Record<string, string> = {
  "1": ".jpg,.jpeg,.png", // Picture
  "2": ".mp4,.mov", // Video
  "3": ".pdf", // FloorPlan
  "4": ".gltf", // VRTour
};

const acceptLabels: Record<string, string> = {
  "1": "JPG, JPEG, PNG",
  "2": "MP4, MOV",
  "3": "PDF only",
  "4": "GLTF only",
};

export default function MediaUploader({ listingId }: MediaUploaderProps) {
  const { isAdmin } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [mediaType, setMediaType] = useState<string>("1");

  const mutation = useMutation({
    mutationFn: (formData: FormData) =>
      uploadMedia(listingId, formData, (pct) => setProgress(pct)),
    onSuccess: () => {
      toast.success("Media uploaded");
      setFiles([]);
      setProgress(0);
      queryClient.invalidateQueries({ queryKey: ["media", listingId] });
    },
    onError: () => {
      toast.error("Failed to upload media");
      setProgress(0);
    },
  });

  if (!isAdmin) return null;

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    setFiles(Array.from(incoming));
  };

  const handleUpload = () => {
    if (files.length === 0) return;
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    formData.append("mediaType", mediaType);
    mutation.mutate(formData);
  };

  return (
    <div className="space-y-3 flex-1">
      {/* Media type selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground shrink-0">
          Upload as:
        </span>
        <Select value={mediaType} onValueChange={setMediaType}>
          <SelectTrigger className="w-40 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {mediaTypeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Drop zone */}
      <div
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Drag and drop files here or{" "}
          <span className="text-primary underline">browse</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Accepted: {acceptLabels[mediaType]}
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple={mediaType === "1"} // only Pictures allow multiple
        accept={acceptByType[mediaType]}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {/* Selected files */}
      {files.length > 1 && mediaType !== "1" && (
        <p className="text-xs text-destructive">
          Only one file allowed for this media type.
        </p>
      )}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            {files.length} file{files.length > 1 ? "s" : ""} selected
          </div>
          {files.map((f, i) => (
            <div key={i} className="text-xs truncate text-muted-foreground">
              {f.name} ({(f.size / 1024).toFixed(1)} KB)
            </div>
          ))}

          {/* Progress bar */}
          {mutation.isPending && (
            <div className="w-full bg-muted rounded-full h-1">
              <div
                className="h-1 bg-primary rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={
              mutation.isPending || (files.length > 1 && mediaType !== "1")
            }
            className="text-sm text-primary underline disabled:opacity-50"
          >
            {mutation.isPending ? `Uploading... ${progress}%` : "Upload files"}
          </button>
        </div>
      )}
    </div>
  );
}
