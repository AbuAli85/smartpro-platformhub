export class ServiceRequestTransitionError extends Error {
  readonly code = "INVALID_SERVICE_REQUEST_TRANSITION" as const;

  constructor(message: string) {
    super(message);
    this.name = "ServiceRequestTransitionError";
  }
}
