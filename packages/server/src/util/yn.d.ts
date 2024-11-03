export declare const YN: {
    readonly Y: "Y";
    readonly N: "N";
};
export type YN = (typeof YN)[keyof typeof YN];
export declare const booleanToYN: (data: boolean) => YN;
