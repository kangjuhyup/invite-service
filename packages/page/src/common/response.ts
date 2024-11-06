export default interface ApiResponse<T> {
    result : boolean
    data? : T
    error? : any;
}