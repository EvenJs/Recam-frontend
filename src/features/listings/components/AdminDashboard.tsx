import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useListings } from "@/features/listings/hooks/useListings";
import AdminTableRow from "./AdminTableRow";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { useAuth } from "@/hooks/useAuth";
import { listcaseStatusLabel } from "@/utils/enumMaps";

export default function AdminDashboard() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const { listings, totalPages, isLoading, isError, refetch } = useListings({
    page,
    pageSize: 10,
  });

  const filtered = search.trim()
    ? listings.filter(
        (l) =>
          l.title.toLowerCase().includes(search.toLowerCase()) ||
          `${l.street} ${l.city} ${l.state}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      )
    : listings;

  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <>
      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))
          : filtered.map((listing, i) => (
              <div
                key={listing.id}
                className="bg-white border rounded-lg px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => navigate(`/listings/${listing.id}`)}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-xs text-muted-foreground">
                    #{String(i + 1 + (page - 1) * 10).padStart(6, "0")}
                  </span>
                  <Badge
                    className={
                      listing.listcaseStatus === 4
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                    }
                  >
                    {listcaseStatusLabel[listing.listcaseStatus]}
                  </Badge>
                </div>
                <p className="text-sm font-medium truncate">
                  {listing.street}, {listing.city} {listing.state}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(listing.createdAt).toISOString().split("T")[0]}
                </p>
              </div>
            ))}
      </div>
      {/* Desktop table */}
      <div className="hidden md:block rounded-lg border bg-white overflow-hidden">
        {/* Welcome */}
        <h1 className="text-3xl font-bold text-center">
          Hi, Welcome {user?.email?.split("@")[0]}!
        </h1>

        {/* Search + Create */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search from order list"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <Button
            asChild
            className="bg-[#1DA1F2] hover:bg-[#1a91da] rounded-full px-6"
          >
            <Link to="/listings/new">+ Create Order</Link>
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">
                  Order Number
                </th>
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">
                  Client Name
                </th>
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">
                  Property Address
                </th>
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">
                  Order Time
                </th>
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
                      <td className="px-6 py-4" />
                    </tr>
                  ))
                : filtered.map((listing, i) => (
                    <AdminTableRow
                      key={listing.id}
                      listing={listing}
                      index={i + 1 + (page - 1) * 10}
                    />
                  ))}
            </tbody>
          </table>

          {!isLoading && filtered.length === 0 && (
            <EmptyState title="No orders found" />
          )}
        </div>

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
    </>
  );
}
