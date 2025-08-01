import { BaseResponse } from "@/types/payload/response/base/base.response";

export interface ErrorResponse extends BaseResponse {
  path: string;
  timestamp: string;
}
