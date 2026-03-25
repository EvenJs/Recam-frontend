import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { listcaseStatusLabel, listcaseStatusColor } from "@/utils/enumMaps";
import type { ListingCase } from "@/types/models";

interface AdminTableRowProps {
  listing: ListingCase;
  index: number;
  onClick: () => void;
}

export default function AdminTableRow({
  listing,
  index,
  onClick,
}: AdminTableRowProps) {
  const address = `${listing.street}, ${listing.city} ${listing.state}`;
  const orderNumber = String(index).padStart(6, "0");
  const orderTime = new Date(listing.createdAt).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <tr
      className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
      onClick={onClick}
    >
      {/* Order number */}
      <td className="px-5 py-3.5">
        <span className="font-mono text-xs text-muted-foreground">
          #{orderNumber}
        </span>
      </td>

      {/* Address */}
      <td className="px-5 py-3.5">
        <div className="space-y-0.5">
          <p className="font-medium text-sm truncate max-w-xs" title={address}>
            {address}
          </p>
          <p className="text-xs text-muted-foreground">{listing.title}</p>
        </div>
      </td>

      {/* Date */}
      <td className="px-5 py-3.5 hidden md:table-cell">
        <span className="text-xs text-muted-foreground">{orderTime}</span>
      </td>

      {/* Status */}
      <td className="px-5 py-3.5">
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${listcaseStatusColor[listing.listcaseStatus]}`}
        >
          {listcaseStatusLabel[listing.listcaseStatus]}
        </span>
      </td>

      {/* Actions */}
      <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onClick}>View details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
