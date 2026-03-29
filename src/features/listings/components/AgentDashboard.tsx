import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useListings } from "@/features/listings/hooks/useListings";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { useAuth } from "@/hooks/useAuth";
import ListingCard from "./ListingCard";

export default function AgentDashboard() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const { listings, totalPages, isLoading, isError, refetch } = useListings({
    page,
    pageSize: 10,
  });

  const filtered = search.trim()
    ? listings.filter((l, i) => {
        const orderNumber = String(i + 1 + (page - 1) * 10).padStart(6, "0");
        const address = `${l.street} ${l.city} ${l.state}`.toLowerCase();
        const term = search.toLowerCase();
        return (
          l.title.toLowerCase().includes(term) ||
          address.includes(term) ||
          orderNumber.includes(term)
        );
      })
    : listings;

  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">
          Hi, {user?.firstName} {user?.lastName}
        </p>
        <h1 className="text-2xl font-bold mt-1">My Order</h1>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by order, address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-full border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]/30 transition"
        />
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-36 w-full rounded-xl" />
            ))
          : filtered.map((listing, i) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                index={i + 1 + (page - 1) * 10}
              />
            ))}
      </div>

      {!isLoading && filtered.length === 0 && (
        <EmptyState
          title="No orders yet"
          description="No listings have been assigned to you yet."
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="rounded-full"
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
            className="rounded-full"
          >
            Next
          </Button>
        </div>
      )}

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))
          : filtered.map((listing, i) => (
              <div
                key={listing.id}
                className="bg-white border rounded-xl px-4 py-3 cursor-pointer hover:shadow-sm transition-shadow"
                onClick={() => navigate(`/listings/${listing.id}/preview`)}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-xs text-muted-foreground font-mono">
                    #{String(i + 1 + (page - 1) * 10).padStart(6, "0")}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      listing.listcaseStatus === 4
                        ? "bg-green-100 text-green-700"
                        : listing.listcaseStatus === 3
                          ? "bg-purple-100 text-purple-700"
                          : listing.listcaseStatus === 2
                            ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {listing.listcaseStatus === 4
                      ? "Delivered"
                      : listing.listcaseStatus === 3
                        ? "In Review"
                        : listing.listcaseStatus === 2
                          ? "Pending"
                          : "Created"}
                  </span>
                </div>
                <p className="text-sm font-medium truncate">
                  {listing.street}, {listing.city} {listing.state}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(listing.createdAt).toLocaleDateString("en-AU")}
                </p>
              </div>
            ))}
      </div>
    </div>
  );
}
