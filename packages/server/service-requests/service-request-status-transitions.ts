import type { ServiceRequestStatus } from "../../data/service-requests-repository";
import { ServiceRequestTransitionError } from "../errors/service-request-transition-error";

const allowed: Record<
  ServiceRequestStatus,
  readonly ServiceRequestStatus[]
> = {
  draft: ["submitted"],
  submitted: ["withdrawn", "cancelled"],
  withdrawn: [],
  converted_to_case: [],
  cancelled: [],
};

export function assertAllowedServiceRequestTransition(
  from: ServiceRequestStatus,
  to: ServiceRequestStatus,
): void {
  if (from === to) {
    return;
  }

  const next = allowed[from];
  if (!next.includes(to)) {
    throw new ServiceRequestTransitionError(
      `Disallowed service request status transition: ${from} → ${to}`,
    );
  }
}
