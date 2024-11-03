export declare const LetterAttachmentCode: {
    readonly THUMBNAIL: "LA001";
    readonly LETTER: "LA002";
    readonly BACKGROUND: "LA003";
    readonly COMPONENT: "LA004";
};
export type LetterAttachmentCode = (typeof LetterAttachmentCode)[keyof typeof LetterAttachmentCode];
export declare const pathToLetterAttachmentCode: (path: string) => "LA001" | "LA002" | "LA003" | "LA004";
