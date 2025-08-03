import { ApiClient } from "@/services/api.client";
import { SuccessResponse } from "@/types/payload/response/common/success.response";
import { Category } from "@/types/entity/category";

export class CategoryService {
  static async getAllCategories() {
    return ApiClient.get("category").json<SuccessResponse<Category[]>>();
  }
}
