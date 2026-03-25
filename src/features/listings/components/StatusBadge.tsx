import { listcaseStatusLabel, listcaseStatusColor } from "@/utils/enumMaps";
import type { ListcaseStatus } from "@/types/enums";

interface StatusBadgeProps {
  status: ListcaseStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full font-medium ${listcaseStatusColor[status]}`}
    >
      {listcaseStatusLabel[status]}
    </span>
  );
}
