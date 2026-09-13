import { AxiosError } from "axios";
import { httpClient } from "./http-client";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type Params = Record<string, string | number | boolean | undefined>;

export class UpstreamApiError extends Error {
  readonly status: number | undefined;

  constructor(message: string, status: number | undefined) {
    super(message);
    this.name = "UpstreamApiError";
    this.status = status;
  }
}

class RequestBuilder<T = unknown> {
  private readonly url: string;
  private method: HttpMethod = "GET";
  private params?: Params;

  constructor(url: string) {
    this.url = url;
  }

  withMethod(method: HttpMethod): this {
    this.method = method;
    return this;
  }

  withParams(params: Params): this {
    this.params = params;
    return this;
  }

  async send(): Promise<T> {
    try {
      const response = await httpClient.request<T>({
        url: this.url,
        method: this.method,
        params: this.params,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new UpstreamApiError(
          error.response?.status === 401
            ? "TMDB rejected the request — check that API_KEY is set in .env."
            : "Could not reach the movie database. Please try again.",
          error.response?.status,
        );
      }
      throw error;
    }
  }
}

export function createRequest<T = unknown>(url: string): RequestBuilder<T> {
  return new RequestBuilder<T>(url);
}
