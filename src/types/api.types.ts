declare global {
    interface IApiResponse<T> {
        result: T;
        code: number;
        message: string;
    }
}