import { getBackendApiUrl } from "@/lib/backend/env";

export type BackendErrorBody = {
  error?: {
    code?: string;
    message?: string;
    fieldErrors?: Record<string, string[]>;
  };
};

export class BackendRequestError extends Error {
  status: number;
  code?: string;
  fieldErrors?: Record<string, string[]>;

  constructor(
    message: string,
    init?: {
      status?: number;
      code?: string;
      fieldErrors?: Record<string, string[]>;
    },
  ) {
    super(message);
    this.name = "BackendRequestError";
    this.status = init?.status ?? 500;
    this.code = init?.code;
    this.fieldErrors = init?.fieldErrors;
  }
}

type BackendSuccess<T, M> = {
  data: T;
  meta: M;
};

export async function backendGet<T, M = undefined>(
  path: string,
): Promise<BackendSuccess<T, M>> {
  const url = `${getBackendApiUrl()}${path}`;
  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
  } catch {
    throw new BackendRequestError(
      "The project archive is temporarily unavailable.",
      { status: 503, code: "backend_unreachable" },
    );
  }

  const json = (await response.json().catch(() => ({}))) as BackendSuccess<
    T,
    M
  > &
    BackendErrorBody;

  if (!response.ok) {
    throw new BackendRequestError(
      json.error?.message ?? "Unable to load published projects.",
      {
        status: response.status,
        code: json.error?.code,
        fieldErrors: json.error?.fieldErrors,
      },
    );
  }

  return {
    data: json.data,
    meta: json.meta as M,
  };
}

export async function backendPost<T>(
  path: string,
  body: string,
  headers?: HeadersInit,
): Promise<{ data: T; status: number; error?: BackendErrorBody["error"] }> {
  const url = `${getBackendApiUrl()}${path}`;
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...headers,
      },
      body,
      cache: "no-store",
    });
  } catch {
    throw new BackendRequestError(
      "The consultation desk is temporarily unavailable.",
      { status: 503, code: "backend_unreachable" },
    );
  }

  const json = (await response.json().catch(() => ({}))) as {
    data?: T;
  } & BackendErrorBody;

  if (!response.ok) {
    throw new BackendRequestError(
      json.error?.message ?? "Unable to send the consultation request.",
      {
        status: response.status,
        code: json.error?.code,
        fieldErrors: json.error?.fieldErrors,
      },
    );
  }

  return { data: json.data as T, status: response.status };
}
