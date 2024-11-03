"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.booleanToYN = exports.YN = void 0;
exports.YN = {
    Y: 'Y',
    N: 'N',
};
const booleanToYN = (data) => {
    return data === true ? exports.YN.Y : exports.YN.N;
};
exports.booleanToYN = booleanToYN;
//# sourceMappingURL=yn.js.map