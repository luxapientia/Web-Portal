import crypto from 'crypto';

export function generateRandomInvitationCode(length = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const bytes = crypto.randomBytes(length);
    let code = '';

    for (let i = 0; i < length; i++) {
        code += chars[bytes[i] % chars.length];
    }

    return code;
}

export function generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}