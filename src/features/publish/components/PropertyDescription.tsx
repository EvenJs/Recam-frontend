import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyDescriptionProps {
  description?: string;
  onSave: (description: string) => void;
  isSaving?: boolean;
  readOnly?: boolean;
}

export default function PropertyDescription({
  description,
  onSave,
  isSaving,
  readOnly = false,
}: PropertyDescriptionProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(description ?? "");

  const handleSave = () => {
    onSave(value);
    setEditing(false);
  };

  const handleCancel = () => {
    setValue(description ?? "");
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="space-y-3">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={4}
          placeholder="Add property description here"
          className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            <X className="w-3 h-3 mr-1" />
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            <Check className="w-3 h-3 mr-1" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    );
  }
  if (readOnly) {
    return (
      <div className="text-center">
        {description ? (
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No description added yet.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2 text-center">
      {description ? (
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          {description}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          Please add property description here
        </p>
      )}
      <button
        onClick={() => setEditing(true)}
        className="flex items-center gap-1 text-xs text-primary hover:underline mx-auto"
      >
        <Pencil className="w-3 h-3" />
        {description ? "Edit description" : "Click to add"}
      </button>
    </div>
  );
}
