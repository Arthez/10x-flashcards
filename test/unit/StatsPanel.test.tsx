import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import { createRef } from "react";
import StatsPanel from "../../src/components/browse/StatsPanel";
import type { StatsPanelRef } from "../../src/components/browse/StatsPanel";

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("StatsPanel", () => {
  const mockStatsData = {
    manual_count: 10,
    ai_full_count: 20,
    ai_edited_count: 10,
    total_generated: 50,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Data Fetching", () => {
    it("should fetch and display stats data successfully", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStatsData),
      });

      // Act
      render(<StatsPanel />);

      // Assert
      // Check loading state
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText("AI unedited")).toBeInTheDocument();
      });

      // Verify stats display
      expect(screen.getByText("20")).toBeInTheDocument(); // ai_full_count
      expect(screen.getByText("10")).toBeInTheDocument(); // manual_count
      expect(mockFetch).toHaveBeenCalledWith("/api/stats");
    });

    it("should handle API error gracefully", async () => {
      // Arrange
      const errorMessage = "Failed to fetch statistics";
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: { message: errorMessage } }),
      });

      // Act
      render(<StatsPanel />);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
      expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
    });

    it("should handle network error gracefully", async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      // Act
      render(<StatsPanel />);

      // Assert
      await waitFor(() => {
        expect(screen.getByText("Network error")).toBeInTheDocument();
      });
    });
  });

  describe("Data Calculations", () => {
    it("should calculate percentages correctly", async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStatsData),
      });

      // Act
      render(<StatsPanel />);

      // Assert
      await waitFor(() => {
        // Find elements by their associated labels first
        const aiEditedSection = screen.getByText("AI edited").closest("div");
        const manualSection = screen.getByText("Manual").closest("div");
        const aiUnEditedSection = screen.getByText("AI unedited").closest("div");

        // Then check their percentage values
        expect(aiEditedSection).toHaveTextContent("25%");
        expect(manualSection).toHaveTextContent("25%");
        expect(aiUnEditedSection).toHaveTextContent("50%");
      });
    });

    it("should handle zero totals gracefully", async () => {
      // Arrange
      const zeroData = {
        manual_count: 0,
        ai_full_count: 0,
        ai_edited_count: 0,
        total_generated: 0,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(zeroData),
      });

      // Act
      render(<StatsPanel />);

      // Assert
      await waitFor(() => {
        const percentages = screen.getAllByText("0%");
        expect(percentages).toHaveLength(4);
      });
    });
  });

  describe("Component API", () => {
    it("should expose refresh method via ref", async () => {
      // Arrange
      const ref = createRef<StatsPanelRef>();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStatsData),
      });

      // Act
      render(<StatsPanel ref={ref} />);

      await waitFor(() => {
        expect(screen.getByText("AI unedited")).toBeInTheDocument();
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            ...mockStatsData,
            manual_count: 15, // Changed value
          }),
      });

      // Use act for state updates
      await act(async () => {
        ref.current?.refresh();
      });

      // Assert
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(screen.getByText("15")).toBeInTheDocument();
      });
    });

    it("should retry fetching data when clicking try again button", async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error("Network error")).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStatsData),
      });

      // Act
      render(<StatsPanel />);

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByText("Network error")).toBeInTheDocument();
      });

      // Click retry button using act
      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Try again" }));
      });

      // Assert
      await waitFor(() => {
        expect(screen.getByText("AI unedited")).toBeInTheDocument();
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });
    });
  });
});
