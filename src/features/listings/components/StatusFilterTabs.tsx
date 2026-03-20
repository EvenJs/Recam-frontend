import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { listcaseStatusLabel } from "@/utils/enumMaps";
import { ListcaseStatus } from "@/types/enums";

interface StatusFilterTabsProps {
  activeStatus: ListcaseStatus | undefined;
  onStatusChange: (status: ListcaseStatus | undefined) => void;
}

const tabs: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "1", label: listcaseStatusLabel[ListcaseStatus.Created] },
  { value: "2", label: listcaseStatusLabel[ListcaseStatus.Pending] },
  { value: "3", label: listcaseStatusLabel[ListcaseStatus.InReview] },
  { value: "4", label: listcaseStatusLabel[ListcaseStatus.Delivered] },
];

export default function StatusFilterTabs({
  activeStatus,
  onStatusChange,
}: StatusFilterTabsProps) {
  const value = activeStatus?.toString() ?? "all";

  return (
    <Tabs
      value={value}
      onValueChange={(v) =>
        onStatusChange(v === "all" ? undefined : (Number(v) as ListcaseStatus))
      }
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
