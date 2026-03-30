import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusBadge from "@/features/listings/components/StatusBadge";

describe("StatusBadge", () => {
  it("renders Created label", () => {
    render(<StatusBadge status={1} />);
    expect(screen.getByText("Created")).toBeInTheDocument();
  });

  it("renders Pending label", () => {
    render(<StatusBadge status={2} />);
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("renders In Review label", () => {
    render(<StatusBadge status={3} />);
    expect(screen.getByText("In Review")).toBeInTheDocument();
  });

  it("renders Delivered label", () => {
    render(<StatusBadge status={4} />);
    expect(screen.getByText("Delivered")).toBeInTheDocument();
  });

  it("applies orange color for Created", () => {
    const { container } = render(<StatusBadge status={1} />);
    expect(container.firstChild).toHaveClass("bg-orange-100");
  });

  it("applies blue color for Pending", () => {
    const { container } = render(<StatusBadge status={2} />);
    expect(container.firstChild).toHaveClass("bg-blue-100");
  });

  it("applies purple color for In Review", () => {
    const { container } = render(<StatusBadge status={3} />);
    expect(container.firstChild).toHaveClass("bg-purple-100");
  });

  it("applies green color for Delivered", () => {
    const { container } = render(<StatusBadge status={4} />);
    expect(container.firstChild).toHaveClass("bg-green-100");
  });
});
