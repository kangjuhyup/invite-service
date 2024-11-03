"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomString = void 0;
const randomString = (length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
exports.randomString = randomString;
//# sourceMappingURL=random.js.map