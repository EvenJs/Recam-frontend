import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ListingCard from "@/features/listings/components/ListingCard";
import type { ListingCase } from "@/types/models";
import { useAuth } from "@/hooks/useAuth";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(() => ({
    isAgent: false,
    isAdmin: true,
    user: null,
    role: null,
    isAuthenticated: false,
    logout: vi.fn(),
  })),
}));

beforeEach(() => {
  mockNavigate.mockClear();
  vi.mocked(useAuth).mockReturnValue({
    isAgent: false,
    isAdmin: true,
    user: null,
    role: "PhotographyCompany",
    isAuthenticated: true,
    logout: vi.fn(),
  });
});

const mockListing: ListingCase = {
  id: 1,
  title: "Modern Family Home",
  street: "123 Main St",
  city: "Melbourne",
  state: "VIC",
  postcode: 3000,
  price: 850000,
  bedrooms: 4,
  bathrooms: 2,
  garages: 2,
  floorArea: 320,
  propertyType: 1,
  saleCategory: 1,
  listcaseStatus: 1,
  createdAt: "2026-03-20T00:00:00Z",
  mediaTypes: [],
};

const renderCard = (listing = mockListing, index = 1) =>
  render(
    <MemoryRouter>
      <ListingCard listing={listing} index={index} />
    </MemoryRouter>,
  );

describe("ListingCard", () => {
  it("renders the address", () => {
    renderCard();
    expect(screen.getByText(/123 Main St/)).toBeInTheDocument();
  });

  it("renders the status badge", () => {
    renderCard();
    expect(screen.getByText("Created")).toBeInTheDocument();
  });

  it("renders formatted price", () => {
    renderCard();
    expect(screen.getByText(/850,000/)).toBeInTheDocument();
  });

  it("navigates to listing detail on click", () => {
    renderCard();
    fireEvent.click(screen.getByText("View order details »"));
    expect(mockNavigate).toHaveBeenCalledWith("/listings/1");
  });

  it("navigates to preview page for agent role", () => {
    vi.mocked(useAuth).mockImplementation(() => ({
      isAgent: true,
      isAdmin: false,
      user: null,
      role: "Agent",
      isAuthenticated: true,
      logout: vi.fn(),
    }));

    renderCard();
    fireEvent.click(screen.getByText("View order details »"));
    expect(mockNavigate).toHaveBeenCalledWith("/listings/1/preview");

    // Reset back to admin after test
    vi.mocked(useAuth).mockImplementation(() => ({
      isAgent: false,
      isAdmin: true,
      user: null,
      role: "PhotographyCompany",
      isAuthenticated: true,
      logout: vi.fn(),
    }));
  });

  it("does not show Website button for non-delivered listing", () => {
    renderCard();
    expect(screen.queryByText("Website")).not.toBeInTheDocument();
  });

  it("shows Website button for delivered listing", () => {
    renderCard({ ...mockListing, listcaseStatus: 4 });
    expect(screen.getByText("Website")).toBeInTheDocument();
  });

  it("renders created date", () => {
    renderCard();
    const dateElement = screen.getByText((content) => content.includes("2026"));
    expect(dateElement).toBeInTheDocument();
  });
});
