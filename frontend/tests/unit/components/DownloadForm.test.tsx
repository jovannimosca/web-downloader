// Import necessary libraries and components
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import DownloadForm from "@/components/DownloadForm";

describe("Download Form", () => {
  it("renders form with URL input and Download button", () => {
    // Render the DownloadForm component
    render(<DownloadForm />);

    // Check if the URL input field is present
    const urlInput = screen.getByLabelText(/url/i);
    expect(urlInput).toBeInTheDocument();

    // Check if the Download button is present
    const downloadButton = screen.getByText(/download/i);
    expect(downloadButton).toBeInTheDocument();
  });

  it("updates URL input when changed", async () => {
    // Render the DownloadForm component
    render(<DownloadForm />);

    // Get the URL input field
    const urlInput = screen.getByLabelText(/url/i);

    // Simulate user typing into the URL input
    fireEvent.change(urlInput, {
      target: { value: "https://example.com/file" },
    });

    // Check if the value of the URL input has been updated
    expect(urlInput).toHaveValue("https://example.com/file");
  });

  it("clears URL input when submitted", async () => {
    // Render the DownloadForm component
    render(<DownloadForm />);

    // Get the URL input field
    const urlInput = screen.getByLabelText(/url/i);

    // Simulate user typing into the URL input
    fireEvent.change(urlInput, {
      target: { value: "https://example.com/file" },
    });

    // Check if the value of the URL input has been updated
    expect(urlInput).toHaveValue("https://example.com/file");

    // Simulate form submission
    const downloadButton = screen.getByText(/download/i);
    fireEvent.click(downloadButton);

    // Wait for react-hook-form to process the submission
    expect(await screen.findByLabelText(/url/i)).toHaveValue("");
  });
});
