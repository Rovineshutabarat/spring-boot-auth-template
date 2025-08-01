import { BaseResponse } from "@/types/payload/response/base/base.response";

export interface SuccessResponse<T> extends BaseResponse {
  data: T;
}
