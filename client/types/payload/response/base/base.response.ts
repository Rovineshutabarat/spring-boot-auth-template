export interface BaseResponse {
  status: "SUCCESS" | "ERROR" | "VALIDATION_ERROR";
  code: number;
  message: string;
}
