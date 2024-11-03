export declare class MetaDefault {
    width: string;
    height: string;
}
export declare class MetaDetail extends MetaDefault {
    x?: string;
    y?: string;
    z?: string;
    angle?: string;
}
export declare class PrepareRequest {
    thumbnailMeta: MetaDefault;
    letterMeta: MetaDefault;
    backgroundMeta: MetaDefault;
    componentMetas: MetaDetail[];
}
