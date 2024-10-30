export const LetterAttachmentCode = {
  THUMBNAIL: 'LA001',
  LETTER: 'LA002',
  BACKGROUND: 'LA003',
  COMPONENT: 'LA004',
} as const;

export type LetterAttachmentCode =
  (typeof LetterAttachmentCode)[keyof typeof LetterAttachmentCode];

export const pathToLetterAttachmentCode = (path: string) => {
  return path.includes('thm/')
    ? LetterAttachmentCode.THUMBNAIL
    : path.includes('ltr/')
      ? LetterAttachmentCode.LETTER
      : path.includes('bgr/')
        ? LetterAttachmentCode.BACKGROUND
        : path.includes('cpn')
          ? LetterAttachmentCode.COMPONENT
          : undefined;
};
