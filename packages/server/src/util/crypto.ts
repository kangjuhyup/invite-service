import * as crypto from 'crypto';

export const sha256Hash = (text: string): string => {
    const hash = crypto.createHash('sha256');
    hash.update(text);
    return hash.digest('hex');
};