// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";
import { Close } from "./close";
import {
  act,
  fireEvent,
  render,
  screen,
  cleanup,
} from "@testing-library/react";

const originalFetch = global.fetch;

describe("Close", () => {
  afterEach(() => {
    cleanup();
    global.fetch = originalFetch;
  });

  it("should close issue with correct ID", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
    });

    render(<Close />);

    const input = screen.getByLabelText<HTMLInputElement>("Issue ID:");
    const submitButton = screen.getByText("Close bug report");
    await act(async () => {
      fireEvent.change(input, { target: { value: "1" } });
      fireEvent.click(submitButton);
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/close", {
      body: '{"id":"1"}',
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
    });
    expect(input.value).toEqual("");
  });

  it("should inform user if issue ID is missing", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 400,
    });

    render(<Close />);

    const submitButton = screen.getByText("Close bug report");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(screen.findByText("You must provide an issue ID."));
  });

  it("should inform user if issue ID is not existing", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 410,
    });

    render(<Close />);

    const input = screen.getByLabelText<HTMLInputElement>("Issue ID:");
    const submitButton = screen.getByText("Close bug report");
    await act(async () => {
      fireEvent.change(input, { target: { value: "1" } });
      fireEvent.click(submitButton);
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/close", {
      body: '{"id":"1"}',
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
    });
    expect(screen.findByText("The issue does not exist."));
  });

  it("should inform user if unexpected error happened", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<Close />);

    const input = screen.getByLabelText<HTMLInputElement>("Issue ID:");
    const submitButton = screen.getByText("Close bug report");
    await act(async () => {
      fireEvent.change(input, { target: { value: "1" } });
      fireEvent.click(submitButton);
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/close", {
      body: '{"id":"1"}',
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
    });
    expect(screen.findByText("An unknown error occurred. Try again."));
  });
});
