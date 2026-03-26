/**
 * Example: protected tRPC procedure pattern (adapt to your router / context shape).
 * Requires `@trpc/server` in the consuming package. Copy into your API package.
 */

import { initTRPC, TRPCError } from "@trpc/server";
import type { AuthContext } from "../auth-context";
import { PERMISSIONS } from "../permissions";
import {
  assertRecordInCompanyScope,
  AuthError,
  requireAuth,
  requireCompanyAccess,
  requirePermission,
} from "../guards";

export type TrpcContext = {
  auth: AuthContext | null;
};

const t = initTRPC.context<TrpcContext>().create();

function mapAuthError(e: unknown): never {
  if (e instanceof AuthError) {
    if (e.code === "UNAUTHENTICATED") {
      throw new TRPCError({ code: "UNAUTHORIZED", message: e.message });
    }
    throw new TRPCError({ code: "FORBIDDEN", message: e.message });
  }
  throw e;
}

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  try {
    const auth = requireAuth(ctx.auth);
    return next({ ctx: { ...ctx, auth } });
  } catch (e) {
    mapAuthError(e);
  }
});

type CaseRow = { id: string; companyId: string; title: string };

declare const caseRepo: {
  getById(caseId: string): Promise<CaseRow | null>;
};

export const casesRouter = t.router({
  getById: protectedProcedure
    .input(
      (val: unknown): { caseId: string; companyId: string } =>
        val as { caseId: string; companyId: string },
    )
    .query(async ({ ctx, input }) => {
      try {
        const auth = ctx.auth;
        requireCompanyAccess(auth, input.companyId);
        requirePermission(auth, PERMISSIONS.CASES_READ, input.companyId);

        const record = await caseRepo.getById(input.caseId);
        if (!record) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Case not found" });
        }
        assertRecordInCompanyScope(record.companyId, input.companyId);
        return record;
      } catch (e) {
        mapAuthError(e);
      }
    }),
});

export type AppRouter = typeof casesRouter;
