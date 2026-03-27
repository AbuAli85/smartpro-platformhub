import { API_CONTRACT_REGISTRY } from "./api-contract-registry";
import { EXPLICITLY_UNGOVERNED_HANDLER_CANDIDATES } from "./protected-handler-candidates";
import {
  PROTECTED_HANDLER_EXCLUSION_REVIEW_METADATA,
} from "./protected-handler-exclusion-review-metadata";
import {
  PROTECTED_HANDLER_EXCLUSION_NEAR_DUE_DAYS,
  isNearDue,
  parseIsoDate,
  startOfUtcToday,
} from "./protected-handler-exclusion-aging";

export interface ProtectedHandlerGovernanceHealth {
  governedHandlers: number;
  excludedHandlers: number;
  nearDueExclusions: number;
  overdueExclusions: number;
}

export function getProtectedHandlerGovernanceHealth(): ProtectedHandlerGovernanceHealth {
  const today = startOfUtcToday();

  let nearDue = 0;
  let overdue = 0;

  for (const metadata of Object.values(PROTECTED_HANDLER_EXCLUSION_REVIEW_METADATA)) {
    const reviewDate = parseIsoDate(metadata.reviewBy);

    if (reviewDate.getTime() < today.getTime()) {
      overdue++;
      continue;
    }

    if (isNearDue(metadata.reviewBy, PROTECTED_HANDLER_EXCLUSION_NEAR_DUE_DAYS)) {
      nearDue++;
    }
  }

  return {
    governedHandlers: API_CONTRACT_REGISTRY.length,
    excludedHandlers: EXPLICITLY_UNGOVERNED_HANDLER_CANDIDATES.length,
    nearDueExclusions: nearDue,
    overdueExclusions: overdue,
  };
}
