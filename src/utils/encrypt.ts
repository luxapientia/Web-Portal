import crypto from 'crypto';
import { config } from '../config';

console.log(config);

export function encryptPrivateKey(plainKey: string): string {
    const iv = crypto.randomBytes(config.wallet.encryption.ivLength);
    const cipher = crypto.createCipheriv(config.wallet.encryption.algorithm, Buffer.from(config.wallet.encryption.secret), iv);
    let encrypted = cipher.update(plainKey);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decryptPrivateKey(encryptedKey: string): string {
    const [ivHex, encryptedHex] = encryptedKey.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv(config.wallet.encryption.algorithm, Buffer.from(config.wallet.encryption.secret), iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
}   