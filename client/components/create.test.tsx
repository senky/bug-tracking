// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  cleanup,
} from "@testing-library/react";
import { Create } from "./create";

const originalFetch = global.fetch;

describe("Create", () => {
  afterEach(() => {
    cleanup();
    global.fetch = originalFetch;
  });

  it("should create issue with all data provided", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 201,
    });

    render(<Create />);

    const parentId =
      screen.getByLabelText<HTMLInputElement>("Parent issue ID:");
    const description = screen.getByLabelText<HTMLInputElement>("Description:");
    const link = screen.getByLabelText<HTMLInputElement>("Link:");
    const submitButton = screen.getByText("Create new bug report");
    await act(async () => {
      fireEvent.change(parentId, { target: { value: "1" } });
      fireEvent.change(description, { target: { value: "desc" } });
      fireEvent.change(link, { target: { value: "http://bug.com" } });
      fireEvent.click(submitButton);
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/create", {
      body: '{"parentId":"1","description":"desc","link":"http://bug.com"}',
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    expect(parentId.value).toEqual("");
    expect(description.value).toEqual("");
    expect(link.value).toEqual("");
  });

  it("should create issue without parent ID", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 201,
    });

    render(<Create />);

    const description = screen.getByLabelText<HTMLInputElement>("Description:");
    const link = screen.getByLabelText<HTMLInputElement>("Link:");
    const submitButton = screen.getByText("Create new bug report");
    await act(async () => {
      fireEvent.change(description, { target: { value: "desc" } });
      fireEvent.change(link, { target: { value: "http://bug.com" } });
      fireEvent.click(submitButton);
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/create", {
      body: '{"description":"desc","link":"http://bug.com"}',
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    expect(description.value).toEqual("");
    expect(link.value).toEqual("");
  });

  it("should fail when parent issue does not exist", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 409,
    });

    render(<Create />);

    const parentId =
      screen.getByLabelText<HTMLInputElement>("Parent issue ID:");
    const description = screen.getByLabelText<HTMLInputElement>("Description:");
    const link = screen.getByLabelText<HTMLInputElement>("Link:");
    const submitButton = screen.getByText("Create new bug report");
    await act(async () => {
      fireEvent.change(parentId, { target: { value: "1" } });
      fireEvent.change(description, { target: { value: "desc" } });
      fireEvent.change(link, { target: { value: "http://bug.com" } });
      fireEvent.click(submitButton);
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/create", {
      body: '{"parentId":"1","description":"desc","link":"http://bug.com"}',
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    expect(screen.findByText("The parent issue does not exist."));
  });

  it("should show unexpected error message", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<Create />);

    const description = screen.getByLabelText<HTMLInputElement>("Description:");
    const link = screen.getByLabelText<HTMLInputElement>("Link:");
    const submitButton = screen.getByText("Create new bug report");
    await act(async () => {
      fireEvent.change(description, { target: { value: "desc" } });
      fireEvent.change(link, { target: { value: "http://bug.com" } });
      fireEvent.click(submitButton);
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/create", {
      body: '{"description":"desc","link":"http://bug.com"}',
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    expect(screen.findByText("An unknown error occurred. Try again."));
  });
});
