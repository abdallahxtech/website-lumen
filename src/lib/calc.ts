import { feeConfig } from "@/content/fees";

export type FeeKind = "regulated" | "commercial";

export interface FeeLine {
  id: string;
  label: string;
  basis: string;
  amount: number;
  kind: FeeKind;
}

export interface CostInput {
  price: number;
  financing: "cash" | "mortgage";
  ltvPercent?: number;
  includeAgency?: boolean;
}

export interface CostResult {
  lines: FeeLine[];
  totalFees: number;
  loanAmount: number;
  cashRequired: number; // deposit + fees
  meetsGoldenVisaThreshold: boolean;
}

const round = (n: number) => Math.round(n);

/** Pure, deterministic cost breakdown for a ready (secondary market) purchase. */
export function estimateCosts(input: CostInput, cfg = feeConfig): CostResult {
  const price = Math.max(0, input.price);
  const vat = 1 + cfg.vatRate;
  const isMortgage = input.financing === "mortgage";
  const ltv = Math.min(Math.max(input.ltvPercent ?? 0, 0), cfg.mortgage.maxLtvPercent) / 100;
  const loan = isMortgage ? price * ltv : 0;
  const trustee = price >= cfg.trustee.threshold ? cfg.trustee.atOrAbove : cfg.trustee.below;

  const lines: FeeLine[] = [
    { id: "dld", label: "DLD transfer fee", basis: "4% of the purchase price", amount: round(price * cfg.dldTransferRate), kind: "regulated" },
    { id: "deed", label: "Title deed issuance", basis: "Dubai Land Department", amount: cfg.titleDeedFee, kind: "regulated" },
    { id: "ki", label: "Knowledge and innovation fees", basis: "Dubai Land Department", amount: cfg.knowledgeInnovationFees, kind: "regulated" },
    {
      id: "trustee",
      label: "Registration trustee fee",
      basis: `AED ${trustee.toLocaleString("en-US")} + 5% VAT`,
      amount: round(trustee * vat),
      kind: "regulated",
    },
  ];

  if (input.includeAgency !== false) {
    lines.push({ id: "agency", label: "Agency commission", basis: "2% + 5% VAT (market convention)", amount: round(price * cfg.agencyRate * vat), kind: "commercial" });
  }

  if (isMortgage && loan > 0) {
    lines.push(
      { id: "mreg", label: "Mortgage registration", basis: "0.25% of loan + AED 290", amount: round(loan * cfg.mortgage.registrationRate + cfg.mortgage.registrationAdmin), kind: "regulated" },
      { id: "arr", label: "Bank arrangement fee", basis: "Up to 1% of loan + VAT (varies by lender)", amount: round(loan * cfg.mortgage.arrangementRate * vat), kind: "commercial" },
      { id: "val", label: "Bank valuation", basis: "Typical fee + VAT (varies by lender)", amount: round(cfg.mortgage.valuationFee * vat), kind: "commercial" },
    );
  }

  const totalFees = lines.reduce((s, l) => s + l.amount, 0);
  return {
    lines,
    totalFees,
    loanAmount: round(loan),
    cashRequired: round(price - loan + totalFees),
    meetsGoldenVisaThreshold: price >= cfg.goldenVisaThreshold,
  };
}

export const formatAed = (n: number) => `AED ${Math.round(n).toLocaleString("en-US")}`;
