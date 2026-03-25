import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useListings } from "@/features/listings/hooks/useListings";
import AdminTableRow from "./AdminTableRow";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { useAuth } from "@/hooks/useAuth";

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Hi, Welcome {user?.firstName} {user?.lastName}!
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your property orders
          </p>
        </div>
        <Button
          asChild
          className="bg-[#1DA1F2] hover:bg-[#1a91da] rounded-full px-5 shrink-0"
        >
          <Link to="/listings/new">
            <Plus className="w-4 h-4 mr-1.5" />
            Create Order
          </Link>
        </Button>
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

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50/80">
              <th className="text-left px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                Order
              </th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                Property Address
              </th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">
                Date
              </th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                Status
              </th>
              <th className="px-5 py-3 w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <td key={j} className="px-5 py-3.5">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                    <td className="px-5 py-3.5" />
                  </tr>
                ))
              : filtered.map((listing, i) => (
                  <AdminTableRow
                    key={listing.id}
                    listing={listing}
                    index={i + 1 + (page - 1) * 10}
                    onClick={() => navigate(`/listings/${listing.id}`)}
                  />
                ))}
          </tbody>
        </table>

        {!isLoading && filtered.length === 0 && (
          <EmptyState
            title={search ? "No results found" : "No orders yet"}
            description={
              search
                ? "Try a different search term."
                : "Create your first order to get started."
            }
          />
        )}
      </div>

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
                onClick={() => navigate(`/listings/${listing.id}`)}
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
