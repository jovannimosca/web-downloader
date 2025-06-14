import * as matchers from "@testing-library/jest-dom/matchers";
import "@testing-library/jest-dom";
import { expect, beforeAll, afterEach, afterAll } from "vitest";
import { server } from "../src/mocks/node";

expect.extend(matchers);

// Enable API mocking with MSW
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
