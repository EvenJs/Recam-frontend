import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { uploadMedia } from "@/api/media.api";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

interface MediaUploaderProps {
  listingId: number;
}

export default function MediaUploader({ listingId }: MediaUploaderProps) {
  const { isAdmin } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);

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
    mutation.mutate(formData);
  };

  return (
    <div className="space-y-3 flex-1">
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
          Images, videos, PDFs
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*,.pdf"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Selected files */}
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
            disabled={mutation.isPending}
            className="text-sm text-primary underline disabled:opacity-50"
          >
            {mutation.isPending ? `Uploading... ${progress}%` : "Upload files"}
          </button>
        </div>
      )}
    </div>
  );
}
