import {
  PROTECTED_HANDLER_EXCLUSION_REVIEW_METADATA,
} from "./protected-handler-exclusion-review-metadata";
import {
  PROTECTED_HANDLER_EXCLUSION_NEAR_DUE_DAYS,
  isNearDue,
  parseIsoDate,
  startOfUtcToday,
} from "./protected-handler-exclusion-aging";

export interface ProtectedHandlerExclusionSummaryRow {
  handler: string;
  owner: string;
  rationale: string;
  reviewBy: string;
  isNearDue: boolean;
  isOverdue: boolean;
}

export function buildProtectedHandlerExclusionSummary(): ProtectedHandlerExclusionSummaryRow[] {
  const today = startOfUtcToday();

  return Object.entries(PROTECTED_HANDLER_EXCLUSION_REVIEW_METADATA)
    .map(([handler, metadata]) => {
      const reviewDate = parseIsoDate(metadata.reviewBy);
      const isOverdue = reviewDate.getTime() < today.getTime();

      return {
        handler,
        owner: metadata.owner,
        rationale: metadata.rationale,
        reviewBy: metadata.reviewBy,
        isNearDue: isNearDue(
          metadata.reviewBy,
          PROTECTED_HANDLER_EXCLUSION_NEAR_DUE_DAYS,
        ),
        isOverdue,
      };
    })
    .sort((a, b) => a.handler.localeCompare(b.handler));
}

export function formatProtectedHandlerExclusionSummary(
  rows: ProtectedHandlerExclusionSummaryRow[],
): string {
  if (rows.length === 0) {
    return "No protected-handler exclusions currently recorded.";
  }

  return rows
    .map((row) => {
      const status = row.isOverdue
        ? "OVERDUE"
        : row.isNearDue
          ? "NEAR_DUE"
          : "OK";

      return [
        `Handler: ${row.handler}`,
        `Owner: ${row.owner}`,
        `Review By: ${row.reviewBy}`,
        `Status: ${status}`,
        `Rationale: ${row.rationale}`,
      ].join(" | ");
    })
    .join("\n");
}
