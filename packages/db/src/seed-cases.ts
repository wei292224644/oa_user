import { db } from "./client.js";
import { cases, caseApprovals } from "./schema.js";
import { readFileSync } from "fs";

const DATA_PATH = "/Users/wwj/Desktop/self/oa_user/page-analyzer/crawled_data/case_details_all.json";

interface CaseInfo {
  id: string;
  caseName: string;
  caseStatus: string;
  caseClass?: string | null;
  caseBusiness?: string | null;
  caseTypeStr?: string | null;
  suitType?: string | null;
  lawsuitType?: string | null;
  clientName?: string | null;
  oppositeName?: string | null;
  thirdName?: string | null;
  takername?: string | null;
  auditor?: string | null;
  caseDate?: string | null;
  settledAt?: number | null;
  paymentAt?: number | null;
  auditedAt?: number | null;
  marginAmount?: string | number | null;
  remarks?: string | null;
  archive?: string | null;
  createdAt?: number | null;
  updatedAt?: number | null;
}

interface ApprovalItem {
  id: number;
  caseId: string;
  type?: number | null;
  approve?: number | null;
  approverName?: string | null;
  remark?: string | null;
  createdAt?: number | null;
  updatedAt?: number | null;
}

interface DataItem {
  caseInfo: CaseInfo;
  approveList: ApprovalItem[];
  conflict: unknown[];
}

interface CrawlData {
  crawlTime: string;
  total: number;
  successCount: number;
  failedCount: number;
  failedIds: string[];
  data: DataItem[];
}

function toDate(value: string | number | null | undefined): Date | null {
  if (value == null) return null;
  if (typeof value === "number") return new Date(value);
  return new Date(value);
}

async function main() {
  const raw = readFileSync(DATA_PATH, "utf-8");
  const parsed: CrawlData = JSON.parse(raw);

  console.log(`Total cases to seed: ${parsed.data.length}`);

  for (let i = 0; i < parsed.data.length; i++) {
    const item = parsed.data[i];
    const info = item.caseInfo;

    let archiveObj: unknown = null;
    if (info.archive) {
      try {
        archiveObj = JSON.parse(info.archive);
      } catch {
        archiveObj = info.archive;
      }
    }

    await db
      .insert(cases)
      .values({
        id: info.id,
        caseName: info.caseName || info.name || "未命名案件",
        caseStatus: info.caseStatus,
        caseClass: info.caseClass ?? null,
        caseBusiness: info.caseBusiness ?? null,
        caseTypeStr: info.caseTypeStr ?? null,
        suitType: info.suitType ?? null,
        lawsuitType: info.lawsuitType ?? null,
        clientName: info.clientName ?? null,
        oppositeName: info.oppositeName ?? null,
        thirdName: info.thirdName ?? null,
        takerName: info.takername ?? null,
        auditor: info.auditor ?? null,
        caseDate: toDate(info.caseDate),
        settledAt: toDate(info.settledAt),
        paymentAt: toDate(info.paymentAt),
        auditedAt: toDate(info.auditedAt),
        marginAmount: info.marginAmount != null ? String(info.marginAmount) : null,
        remarks: info.remarks ?? null,
        archive: archiveObj,
        createdAt: toDate(info.createdAt) ?? new Date(),
        updatedAt: toDate(info.updatedAt) ?? new Date(),
      })
      .onConflictDoNothing();

    if (item.approveList && item.approveList.length > 0) {
      const approvals = item.approveList.map((a) => ({
        id: a.id,
        caseId: a.caseId,
        type: a.type ?? null,
        approve: a.approve ?? null,
        approverName: a.approverName ?? null,
        remark: a.remark ?? null,
        createdAt: toDate(a.createdAt) ?? new Date(),
        updatedAt: toDate(a.updatedAt) ?? new Date(),
      }));

      await db.insert(caseApprovals).values(approvals).onConflictDoNothing();
    }

    if ((i + 1) % 50 === 0 || i === parsed.data.length - 1) {
      console.log(`Seeded ${i + 1} / ${parsed.data.length} cases`);
    }
  }

  console.log("Done seeding cases.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
