declare class ErrorResponse {
    code: string;
    message: string;
}
export declare class HttpResponse<T> {
    result: boolean;
    data?: T;
    error?: ErrorResponse;
}
export {};
