import { Badge } from "@/components/ui/badge";
import { listcaseStatusLabel, listcaseStatusColor } from "@/utils/enumMaps";
import type { ListcaseStatus } from "@/types/enums";

interface StatusBadgeProps {
  status: ListcaseStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={listcaseStatusColor[status]}>
      {listcaseStatusLabel[status]}
    </Badge>
  );
}
