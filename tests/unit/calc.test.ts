import { describe, expect, it } from "vitest";
import { estimateCosts } from "@/lib/calc";

describe("estimateCosts", () => {
  it("itemises a cash purchase above the trustee threshold", () => {
    const r = estimateCosts({ price: 2_000_000, financing: "cash" });
    const by = Object.fromEntries(r.lines.map((l) => [l.id, l.amount]));
    expect(by.dld).toBe(80_000);
    expect(by.deed).toBe(580);
    expect(by.ki).toBe(20);
    expect(by.trustee).toBe(4_200);
    expect(by.agency).toBe(42_000);
    expect(by.mreg).toBeUndefined();
    expect(r.totalFees).toBe(80_000 + 580 + 20 + 4_200 + 42_000);
    expect(r.cashRequired).toBe(2_000_000 + r.totalFees);
    expect(r.meetsGoldenVisaThreshold).toBe(true);
  });

  it("uses the lower trustee fee below AED 500,000", () => {
    const r = estimateCosts({ price: 450_000, financing: "cash" });
    expect(r.lines.find((l) => l.id === "trustee")!.amount).toBe(2_100);
    expect(r.meetsGoldenVisaThreshold).toBe(false);
  });

  it("adds mortgage costs and caps loan-to-value at 80%", () => {
    const r = estimateCosts({ price: 1_000_000, financing: "mortgage", ltvPercent: 95 });
    expect(r.loanAmount).toBe(800_000);
    const by = Object.fromEntries(r.lines.map((l) => [l.id, l.amount]));
    expect(by.mreg).toBe(800_000 * 0.0025 + 290);
    expect(by.arr).toBe(8_400);
    expect(by.val).toBe(3_150);
    expect(r.cashRequired).toBe(1_000_000 - 800_000 + r.totalFees);
  });

  it("separates official fees from estimates", () => {
    const r = estimateCosts({ price: 3_000_000, financing: "mortgage", ltvPercent: 50 });
    expect(r.lines.filter((l) => l.kind === "regulated").map((l) => l.id)).toEqual(["dld", "deed", "ki", "trustee", "mreg"]);
    expect(r.lines.filter((l) => l.kind === "commercial").map((l) => l.id)).toEqual(["agency", "arr", "val"]);
  });
});
