"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathToLetterAttachmentCode = exports.LetterAttachmentCode = void 0;
exports.LetterAttachmentCode = {
    THUMBNAIL: 'LA001',
    LETTER: 'LA002',
    BACKGROUND: 'LA003',
    COMPONENT: 'LA004',
};
const pathToLetterAttachmentCode = (path) => {
    return path.includes('thm/')
        ? exports.LetterAttachmentCode.THUMBNAIL
        : path.includes('ltr/')
            ? exports.LetterAttachmentCode.LETTER
            : path.includes('bgr/')
                ? exports.LetterAttachmentCode.BACKGROUND
                : path.includes('cpn')
                    ? exports.LetterAttachmentCode.COMPONENT
                    : undefined;
};
exports.pathToLetterAttachmentCode = pathToLetterAttachmentCode;
//# sourceMappingURL=attachment.js.map