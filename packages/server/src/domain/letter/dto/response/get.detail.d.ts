declare class Background {
    path: string;
    width: number;
    height: number;
}
declare class Image {
    path: string;
    width: number;
    height: number;
    x: number;
    y: number;
    z: number;
    ang: number;
}
declare class Text {
    body: string;
    size: number;
    x: number;
    y: number;
}
export declare class GetLetterDetailResponse {
    title: string;
    body?: string;
    background: Background;
    components?: Image[];
    text?: Text[];
}
export {};
