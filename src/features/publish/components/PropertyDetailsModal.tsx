import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ListingCase } from "@/types/models";

interface PropertyDetailsModalProps {
  listing: ListingCase;
  onSave: (data: Partial<ListingCase>) => void;
  onClose: () => void;
  isSaving?: boolean;
}

const saleCategories = [
  { value: 1, label: "For Sale" },
  { value: 2, label: "For Rent" },
  { value: 3, label: "Auction" },
];

const propertyTypes = [
  { value: 1, label: "House" },
  { value: 2, label: "Unit" },
  { value: 3, label: "Townhouse" },
  { value: 4, label: "Villa" },
  { value: 5, label: "Others" },
];

function Stepper({
  label,
  value,
  onChange,
  min = 0,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-6 text-center text-sm font-medium">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

export default function PropertyDetailsModal({
  listing,
  onSave,
  onClose,
  isSaving,
}: PropertyDetailsModalProps) {
  const [street, setStreet] = useState(listing.street);
  const [city, setCity] = useState(listing.city);
  const [state, setState] = useState(listing.state);
  const [postcode, setPostcode] = useState(String(listing.postcode));
  const [saleCategory, setSaleCategory] = useState(listing.saleCategory);
  const [propertyType, setPropertyType] = useState(listing.propertyType);
  const [bedrooms, setBedrooms] = useState(listing.bedrooms);
  const [bathrooms, setBathrooms] = useState(listing.bathrooms);
  const [garages, setGarages] = useState(listing.garages);
  const [floorArea, setFloorArea] = useState(String(listing.floorArea));

  const handleSave = () => {
    onSave({
      street,
      city,
      state,
      postcode: Number(postcode),
      saleCategory,
      propertyType,
      bedrooms,
      bathrooms,
      garages,
      floorArea: Number(floorArea),
    });
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
          <div>
            <h3 className="font-semibold text-sm">Property details</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Please take a moment to review and complete all property details.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Property Address */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Property Address</Label>
            <Input
              placeholder="Search address"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">City</Label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">State</Label>
                <Input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Postcode
                </Label>
                <Input
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="Postcode"
                  type="number"
                />
              </div>
            </div>
          </div>

          {/* Property Status */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Property Status</Label>
            <div className="flex gap-4 flex-wrap">
              {saleCategories.map((cat) => (
                <label
                  key={cat.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="saleCategory"
                    checked={saleCategory === cat.value}
                    onChange={() =>
                      setSaleCategory(cat.value as typeof saleCategory)
                    }
                    className="accent-primary"
                  />
                  <span className="text-sm">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Property Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Property Type</Label>
            <div className="flex gap-4 flex-wrap">
              {propertyTypes.map((type) => (
                <label
                  key={type.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={propertyType === type.value}
                    onChange={() =>
                      setPropertyType(type.value as typeof propertyType)
                    }
                    className="accent-primary"
                  />
                  <span className="text-sm">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Basic Information</Label>
            <div className="flex flex-wrap gap-6">
              <Stepper label="Bed" value={bedrooms} onChange={setBedrooms} />
              <Stepper label="Bath" value={bathrooms} onChange={setBathrooms} />
              <Stepper label="Car" value={garages} onChange={setGarages} />
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">Area</span>
                <div className="flex items-center gap-1">
                  <Input
                    value={floorArea}
                    onChange={(e) => setFloorArea(e.target.value)}
                    className="w-20 h-8 text-sm text-center"
                    type="number"
                    min={0}
                  />
                  <span className="text-xs text-muted-foreground">m²</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t sticky bottom-0 bg-white">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-[#1DA1F2] hover:bg-[#1a91da]"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
