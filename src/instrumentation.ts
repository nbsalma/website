import type { Instrumentation } from "next";

export const onRequestError: Instrumentation.onRequestError = async (err, request) => {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { reportError } = await import("./lib/errors");
  await reportError(err, { method: request.method, path: request.path, digest: (err as { digest?: string }).digest });
};
