import { authApi } from "../auth/auth.service";
import { toFormData } from "../../utils/FormData";
import type {
    CreateCategoryPayload,
    UpdateCategoryPayload,
    CategoryResponse,
    CategoriesResponse,
} from "./category.types";
import type { ICategory } from "../../types/category.types";

export const categoryApi = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<ICategory[], void>({
            query: () => "/categories",
            transformResponse: (response: IApiResponse<ICategory[]>) =>
                response.result,

            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ category_id }) => ({
                            type: "Category" as const,
                            id: category_id,
                        })),
                        { type: "Category", id: "LIST" },
                    ]
                    : [{ type: "Category", id: "LIST" }],
        }),

        getCategory: builder.query<ICategory, string>({
            query: (categoryId) => `/categories/${categoryId}`,
            transformResponse: (response: IApiResponse<CategoryResponse>) =>
                response.result.category,
            providesTags: (_result, _error, categoryId) => [
                { type: "Category", id: categoryId },
            ],
        }),

        createCategory: builder.mutation<ICategory, CreateCategoryPayload>({
            query: (data) => ({
                url: "/categories",
                method: "POST",
                body: toFormData(data),
            }),
            transformResponse: (response: IApiResponse<CategoryResponse>) =>
                response.result.category,
            invalidatesTags: [{ type: "Category", id: "LIST" }],
        }),

        updateCategory: builder.mutation<
            ICategory,
            { categoryId: string; data: UpdateCategoryPayload }
        >({
            query: ({ categoryId, data }) => ({
                url: `/categories/${categoryId}`,
                method: "PUT",
                body: toFormData(data),
            }),
            transformResponse: (response: IApiResponse<CategoryResponse>) =>
                response.result.category,
            invalidatesTags: (_result, _error, { categoryId }) => [
                { type: "Category", id: categoryId },
                { type: "Category", id: "LIST" },
            ],
        }),

        deleteCategory: builder.mutation<void, string>({
            query: (categoryId) => ({
                url: `/categories/${categoryId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, categoryId) => [
                { type: "Category", id: categoryId },
                { type: "Category", id: "LIST" },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetCategoriesQuery,
    useGetCategoryQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;
