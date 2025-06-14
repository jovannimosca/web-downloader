// Import necessary libraries and components
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import StatusTable from "@/components/StatusTable";

describe("Status Table", () => {
  it("renders table with data", () => {
    // Render the StatusTable component
    render(<StatusTable />);

    // Check if the table headers are present
    expect(screen.getByText(/timestamp/i)).toBeInTheDocument();
    expect(screen.getByText(/filename/i)).toBeInTheDocument();
    expect(screen.getByText(/status/i)).toBeInTheDocument();

    // Check if the table rows are present
    // expect(screen.getByText('File 1')).toBeInTheDocument();
    // expect(screen.getByText('Completed')).toBeInTheDocument();
    // expect(screen.getByText('File 2')).toBeInTheDocument();
    // expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  // it('does not render data when empty', () => {
  //   // Render the StatusTable component with empty data
  //   render(<StatusTable />);

  //   // Check if no rows are present
  //   const tableRows = screen.queryAllByRole('row');
  //   expect(tableRows.length).toBe(0);
  // });
});
