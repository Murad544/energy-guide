import { expect, it } from "vitest";
import { formatNumberAz } from "./utils";

it("uses consistent Azerbaijani separators and rounding", () => {
  expect(formatNumberAz(1234.56, 2)).toBe("1.234,56");
  expect(formatNumberAz(3.24, 2)).toBe("3,24");
  expect(formatNumberAz(3.24)).toBe("3,2");
  expect(formatNumberAz(0)).toBe("0");
});
