import { useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { listcaseStatusColor, listcaseStatusLabel } from "@/utils/enumMaps";
import type { ListingCase } from "@/types/models";

interface AdminTableRowProps {
  listing: ListingCase;
  index: number;
}

export default function AdminTableRow({ listing, index }: AdminTableRowProps) {
  const navigate = useNavigate();
  const address = `${listing.street}, ${listing.city} ${listing.state}`;
  const orderNumber = String(index).padStart(6, "0");
  const orderTime = new Date(listing.createdAt).toISOString().split("T")[0];
  // const isDelivered = listing.listcaseStatus === 4;

  return (
    <tr
      className="border-b hover:bg-slate-50 cursor-pointer transition-colors"
      onClick={() => navigate(`/listings/${listing.id}`)}
    >
      <td className="px-6 py-4 text-muted-foreground">{orderNumber}</td>
      <td className="px-6 py-4">—</td>
      <td className="px-6 py-4 max-w-xs truncate" title={address}>
        {address}
      </td>
      <td className="px-6 py-4 text-muted-foreground">{orderTime}</td>
      <td className="px-6 py-4">
        <Badge className={listcaseStatusColor[listing.listcaseStatus]}>
          {listcaseStatusLabel[listing.listcaseStatus]}
        </Badge>
      </td>
      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigate(`/listings/${listing.id}`)}
            >
              View details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
