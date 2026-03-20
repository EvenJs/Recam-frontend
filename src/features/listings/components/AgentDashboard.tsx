import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useListings } from "@/features/listings/hooks/useListings";
import ListingCard from "./ListingCard";
import StatusFilterTabs from "./StatusFilterTabs";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { useAuth } from "@/hooks/useAuth";
import type { ListcaseStatus } from "@/types/enums";

export default function AgentDashboard() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ListcaseStatus | undefined>(undefined);
  const { user } = useAuth();

  const { listings, totalPages, isLoading, isError, refetch } = useListings({
    page,
    pageSize: 10,
    status,
  });

  const handleStatusChange = (newStatus: ListcaseStatus | undefined) => {
    setStatus(newStatus);
    setPage(1);
  };

  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-muted-foreground text-sm">Hi, {user?.email}</p>
        <h1 className="text-2xl font-bold mt-1">My Order</h1>
      </div>

      {/* Filters */}
      <StatusFilterTabs
        activeStatus={status}
        onStatusChange={handleStatusChange}
      />

      {/* Cards */}
      <div className="space-y-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-36 w-full rounded-lg" />
            ))
          : listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
      </div>

      {!isLoading && listings.length === 0 && (
        <EmptyState
          title="No orders yet"
          description="No listings have been assigned to you yet."
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
