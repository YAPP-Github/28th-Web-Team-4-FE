import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/vitest";

afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});

afterAll(() => {
  vi.resetAllMocks();
});
