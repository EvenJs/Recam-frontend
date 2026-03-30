import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useListings } from "@/features/listings/hooks/useListings";
import * as listingsApi from "@/api/listing.api";
import type { ListingCase } from "@/types/models";

vi.mock("@/api/listing.api");

const mockListing: ListingCase = {
  id: 1,
  title: "Test Listing",
  street: "123 Main St",
  city: "Melbourne",
  state: "VIC",
  postcode: 3000,
  price: 500000,
  bedrooms: 3,
  bathrooms: 2,
  garages: 1,
  floorArea: 200,
  propertyType: 1,
  saleCategory: 1,
  listcaseStatus: 1,
  createdAt: "2026-03-20T00:00:00Z",
  mediaTypes: [],
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
  );
};

describe("useListings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns listings on success", async () => {
    vi.mocked(listingsApi.getListings).mockResolvedValue({
      items: [mockListing],
      page: 1,
      pageSize: 10,
      totalCount: 1,
      totalPages: 1,
    });

    const { result } = renderHook(
      () => useListings({ page: 1, pageSize: 10 }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.listings).toHaveLength(1);
    expect(result.current.listings[0].title).toBe("Test Listing");
    expect(result.current.totalCount).toBe(1);
    expect(result.current.totalPages).toBe(1);
  });

  it("returns empty array on error", async () => {
    vi.mocked(listingsApi.getListings).mockRejectedValue(
      new Error("Network error"),
    );

    const { result } = renderHook(
      () => useListings({ page: 1, pageSize: 10 }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isError).toBe(true);
    expect(result.current.listings).toHaveLength(0);
  });

  it("passes status filter to API", async () => {
    vi.mocked(listingsApi.getListings).mockResolvedValue({
      items: [],
      page: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
    });

    const { result } = renderHook(
      () => useListings({ page: 1, pageSize: 10, status: 2 }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(listingsApi.getListings).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      status: 2,
    });
  });

  it("returns correct totalPages", async () => {
    vi.mocked(listingsApi.getListings).mockResolvedValue({
      items: Array(10).fill(mockListing),
      page: 1,
      pageSize: 10,
      totalCount: 25,
      totalPages: 3,
    });

    const { result } = renderHook(
      () => useListings({ page: 1, pageSize: 10 }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.totalPages).toBe(3);
    expect(result.current.totalCount).toBe(25);
  });
});
