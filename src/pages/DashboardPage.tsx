import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useListings } from "@/features/listings/hooks/useListings";
import ListingCard from "@/features/listings/components/ListingCard";
import StatusFilterTabs from "@/features/listings/components/StatusFilterTabs";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { useAuth } from "@/hooks/useAuth";
import type { ListcaseStatus } from "@/types/enums";

export default function DashboardPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ListcaseStatus | undefined>(undefined);
  const { isAdmin } = useAuth();

  const { listings, totalPages, isLoading, isError, refetch } = useListings({
    page,
    pageSize: 10,
    status,
  });

  const handleStatusChange = (newStatus: ListcaseStatus | undefined) => {
    setStatus(newStatus);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Listings</h1>
        {isAdmin && (
          <Button asChild>
            <Link to="/listings/new">New Listing</Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <StatusFilterTabs
        activeStatus={status}
        onStatusChange={handleStatusChange}
      />

      {/* Content */}
      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-lg" />
                ))
              : listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
          </div>

          {!isLoading && listings.length === 0 && (
            <EmptyState
              title="No listings yet"
              description={
                isAdmin
                  ? "Create your first listing to get started."
                  : "No listings have been assigned to you yet."
              }
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
        </>
      )}
    </div>
  );
}
